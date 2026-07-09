'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams?.get('chatId');
  const { isAuthenticated } = useAuthStore();
  
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [mode, setMode] = useState<GenerationMode>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [latestAssistantMessageId, setLatestAssistantMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am Prepiqo. What would you like to generate today? You can choose MCQs, Study Notes, or Q&A using the + button next to the input.',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am Prepiqo. What would you like to generate today? You can choose MCQs, Study Notes, or Q&A using the + button next to the input.',
          }
        ]);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/data/chatshistory/${chatId}`);
        const chatData = response.data.data;
        
        if (chatData && chatData.messages) {
          const parsedMessages = chatData.messages.map((m: any, i: number) => {
            const msg: Message = {
              id: m._id || i.toString(),
              role: m.role,
              content: m.content
            };
            
            if (m.role === 'assistant') {
              try {
                // Try parsing JSON if it was MCQs or QA
                const parsed = JSON.parse(m.content);
                if (Array.isArray(parsed)) {
                  if (parsed.length > 0 && 'options' in parsed[0]) {
                    msg.type = 'mcq';
                    msg.mcqs = parsed;
                    msg.content = 'Here are your generated MCQs:';
                  } else if (parsed.length > 0 && 'answer' in parsed[0]) {
                    msg.type = 'qa';
                    msg.qa = parsed;
                    msg.content = 'Here are your Q&A pairs:';
                  }
                }
              } catch (e) {
                // If parsing fails, it's either chat or notes, which are just markdown strings
                if (chatData.title?.startsWith('Notes')) {
                  msg.type = 'notes';
                } else {
                  msg.type = 'chat';
                }
              }
            }
            return msg;
          });
          
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Failed to load chat:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChat();
  }, [chatId]);

  // Removed redirect, unauthenticated users are allowed to use Try Prepiqo

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (latestAssistantMessageId) {
      // Small delay to ensure the DOM is updated with the new message content
      setTimeout(() => {
        const el = document.getElementById(`msg-container-${latestAssistantMessageId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      scrollToBottom();
    }
  }, [messages, loading, latestAssistantMessageId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setLatestAssistantMessageId(null); // Reset on new user request
    const currentTopic = topic;
    const currentMode = mode;
    setTopic('');
    setLoading(true);

    try {
      let endpoint = '/data/generate';
      let payload: any = { topic, numQuestions, difficulty };
      
      if (currentMode === 'notes') {
        endpoint = '/data/generate-notes';
        payload = { topic };
      } else if (currentMode === 'qa') {
        endpoint = '/data/generate-qa';
      } else if (currentMode === 'chat') {
        endpoint = '/data/generate-chat';
        payload = { topic };
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
          assistantMessage.content = response.data.data; // Markdown text
        } else if (currentMode === 'qa') {
          assistantMessage.content = `Here are your ${numQuestions} ${difficulty} Q&A pairs about "${currentTopic}":`;
          assistantMessage.qa = response.data.data;
        } else if (currentMode === 'chat') {
          assistantMessage.content = response.data.data;
        }

        setMessages(prev => [...prev, assistantMessage]);
        setLatestAssistantMessageId(assistantMessage.id);
      } else {
        const errId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
          id: errId,
          role: 'assistant',
          content: 'Failed to generate content. Please try again.'
        }]);
        setLatestAssistantMessageId(errId);
      }
    } catch (err: any) {
      const errId = (Date.now() + 1).toString();
      const errorMessage = err.response?.data?.error || 'An error occurred while generating.';
      
      setMessages(prev => [...prev, {
        id: errId,
        role: 'assistant',
        content: errorMessage === 'Anonymous Limit Reached' 
          ? 'You have used your 5 free trial requests. Please sign up to continue generating and get 15 more free requests!' 
          : err.response?.data?.message || errorMessage
      }]);
      setLatestAssistantMessageId(errId);
      
      // If it's the specific limit reached error, we could show a modal or the inline message above
      if (errorMessage === 'Anonymous Limit Reached') {
        setTimeout(() => router.push('/register?reason=limit_reached'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (msgId: string) => {
    if (typeof window === 'undefined') return;
    
    // Dynamically import
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.getElementById(`pdf-msg-${msgId}`);
    if (!element) return;
    
    // Add the site link temporarily at the bottom
    const linkDiv = document.createElement('div');
    linkDiv.className = 'mt-10 pt-6 border-t border-border-subtle text-center text-sm text-text-secondary';
    linkDiv.innerHTML = `Generated by <strong>Prepiqo</strong> - <a href="${window.location.origin}" style="color: #4f46e5; text-decoration: none;">${window.location.origin}</a>`;
    element.appendChild(linkDiv);
    
    const opt = {
      margin:       15,
      filename:     `mcqbot_generation_${msgId}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: ['css', 'legacy'], avoid: ['.pdf-avoid-break', 'p', 'li', 'h1', 'h2', 'h3', 'h4', 'div.bg-white'] }
    };
    
    // Save PDF
    await html2pdf().from(element).set(opt).save();
    
    // Remove the temporary link div
    element.removeChild(linkDiv);
  };

  const ModeIcon = ({ m, className }: { m: GenerationMode, className?: string }) => {
    if (m === 'mcq') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
    if (m === 'notes') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    if (m === 'qa') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    return null;
  };

  if (!isMounted) return null; 

  return (
    <main className="flex flex-col h-full bg-bg-secondary relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} id={`msg-container-${msg.id}`} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
              )}
              
              <div className={`max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'bg-text-primary text-bg-primary px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm' : 'w-full'}`}>
                
                {msg.role === 'assistant' ? (
                  <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6 mb-2 relative group">
                    {/* Header with Download Button for non-welcome messages */}
                    {msg.id !== 'welcome' && msg.type && (
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => handleDownloadPdf(msg.id)}
                            data-html2canvas-ignore="true"
                            className="flex items-center justify-center p-2 rounded-lg bg-bg-secondary hover:bg-border-subtle border border-border-strong text-text-secondary hover:text-text-primary transition-colors shadow-sm"
                            title="Download as PDF"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </button>
                       </div>
                    )}

                    <div id={`pdf-msg-${msg.id}`} className="bg-white p-1">
                      {/* Render Chat/Notes/Errors/Welcome using Markdown */}
                      {(!msg.type || msg.type === 'notes' || msg.type === 'chat') && (
                        <div className="prose prose-indigo max-w-none text-text-primary mt-3">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      )}

                      {/* Render MCQs */}
                      {msg.type === 'mcq' && msg.mcqs && (
                        <div className="space-y-6 mt-4">
                          <p className="text-text-primary mb-4 leading-relaxed font-medium">{msg.content}</p>
                          {msg.mcqs.map((mcq, index) => (
                            <InteractiveMCQ key={index} mcq={mcq} index={index} />
                          ))}
                        </div>
                      )}

                      {/* Render Q&A */}
                      {msg.type === 'qa' && msg.qa && (
                        <div className="space-y-4 mt-4">
                          <p className="text-text-primary mb-4 leading-relaxed font-medium">{msg.content}</p>
                          {msg.qa.map((qaItem, index) => (
                            <div key={index} className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm pdf-avoid-break">
                              <h3 className="font-semibold text-lg mb-3 flex gap-3 text-text-primary">
                                <span className="text-brand shrink-0">Q.</span> 
                                {qaItem.question}
                              </h3>
                              <div className="pl-8 pt-3 border-t border-border-subtle text-text-secondary">
                                 <span className="font-semibold text-brand mr-2">A.</span>
                                 {qaItem.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.content}</p>
                )}

              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-border-strong text-text-primary flex items-center justify-center shrink-0 mt-1 font-bold text-xs shadow-sm">
                  U
                </div>
              )}

            </div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
              <div className="bg-white border border-border-subtle px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:-0ms]"></div>
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]"></div>
                <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]"></div>
              </div>
            </div>
          )}
          
          {/* Large spacer so the absolute input bar doesn't overlap the last message when scrolled to bottom */}
          <div className="h-48 md:h-56" />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent pt-12 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleGenerate} className="bg-white border border-border-strong rounded-2xl shadow-xl p-2 transition-all">
            
            {/* Configuration Row (Only show if MCQ or QA requires config) */}
            {mode !== 'notes' && mode !== 'chat' && (
              <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border-subtle rounded-t-2xl sm:border-b-0 sm:border-r sm:rounded-none">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Questions:</label>
                  <select 
                    className="text-sm bg-transparent border-none text-text-primary font-bold focus:ring-0 cursor-pointer p-0 hover:text-brand transition-colors"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    title="Number of Questions"
                    aria-label="Number of Questions"
                  >
                    {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="w-px h-4 bg-border-strong self-center"></div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Difficulty:</label>
                  <select 
                    className="text-sm bg-transparent border-none text-text-primary font-bold focus:ring-0 cursor-pointer p-0 hover:text-brand transition-colors"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    title="Difficulty Level"
                    aria-label="Difficulty Level"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 px-1 pb-1 relative">
              
              {/* Feature Selector (+) Button */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary text-text-secondary hover:bg-border-subtle hover:text-text-primary transition-colors border border-border-strong shadow-sm"
                  title="Select Generation Mode"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                
                {/* Feature Menu Popup */}
                {isMenuOpen && (
                  <div className="absolute bottom-12 left-0 w-56 bg-white border border-border-subtle rounded-2xl shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      type="button"
                      onClick={() => { setMode('mcq'); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 ${mode === 'mcq' ? 'bg-brand/10 text-brand' : 'text-text-primary hover:bg-gray-50'}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                      Generate MCQs
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('notes'); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 border-t border-border-subtle ${mode === 'notes' ? 'bg-brand/10 text-brand' : 'text-text-primary hover:bg-gray-50'}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Study Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('qa'); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 border-t border-border-subtle ${mode === 'qa' ? 'bg-brand/10 text-brand' : 'text-text-primary hover:bg-gray-50'}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      Q&A Flashcards
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('chat'); setIsMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 border-t border-border-subtle ${mode === 'chat' ? 'bg-brand/10 text-brand' : 'text-text-primary hover:bg-gray-50'}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      AI Assistant
                    </button>
                  </div>
                )}
              </div>

              <textarea 
                className="w-full px-3 py-2 bg-transparent border-none text-text-primary text-base resize-none focus:outline-none max-h-32 placeholder:text-text-muted min-h-[40px] flex-1 self-center"
                placeholder={
                  mode === 'mcq' ? "Topic for MCQs... (e.g. React Hooks)" : 
                  mode === 'notes' ? "Topic for study notes... (e.g. World War 2)" : 
                  mode === 'qa' ? "Topic for Q&A... (e.g. Photosynthesis)" : 
                  "Chat with AI..."
                }
                rows={1}
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (topic.trim()) handleGenerate(e as unknown as React.FormEvent);
                  }
                }}
              />

              <button 
                type="submit" 
                title="Send message"
                aria-label="Send message"
                disabled={loading || !topic.trim()}
                className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm hover:shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}
