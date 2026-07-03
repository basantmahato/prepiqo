import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator,
  Modal, TouchableWithoutFeedback, Share
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { marked } from 'marked';
import api from '../../lib/axios';
import InteractiveMCQ from '../../components/InteractiveMCQ';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QA {
  question: string;
  answer: string;
}

type GenerationMode = 'mcq' | 'notes' | 'qa' | 'chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: GenerationMode;
  mcqs?: MCQ[];
  qa?: QA[];
}

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const navigation = useNavigation();

  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [mode, setMode] = useState<GenerationMode>('chat');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuestionsMenuOpen, setIsQuestionsMenuOpen] = useState(false);
  const [isDifficultyMenuOpen, setIsDifficultyMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeHistoryItem, setActiveHistoryItem] = useState<any>(null);
  const [isSharing, setIsSharing] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your MCQBot.\n\nWhat would you like to generate today? You can choose MCQs, Study Notes, or Q&A using the + button next to the input.',
      type: 'chat'
    }
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scroll on new message
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  // Load chat history if chatId is provided
  useEffect(() => {
    if (chatId) {
      loadHistoryChat(chatId as string);
    } else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I am your MCQBot.\n\nWhat would you like to generate today? You can choose MCQs, Study Notes, or Q&A using the + button next to the input.',
          type: 'chat'
        }
      ]);
      setActiveHistoryItem(null);
      setMode('chat');
    }
  }, [chatId]);

  const loadHistoryChat = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get('/data/chatshistory');
      const histories = response.data.data || [];
      const chat = histories.find((c: any) => c._id === id);
      
      if (chat) {
        setActiveHistoryItem(chat);
        let chatType: GenerationMode = 'mcq';
        if (chat.title.startsWith('Notes on')) chatType = 'notes';
        else if (chat.title.startsWith('Q&A on')) chatType = 'qa';
        else if (chat.title.startsWith('Chat:')) chatType = 'chat';

        setMode(chatType);
        
        // Map messages
        const formattedMessages = chat.messages.map((m: any, idx: number) => {
          const msg: Message = {
            id: m._id || Date.now().toString() + idx,
            role: m.role,
            content: m.content,
            type: chatType
          };

          if (m.role === 'assistant' && (chatType === 'mcq' || chatType === 'qa')) {
            try {
              const parsed = JSON.parse(m.content);
              if (chatType === 'mcq') msg.mcqs = parsed;
              if (chatType === 'qa') msg.qa = parsed;
              msg.content = `Here is your generated content:`;
            } catch (e) {
              console.log("Failed to parse history data");
            }
          }
          return msg;
        });

        setMessages(formattedMessages);
      }
    } catch (err) {
      console.log('Failed to load chat history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!activeHistoryItem) return;
    try {
      setIsSharing(true);
      if (!activeHistoryItem.isShared) {
        const response = await api.post(`/data/chatshistory/${activeHistoryItem._id}/share`);
        if (response.data.success) {
          setActiveHistoryItem((prev: any) => ({ ...prev, isShared: true }));
        }
      }
      const shareUrl = `https://mcqbot.com/share/${activeHistoryItem._id}`;
      await Share.share({
        message: `Check out this content I generated using MCQBot: ${shareUrl}`,
        url: shareUrl,
      });
    } catch (err) {
      console.log('Failed to share', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!activeHistoryItem) return;
    try {
      let contentHtml = '';
      if (mode === 'mcq' && messages.length > 0) {
        const mcqMsg = messages.find(m => m.type === 'mcq' && m.mcqs);
        if (mcqMsg && mcqMsg.mcqs) {
          contentHtml = mcqMsg.mcqs.map((q, i) => `
            <div style="margin-bottom: 20px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #111827;">${i+1}. ${q.question}</h3>
              <ul style="list-style-type: none; padding-left: 0;">
                ${q.options.map(opt => `<li style="padding: 5px 0;">- ${opt}</li>`).join('')}
              </ul>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <p style="color: #4f46e5; font-weight: bold; margin: 0;">Answer: ${q.answer}</p>
                <p style="color: #4b5563; font-size: 14px; margin: 5px 0 0 0;">${q.explanation}</p>
              </div>
            </div>
          `).join('');
        }
      } else if (mode === 'qa' && messages.length > 0) {
        const qaMsg = messages.find(m => m.type === 'qa' && m.qa);
        if (qaMsg && qaMsg.qa) {
          contentHtml = qaMsg.qa.map((q, i) => `
            <div style="margin-bottom: 20px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #111827;"><span style="color:#4f46e5;">Q:</span> ${q.question}</h3>
              <p style="color: #4b5563; margin-bottom: 0;"><span style="color:#4f46e5; font-weight: bold;">A:</span> ${q.answer}</p>
            </div>
          `).join('');
        }
      } else {
        const asstMsg = messages.find(m => m.role === 'assistant');
        if (asstMsg) {
          contentHtml = await marked.parse(asstMsg.content);
        }
      }

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #1F2937; line-height: 1.5; }
              h1 { color: #0A2540; margin-bottom: 5px; }
              .date { color: #6B7280; font-size: 14px; margin-bottom: 30px; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${activeHistoryItem.title}</h1>
            <div class="date">Generated on ${new Date(activeHistoryItem.createdAt).toLocaleString()}</div>
            ${contentHtml}
            <div class="footer">Generated by MCQBot - <a href="https://mcqbot.com">mcqbot.com</a></div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.log('Error generating PDF', error);
    }
  };

  useEffect(() => {
    if (activeHistoryItem && activeHistoryItem._id === chatId) {
      navigation.setOptions({
        headerRight: () => (
          <View className="flex-row items-center mr-2">
            <TouchableOpacity 
              onPress={handleShare}
              disabled={isSharing}
              className={`px-3 py-1.5 rounded-lg border flex-row items-center ${activeHistoryItem.isShared ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}
            >
              <Ionicons name="share-social-outline" size={16} color={activeHistoryItem.isShared ? '#5244E2' : '#4B5563'} />
              <Text className={`ml-2 text-xs font-semibold ${activeHistoryItem.isShared ? 'text-[#5244E2]' : 'text-[#4B5563]'}`}>
                {activeHistoryItem.isShared ? 'Shared' : 'Share'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDownloadPdf}
              className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 ml-2"
            >
              <Ionicons name="download-outline" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: () => null });
    }
  }, [activeHistoryItem, isSharing, messages, chatId]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    let userContent = '';
    if (mode === 'mcq') userContent = `Generate ${numQuestions} ${difficulty} MCQs about ${topic}`;
    else if (mode === 'notes') userContent = `Generate detailed study notes about ${topic}`;
    else if (mode === 'qa') userContent = `Generate ${numQuestions} Q&A pairs about ${topic} (${difficulty})`;
    else if (mode === 'chat') userContent = topic;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent
    };

    setMessages(prev => [...prev, userMessage]);
    setActiveHistoryItem(null);
    navigation.setOptions({ headerRight: () => null });
    
    const currentTopic = topic;
    const currentMode = mode;
    setTopic('');
    setLoading(true);

    try {
      let endpoint = '/data/generate';
      let payload: any = { topic: currentTopic, numQuestions, difficulty };
      
      if (currentMode === 'notes') {
        endpoint = '/data/generate-notes';
        payload = { topic: currentTopic };
      } else if (currentMode === 'qa') {
        endpoint = '/data/generate-qa';
      } else if (currentMode === 'chat') {
        endpoint = '/data/generate-chat';
        payload = { topic: currentTopic };
      }

      const response = await api.post(endpoint, payload);
      
      if (response.data.success) {
        let assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          type: currentMode
        };

        if (currentMode === 'mcq') {
          assistantMessage.content = `Here are your ${numQuestions} ${difficulty} questions about "${currentTopic}":`;
          assistantMessage.mcqs = response.data.data;
        } else if (currentMode === 'notes') {
          assistantMessage.content = response.data.data; 
        } else if (currentMode === 'qa') {
          assistantMessage.content = `Here are your ${numQuestions} ${difficulty} Q&A pairs about "${currentTopic}":`;
          assistantMessage.qa = response.data.data;
        } else if (currentMode === 'chat') {
          assistantMessage.content = response.data.data;
        }

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Failed to generate content. Please try again.',
          type: 'chat'
        }]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'An error occurred while generating.';
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage === 'Anonymous Limit Reached' 
          ? 'You have used your 5 free trial requests. Please sign up to continue generating!' 
          : errorMessage,
        type: 'chat'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.role === 'user';

    return (
      <View key={msg.id} className={`flex-row mb-6 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="w-10 h-10 rounded-full bg-[#5244E2] justify-center items-center mr-3 mt-1 shadow-sm shrink-0">
            <Ionicons name="cube-outline" size={20} color="white" />
          </View>
        )}

        <View className={`${isUser ? 'max-w-[85%] bg-[#0A2540] rounded-2xl rounded-tr-sm px-4 py-3' : 'flex-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm'}`}>
          {isUser ? (
            <Text className="text-white text-base leading-6">{msg.content}</Text>
          ) : (
            <>
              {(!msg.type || msg.type === 'chat' || msg.type === 'notes') && (
                <Markdown
                  style={{
                    body: { color: '#1F2937', fontSize: 15, lineHeight: 24 },
                    heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: '#0A2540' },
                    heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: '#0A2540' },
                    heading3: { fontSize: 18, fontWeight: 'bold', marginVertical: 8, color: '#0A2540' },
                    paragraph: { marginBottom: 10, color: '#1F2937' },
                    list_item: { marginBottom: 5, color: '#1F2937' },
                  }}
                >
                  {msg.content}
                </Markdown>
              )}

              {msg.type === 'mcq' && msg.mcqs && (
                <View className="mt-2">
                  <Text className="text-[#1F2937] text-base mb-4 font-medium">{msg.content}</Text>
                  {msg.mcqs.map((mcq, idx) => (
                    <InteractiveMCQ key={idx} mcq={mcq} index={idx} />
                  ))}
                </View>
              )}

              {msg.type === 'qa' && msg.qa && (
                <View className="mt-2">
                  <Text className="text-[#1F2937] text-base mb-4 font-medium">{msg.content}</Text>
                  {msg.qa.map((qaItem, idx) => (
                    <View key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
                      <View className="flex-row items-start mb-2">
                        <Text className="text-[#5244E2] font-bold text-base mr-2">Q.</Text>
                        <Text className="font-semibold text-base text-[#0A2540] flex-1">{qaItem.question}</Text>
                      </View>
                      <View className="border-t border-gray-100 pt-2 flex-row items-start pl-6">
                        <Text className="text-[#5244E2] font-bold mr-2">A.</Text>
                        <Text className="text-[#6B7280] flex-1">{qaItem.answer}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Copy Button */}
              {msg.id !== 'welcome' && (
                <View className="flex-row justify-end mt-2 pt-3 border-t border-gray-100">
                  <TouchableOpacity 
                    onPress={async () => {
                      let textToCopy = msg.content;
                      if (msg.type === 'mcq' && msg.mcqs) {
                        textToCopy = msg.mcqs.map((q, i) => `${i+1}. ${q.question}\n${q.options.map(o => `- ${o}`).join('\n')}\nAnswer: ${q.answer}\n${q.explanation}`).join('\n\n');
                      } else if (msg.type === 'qa' && msg.qa) {
                        textToCopy = msg.qa.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
                      }
                      await Clipboard.setStringAsync(textToCopy);
                    }}
                    className="flex-row items-center px-2 py-1 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <Ionicons name="copy-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-1.5 font-medium">Copy</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {isUser && (
          <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center ml-3 mt-1 shadow-sm shrink-0">
            <Text className="font-bold text-gray-700">U</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          className="px-4 py-6"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderMessage)}

          {loading && (
            <View className="flex-row mb-6 w-full justify-start items-center">
              <View className="w-10 h-10 rounded-full bg-[#5244E2] justify-center items-center mr-3 mt-1 shadow-sm shrink-0">
                <Ionicons name="cube-outline" size={20} color="white" />
              </View>
              <View className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 p-4 shadow-sm flex-row items-center space-x-2">
                <ActivityIndicator size="small" color="#5244E2" />
                <Text className="text-gray-500 ml-2">Generating...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Feature Menu Popup */}
        <Modal
          visible={isMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
            <View className="flex-1 justify-end items-start px-4 pb-28">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-2xl border border-gray-200 shadow-lg w-56 p-2">
                  <TouchableOpacity 
                    onPress={() => { setMode('mcq'); setIsMenuOpen(false); }}
                    className={`flex-row items-center p-3 rounded-lg mb-1 ${mode === 'mcq' ? 'bg-[#EEF2FF]' : ''}`}
                  >
                    <Ionicons name="checkmark-done" size={20} color={mode === 'mcq' ? '#5244E2' : '#6B7280'} className="mr-3" />
                    <Text className={`ml-3 font-medium ${mode === 'mcq' ? 'text-[#5244E2]' : 'text-[#374151]'}`}>Generate MCQs</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => { setMode('notes'); setIsMenuOpen(false); }}
                    className={`flex-row items-center p-3 rounded-lg mb-1 ${mode === 'notes' ? 'bg-[#EEF2FF]' : ''}`}
                  >
                    <Ionicons name="document-text-outline" size={20} color={mode === 'notes' ? '#5244E2' : '#6B7280'} className="mr-3" />
                    <Text className={`ml-3 font-medium ${mode === 'notes' ? 'text-[#5244E2]' : 'text-[#374151]'}`}>Generate Notes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => { setMode('qa'); setIsMenuOpen(false); }}
                    className={`flex-row items-center p-3 rounded-lg mb-1 ${mode === 'qa' ? 'bg-[#EEF2FF]' : ''}`}
                  >
                    <Ionicons name="help-circle-outline" size={20} color={mode === 'qa' ? '#5244E2' : '#6B7280'} className="mr-3" />
                    <Text className={`ml-3 font-medium ${mode === 'qa' ? 'text-[#5244E2]' : 'text-[#374151]'}`}>Generate Q&A</Text>
                  </TouchableOpacity>
                  <View className="h-px bg-gray-200 my-1 mx-2" />
                  <TouchableOpacity 
                    onPress={() => { setMode('chat'); setIsMenuOpen(false); }}
                    className={`flex-row items-center p-3 rounded-lg ${mode === 'chat' ? 'bg-[#EEF2FF]' : ''}`}
                  >
                    <Ionicons name="chatbubble-outline" size={20} color={mode === 'chat' ? '#5244E2' : '#6B7280'} className="mr-3" />
                    <Text className={`ml-3 font-medium ${mode === 'chat' ? 'text-[#5244E2]' : 'text-[#374151]'}`}>AI Assistant</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Questions Dropdown Modal */}
        <Modal
          visible={isQuestionsMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsQuestionsMenuOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsQuestionsMenuOpen(false)}>
            <View className="flex-1 justify-end items-start px-4 pb-32 ml-16">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-xl border border-gray-200 shadow-lg w-32 p-2">
                  {[5, 10, 15, 20].map(n => (
                    <TouchableOpacity 
                      key={n}
                      onPress={() => { setNumQuestions(n); setIsQuestionsMenuOpen(false); }}
                      className={`p-3 rounded-lg mb-1 items-center ${numQuestions === n ? 'bg-[#EEF2FF]' : ''}`}
                    >
                      <Text className={`font-medium ${numQuestions === n ? 'text-[#5244E2]' : 'text-[#374151]'}`}>{n} Questions</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Difficulty Dropdown Modal */}
        <Modal
          visible={isDifficultyMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDifficultyMenuOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDifficultyMenuOpen(false)}>
            <View className="flex-1 justify-end items-end px-4 pb-32 pr-12">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-xl border border-gray-200 shadow-lg w-32 p-2">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <TouchableOpacity 
                      key={d}
                      onPress={() => { setDifficulty(d); setIsDifficultyMenuOpen(false); }}
                      className={`p-3 rounded-lg mb-1 items-center ${difficulty === d ? 'bg-[#EEF2FF]' : ''}`}
                    >
                      <Text className={`font-medium ${difficulty === d ? 'text-[#5244E2]' : 'text-[#374151]'}`}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Bottom Input Area */}
        <View className="px-4 pb-6 pt-2 bg-white/90">
          
          {/* Configuration Row */}
          {(mode === 'mcq' || mode === 'qa') && (
            <View className="flex-row justify-between mb-3 px-1">
              <View className="flex-row items-center">
                <Text className="text-xs font-bold text-gray-500 uppercase mr-2">Questions:</Text>
                <TouchableOpacity 
                  onPress={() => setIsQuestionsMenuOpen(true)}
                  className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  <Text className="text-xs font-bold text-[#5244E2] mr-1">{numQuestions}</Text>
                  <Ionicons name="chevron-down" size={14} color="#5244E2" />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs font-bold text-gray-500 uppercase mr-2">Diff:</Text>
                <TouchableOpacity 
                  onPress={() => setIsDifficultyMenuOpen(true)}
                  className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  <Text className="text-xs font-bold text-[#5244E2] mr-1">{difficulty}</Text>
                  <Ionicons name="chevron-down" size={14} color="#5244E2" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="flex-row items-center bg-white rounded-2xl border border-gray-300 p-2 shadow-sm">
            
            {/* Plus Button */}
            <TouchableOpacity 
              onPress={() => setIsMenuOpen(true)}
              className="w-10 h-10 rounded-xl border border-gray-200 justify-center items-center bg-[#F9FAFB]"
            >
              <Ionicons name={isMenuOpen ? "close" : "add"} size={24} color="#4B5563" />
            </TouchableOpacity>

            {/* Input Field */}
            <TextInput
              className="flex-1 mx-3 text-base text-[#1F2937] h-10"
              placeholder={
                mode === 'mcq' ? "Topic for MCQs... (e.g. React)" : 
                mode === 'notes' ? "Topic for notes... (e.g. History)" : 
                mode === 'qa' ? "Topic for Q&A... (e.g. Science)" : 
                "Ask the AI Assistant anything..."
              }
              placeholderTextColor="#9CA3AF"
              value={topic}
              onChangeText={setTopic}
              multiline
            />

            {/* Separator */}
            <View className="w-[1px] h-8 bg-gray-200 mx-1" />

            {/* Send Button */}
            <TouchableOpacity 
              onPress={handleGenerate}
              disabled={!topic.trim() || loading}
              className={`w-10 h-10 rounded-xl justify-center items-center ml-1 ${topic.trim() && !loading ? 'bg-[#5244E2]' : 'bg-[#A78BFA]'}`}
            >
              <Ionicons name="send" size={18} color="white" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          {/* Footer Disclaimer */}
          <Text className="text-center text-xs text-[#9CA3AF] mt-3">
            MCQBot can make mistakes. Consider verifying generated content.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}