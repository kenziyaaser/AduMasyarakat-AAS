import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, useWindowDimensions } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Eror', 'Harap isi semua kolom.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Eror', 'Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Eror', 'Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: 'user' // Default to user on mobile
      });

      Alert.alert(
        'Pendaftaran Berhasil',
        'Akun Anda berhasil didaftarkan. Silakan masuk.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.message || 'Registrasi gagal. Coba lagi nanti.';
      Alert.alert('Pendaftaran Gagal', errMsg);
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
        <View style={isLargeScreen ? styles.splitRoot : { flex: 1 }}>
          {isLargeScreen && (
            <View style={styles.leftBanner}>
              <View style={styles.bannerLogo}>
                <Text style={styles.bannerLogoIcon}>🛡️</Text>
                <Text style={styles.bannerLogoText}>AduMasyarakat</Text>
              </View>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Bergabunglah dan Suarakan Aspirasi Anda</Text>
                <Text style={styles.bannerText}>
                  Bersama jutaan masyarakat aktif lainnya, pantau perkembangan infrastruktur dan pelayanan publik demi kemajuan daerah Anda.
                </Text>
                <View style={styles.bannerQuoteContainer}>
                  <Text style={styles.bannerQuote}>
                    "Kolaborasi yang erat antara masyarakat yang peduli dan pemerintah yang responsif adalah kunci dari kemajuan daerah."
                  </Text>
                </View>
              </View>
            </View>
          )}

          <ScrollView 
            contentContainerStyle={[
              styles.scrollContainer, 
              isLargeScreen && styles.scrollContainerLarge
            ]} 
            keyboardShouldPersistTaps="handled"
          >
            {/* Back to Beranda Button */}
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => navigation.navigate('Landing')}
            >
              <Text style={styles.backBtnText}>&larr; Kembali ke Beranda</Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.title}>Daftar Akun</Text>
              <Text style={styles.subtitle}>Buat akun untuk menyampaikan aspirasi dan pengaduan Anda</Text>
            </View>

            <View style={styles.card}>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nama@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan kembali password"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Daftar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Masuk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
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
  inputGroup: {
    marginBottom: 16,
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
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  splitRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  leftBanner: {
    flex: 1.1,
    backgroundColor: '#0f172a',
    padding: 60,
    justifyContent: 'flex-end',
    position: 'relative',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bannerLogo: {
    position: 'absolute',
    top: 60,
    left: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerLogoIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  bannerLogoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerContent: {
    maxWidth: 500,
  },
  bannerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 46,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 26,
    marginBottom: 28,
  },
  bannerQuoteContainer: {
    borderLeftWidth: 4,
    borderColor: '#2563eb',
    paddingLeft: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 12,
    paddingRight: 12,
    borderRadius: 4,
  },
  bannerQuote: {
    color: '#cbd5e1',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  scrollContainerLarge: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
    backgroundColor: 'transparent',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 6,
  },
  backBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
