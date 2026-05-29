import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUri, setAvatarUri] = useState(
    user?.avatar ? `${API_URL}/uploads/${user.avatar}` : null
  );
  const [avatarFileUri, setAvatarFileUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickAvatar = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan akses galeri untuk mengunggah foto profil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setAvatarUri(selectedImage.uri);
      setAvatarFileUri(selectedImage.uri);
    }
  };

  const handleReset = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatarUri(user?.avatar ? `${API_URL}/uploads/${user.avatar}` : null);
    setAvatarFileUri(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Eror', 'Nama dan email tidak boleh kosong.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());

    if (avatarFileUri) {
      const filename = avatarFileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      formData.append('avatar', {
        uri: Platform.OS === 'ios' ? avatarFileUri.replace('file://', '') : avatarFileUri,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await axios.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update globally via context
      await updateUser(response.data.user);
      setAvatarFileUri(null);
      Alert.alert('Sukses', 'Profil Anda berhasil diperbarui!');
    } catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.message || 'Gagal memperbarui profil. Coba lagi nanti.';
      Alert.alert('Eror', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../assets/bg-planting.jpg')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>Profil Saya</Text>
              <Text style={styles.subtitle}>Kelola informasi profil dan foto avatar Anda</Text>
            </View>

            {/* Avatar Picker */}
            <View style={styles.avatarWrapper}>
              <TouchableOpacity style={styles.avatarTouch} onPress={handlePickAvatar}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHelpText}>Tekan foto untuk mengganti</Text>
            </View>

            {/* Role Badge */}
            {user?.role && (
              <View style={[styles.inputGroup, { alignItems: 'center' }]}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    Peran: {user.role === 'user' ? 'Masyarakat' : user.role === 'admin' ? 'Admin Portal' : user.role}
                  </Text>
                </View>
              </View>
            )}

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap Anda"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan alamat email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Actions */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.resetButton]} 
                onPress={handleReset}
                disabled={loading}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTouch: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: 55,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarFallback: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarFallbackText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#2563eb',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cameraIcon: {
    fontSize: 16,
  },
  avatarHelpText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0f172a',
    fontSize: 15,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  roleBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  roleBadgeText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginRight: 12,
  },
  resetButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    flex: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
