'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// InteractiveMCQ cannot be directly used if it relies on auth/dashboard context, 
// but since it's just a pure UI component with state for selectedOption, we can import it.
import InteractiveMCQ from '../../../components/InteractiveMCQ';

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

export default function SharedChatPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [chatType, setChatType] = useState<'mcq' | 'notes' | 'qa' | 'chat' | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchSharedContent();
    }
  }, [id]);

  const fetchSharedContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/data/shared/${id}`);
      
      const chatData = response.data.data;
      setChat(chatData);

      let type: 'mcq' | 'notes' | 'qa' | 'chat' = 'mcq';
      if (chatData.title.startsWith('Notes on')) type = 'notes';
      else if (chatData.title.startsWith('Q&A on')) type = 'qa';
      else if (chatData.title.startsWith('Chat:')) type = 'chat';
      
      setChatType(type);

      const assistantMsg = chatData.messages.find((m: any) => m.role === 'assistant');
      if (assistantMsg) {
        if (type === 'notes' || type === 'chat') {
          setParsedData(assistantMsg.content);
        } else {
          try {
            const parsed = JSON.parse(assistantMsg.content);
            setParsedData(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            console.error("Failed to parse shared data:", e);
            setParsedData(null);
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Content not found or is private');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-border-subtle text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">Not Found</h1>
          <p className="text-text-secondary mb-8">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors w-full"
          >
            Go to MCQBot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">
              M
            </div>
            <div>
              <h1 className="font-bold text-text-primary text-lg">MCQBot</h1>
              <p className="text-xs text-text-secondary font-medium">Shared Learning Content</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/register')}
            className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors hidden sm:block"
          >
            Create Your Own
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border-subtle p-6 md:p-10">
          <div className="mb-10 pb-8 border-b border-border-subtle text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">{chat.title}</h2>
            <div className="flex items-center justify-center gap-4 text-text-secondary text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Shared by {chat.user?.name || 'a user'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {new Date(chat.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {(chatType === 'notes' || chatType === 'chat') && parsedData ? (
            <div className="prose prose-indigo prose-lg max-w-none text-text-primary mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsedData as string}</ReactMarkdown>
            </div>
          ) : chatType === 'qa' && Array.isArray(parsedData) && parsedData.length > 0 ? (
            <div className="space-y-6">
              {(parsedData as QA[]).map((qaItem, index) => (
                <div key={index} className="bg-bg-secondary border border-border-subtle rounded-xl p-6 md:p-8">
                  <h3 className="font-semibold text-xl mb-4 flex gap-3 text-text-primary leading-snug">
                    <span className="text-brand shrink-0">Q.</span> 
                    {qaItem.question}
                  </h3>
                  <div className="pl-8 md:pl-10 pt-4 border-t border-border-subtle text-text-secondary text-lg leading-relaxed">
                     <span className="font-semibold text-brand mr-2">A.</span>
                     {qaItem.answer}
                  </div>
                </div>
              ))}
            </div>
          ) : chatType === 'mcq' && Array.isArray(parsedData) && parsedData.length > 0 ? (
            <div className="space-y-8">
              {(parsedData as MCQ[]).map((mcq, index) => (
                <InteractiveMCQ key={index} mcq={mcq} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              Failed to parse content.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
