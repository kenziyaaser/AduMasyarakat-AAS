import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CreateComplaintScreen from './screens/CreateComplaintScreen';
import DetailComplaintScreen from './screens/DetailComplaintScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

// App Navigation controller depending on login state
function Navigation() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.08)',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#0f172a',
          headerTitleStyle: {
            fontWeight: '700',
          },
          cardStyle: { backgroundColor: '#f8fafc' },
          headerBackTitleVisible: false,
        }}
      >
        {!token ? (
          // Auth Stack
          <>
            <Stack.Screen 
              name="Landing" 
              component={LandingScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // App Stack
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'AduMasyarakat' }}
            />
            <Stack.Screen 
              name="CreateComplaint" 
              component={CreateComplaintScreen} 
              options={{ title: 'Buat Pengaduan' }}
            />
            <Stack.Screen 
              name="DetailComplaint" 
              component={DetailComplaintScreen} 
              options={{ title: 'Detail Laporan' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profil Saya' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Navigation />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
