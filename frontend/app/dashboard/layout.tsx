'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams?.get('chatId');
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setIsSidebarOpen(saved === 'true');
    }
    setIsMounted(true);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.get('/data/chatshistory');
      setHistory(response.data.data || []);
    } catch (err) {
      console.log('Failed to fetch history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Update both state and localStorage
  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem('sidebarOpen', String(open));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'New Chat', path: '/dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg> },
    { name: 'Profile', path: '/dashboard/profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { name: 'Settings', path: '/dashboard/settings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> },
  ];

  const visibleNavItems = (!isMounted || user) ? navItems : navItems.filter(item => item.name !== 'Settings');

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (!user && path !== '/dashboard') {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <div className="h-screen bg-bg-primary text-text-primary flex overflow-hidden">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
         <div 
           className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
           onClick={() => toggleSidebar(false)}
         />
      )}

      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-[72px] md:translate-x-0'} 
        transition-all duration-300 ease-in-out fixed md:relative z-50 h-full border-r border-border-subtle bg-bg-secondary flex flex-col shrink-0 overflow-hidden`}
      >
        <div className={`p-4 border-b border-border-subtle flex items-center min-h-[73px] ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl px-2">
                <div className="w-6 h-6 bg-brand rounded-sm flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                Prepiqo
              </Link>
              <button 
                onClick={() => toggleSidebar(false)}
                className="p-2 rounded-md hover:bg-border-subtle text-text-secondary transition-colors"
                title="Close Sidebar"
                aria-label="Close Sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
            </>
          ) : (
            <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 bg-brand rounded-sm shrink-0">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </Link>
          )}
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {visibleNavItems.map((item, index) => {
            const isActive = pathname === item.path && (item.path !== '/dashboard' || !chatId);
            const isNewChat = item.name === 'New Chat';
            return (
              <React.Fragment key={item.path}>
                <Link 
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  title={!isSidebarOpen ? item.name : undefined}
                  className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center px-0' : 'px-3 gap-3'} py-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-brand text-white shadow-sm' : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {isSidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
                {isNewChat && (
                  <div className="mt-2 mb-2">
                    <button 
                      onClick={(e) => {
                        if (!user) {
                          handleNavClick(e, '/dashboard');
                          return;
                        }
                        setIsHistoryOpen(!isHistoryOpen);
                        if (!isHistoryOpen && history.length === 0) fetchHistory();
                        if (!isSidebarOpen) toggleSidebar(true);
                      }}
                      title={!isSidebarOpen ? 'Chat History' : undefined}
                      className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center px-0' : 'justify-between px-3'} py-3 rounded-lg transition-colors text-sm font-medium hover:bg-bg-primary hover:text-text-primary ${isHistoryOpen ? 'text-brand' : 'text-text-secondary'}`}
                    >
                      <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'gap-3'}`}>
                        <div className="shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
                        </div>
                        {isSidebarOpen && <span>Chat History</span>}
                      </div>
                      {isSidebarOpen && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isHistoryOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                      )}
                    </button>
                    
                    {isHistoryOpen && isSidebarOpen && (
                      <div className="mt-1 ml-4 pl-4 border-l border-border-subtle max-h-[200px] overflow-y-auto custom-scrollbar">
                        {loadingHistory ? (
                          <div className="py-4 flex justify-center">
                            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : history.length === 0 ? (
                          <p className="text-xs text-text-muted py-3">No history yet.</p>
                        ) : (
                          <div className="flex flex-col gap-1 py-1">
                            {history.map((chat) => (
                              <Link 
                                key={chat._id} 
                                href={`/dashboard?chatId=${chat._id}`}
                                className={`py-2 px-3 rounded-md text-sm truncate transition-colors ${chatId === chat._id ? 'bg-brand text-white font-medium' : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'}`}
                                title={chat.title}
                              >
                                {chat.title}
                                <div className={`text-[10px] mt-0.5 ${chatId === chat._id ? 'text-indigo-200' : 'text-text-muted'}`}>
                                  {new Date(chat.createdAt).toLocaleDateString()}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
        
        <div className={`p-4 border-t border-border-subtle mt-auto bg-bg-secondary ${!isSidebarOpen ? 'flex flex-col items-center gap-4' : ''}`}>
          {isSidebarOpen ? (
            <>
              {(isMounted && user) ? (
                <>
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-brand flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {isMounted ? (user?.name?.charAt(0)?.toUpperCase() || 'U') : 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate text-text-primary">{isMounted ? (user?.name || 'User') : 'User'}</p>
                      <p className="text-xs text-text-muted truncate">{isMounted ? (user?.email || 'user@example.com') : 'user@example.com'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2 border border-border-strong rounded-lg hover:bg-border-subtle transition-colors text-text-secondary font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-text-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      ?
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate text-text-primary">Guest User</p>
                      <p className="text-xs text-text-muted truncate">5 Free Requests</p>
                    </div>
                  </div>
                  <Link 
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              {(isMounted && user) ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-brand flex items-center justify-center text-sm font-bold flex-shrink-0" title={isMounted ? (user?.name || 'User') : 'User'}>
                    {isMounted ? (user?.name?.charAt(0)?.toUpperCase() || 'U') : 'U'}
                  </div>
                  <button 
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 border border-border-strong rounded-lg hover:bg-border-subtle transition-colors text-text-secondary"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-text-secondary flex items-center justify-center text-sm font-bold flex-shrink-0" title="Guest User">
                    ?
                  </div>
                  <Link 
                    href="/register"
                    title="Sign Up"
                    className="p-2 border border-brand bg-brand/10 rounded-lg hover:bg-brand/20 transition-colors text-brand"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="border-b border-border-subtle bg-white p-4 flex items-center justify-between z-10 shrink-0 min-h-[73px]">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => toggleSidebar(true)}
                className="p-2 rounded-md hover:bg-bg-secondary text-text-secondary transition-colors"
                title="Open Sidebar"
                aria-label="Open Sidebar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            )}
            <h2 className="text-lg font-semibold tracking-tight hidden md:block">
               {navItems.find(i => i.path === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
                href="/dashboard/profile" 
                onClick={(e) => handleNavClick(e, '/dashboard/profile')}
                className="w-8 h-8 rounded-full bg-indigo-100 text-brand flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
             >
                {isMounted ? (user?.name?.charAt(0)?.toUpperCase() || 'U') : 'U'}
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative bg-bg-primary">
          {children}
        </div>
      </div>

      {/* Auth Modal for Guest Users */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-indigo-50 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 text-text-primary">Create an Account</h3>
            <p className="text-text-secondary text-center mb-8 leading-relaxed">You need to be signed in to view your chat history and profile. Sign up today to get 15 free requests!</p>
            <div className="space-y-3">
              <Link href="/register" className="w-full flex items-center justify-center py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand/90 transition-colors shadow-sm">
                Sign Up Free
              </Link>
              <Link href="/login" className="w-full flex items-center justify-center py-3 bg-white border border-border-strong text-text-primary rounded-xl font-semibold hover:bg-bg-secondary transition-colors shadow-sm">
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-bg-primary flex items-center justify-center">Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
