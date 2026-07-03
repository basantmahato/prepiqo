import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  const { user } = useAuthStore();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerTintColor: '#4b5563',
          drawerActiveTintColor: '#ffffff',
          drawerActiveBackgroundColor: '#5244E2',
          drawerInactiveTintColor: '#4b5563',
          drawerLabelStyle: { fontSize: 14, fontWeight: '500' },
          drawerItemStyle: { borderRadius: 8, paddingHorizontal: 4 },
          headerStyle: { backgroundColor: '#F9FAFB' },
          title: '',
          headerRight: () => (
            <View className="mr-4 w-8 h-8 rounded-full bg-[#E0E7FF] justify-center items-center">
              <Text className="text-[#5244E2] font-bold text-sm">{initial}</Text>
            </View>
          ),
        }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'New Chat',
            drawerIcon: ({ color, size }) => <Ionicons name="chatbox-ellipses-outline" size={20} color={color} />,
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerItemStyle: { display: 'none' }
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={20} color={color} />,
            headerRight: () => null,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={20} color={color} />,
            headerRight: () => null,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
