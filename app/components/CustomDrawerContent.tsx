import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import api from '../lib/axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export default function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { chatId } = useGlobalSearchParams();
  
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
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

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleSelectChat = (chatId: string) => {
    props.navigation.closeDrawer();
    router.push({ pathname: '/', params: { chatId } });
  };

  const renderDrawerItem = (routeName: string) => {
    const route = props.state.routes.find((r: any) => r.name === routeName);
    if (!route) return null;
    
    const descriptor = props.descriptors[route.key];
    const { drawerLabel, drawerIcon, title } = descriptor.options;
    const isFocused = props.state.routes[props.state.index].key === route.key;
    
    return (
      <DrawerItem
        key={route.key}
        label={drawerLabel !== undefined ? drawerLabel : title !== undefined ? title : route.name}
        icon={drawerIcon}
        focused={isFocused}
        onPress={() => {
          if (!user) {
            setShowLoginModal(true);
            return;
          }
          props.navigation.navigate(route.name);
        }}
        activeTintColor="#ffffff"
        activeBackgroundColor="#5244E2"
        inactiveTintColor="#4b5563"
        labelStyle={{ fontSize: 14, fontWeight: '500' }}
        style={{ borderRadius: 8, paddingHorizontal: 4 }}
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center p-6 border-b border-gray-100 mt-8 mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 bg-[#5244E2] rounded flex justify-center items-center">
              <View className="w-3.5 h-3.5 bg-white rounded-sm" />
            </View>
            <Text className="text-xl font-bold text-[#0A2540]">Prepiqo</Text>
          </View>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Top Drawer Items (New Chat) */}
        <View className="px-3">
          <DrawerItem
            label="New Chat"
            icon={({ color }) => <Ionicons name="chatbox-ellipses-outline" size={20} color={color} />}
            focused={props.state.routes[props.state.index].name === 'index' && !chatId}
            onPress={() => {
              props.navigation.closeDrawer();
              router.replace('/');
            }}
            activeTintColor="#ffffff"
            activeBackgroundColor="#5244E2"
            inactiveTintColor="#4b5563"
            labelStyle={{ fontSize: 14, fontWeight: '500' }}
            style={{ borderRadius: 8, paddingHorizontal: 4 }}
          />
        </View>

        {/* Custom History Accordion */}
        <View className="px-3 mb-1 mt-1">
          <TouchableOpacity 
            onPress={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              setIsHistoryOpen(!isHistoryOpen);
              if (!isHistoryOpen && history.length === 0) fetchHistory();
            }}
            className="flex-row items-center justify-between p-3 rounded-lg"
          >
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color={isHistoryOpen ? "#5244E2" : "#4b5563"} />
              <Text className={`ml-8 font-medium ${isHistoryOpen ? 'text-[#5244E2]' : 'text-[#4b5563]'}`}>Chat History</Text>
            </View>
            <Ionicons name={isHistoryOpen ? "chevron-up" : "chevron-down"} size={16} color={isHistoryOpen ? "#5244E2" : "#4b5563"} />
          </TouchableOpacity>

          {isHistoryOpen && (
            <View className="mt-1 ml-10 pl-4 border-l border-gray-200">
              {loadingHistory ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#5244E2" />
                </View>
              ) : history.length === 0 ? (
                <Text className="text-xs text-gray-500 py-3">No history yet.</Text>
              ) : (
                <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={true}>
                  {history.map((chat) => (
                    <TouchableOpacity 
                      key={chat._id} 
                      onPress={() => handleSelectChat(chat._id)}
                      className={`py-3 px-2 my-0.5 rounded-lg border-b border-transparent ${chatId === chat._id ? 'bg-[#5244E2]' : ''}`}
                    >
                      <Text className={`text-sm font-medium ${chatId === chat._id ? 'text-white' : 'text-[#374151]'}`} numberOfLines={1}>{chat.title}</Text>
                      <Text className={`text-xs mt-0.5 ${chatId === chat._id ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* Other Drawer Items (Profile, Settings) */}
        <View className="px-3">
          {renderDrawerItem('profile')}
          {renderDrawerItem('settings')}
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center gap-3 mb-4 px-2">
          <View className="w-10 h-10 rounded-full bg-[#E0E7FF] justify-center items-center">
            <Text className="text-[#5244E2] font-bold text-lg">
              {user ? getInitial(user.name) : 'G'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-[#0A2540]" numberOfLines={1}>
              {user ? user.name : 'Guest User'}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {user ? user.email : 'Not signed in'}
            </Text>
          </View>
        </View>

        {user ? (
          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 mx-2"
          >
            <Ionicons name="log-out-outline" size={20} color="#4b5563" />
            <Text className="text-gray-600 font-medium">Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={() => {
              props.navigation.closeDrawer();
              router.replace('/login');
            }}
            className="flex-row items-center justify-center gap-2 bg-[#5244E2] rounded-lg py-3 mx-2"
          >
            <Ionicons name="log-in-outline" size={20} color="#ffffff" />
            <Text className="text-white font-medium">Log In to continue</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Guest Login Modal */}
      <Modal visible={showLoginModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-sm items-center">
            <View className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Ionicons name="lock-closed-outline" size={32} color="#5244E2" />
            </View>
            <Text className="text-xl font-bold text-[#0A2540] mb-2 text-center">Please login</Text>
            <Text className="text-sm text-gray-500 mb-6 text-center">
              You need to sign in to access this feature.
            </Text>
            
            <View className="w-full space-y-3">
              <TouchableOpacity 
                className="bg-[#5244E2] rounded-lg py-3.5 items-center justify-center w-full"
                onPress={() => {
                  setShowLoginModal(false);
                  props.navigation.closeDrawer();
                  router.replace('/login');
                }}
              >
                <Text className="text-white text-base font-bold">Log In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="py-3 items-center w-full mt-2"
                onPress={() => setShowLoginModal(false)}
              >
                <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
