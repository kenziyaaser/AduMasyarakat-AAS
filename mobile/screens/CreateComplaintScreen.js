import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CreateComplaintScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan akses galeri untuk mengunggah foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Eror', 'Judul dan isi deskripsi pengaduan wajib diisi.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());

    if (image) {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      formData.append('image', {
        uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
        name: filename,
        type: type,
      });
    }

    try {
      await axios.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert(
        'Sukses',
        'Pengaduan Anda berhasil dikirim dan akan segera diproses.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.message || 'Gagal mengirim pengaduan. Coba lagi nanti.';
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
          <Text style={styles.title}>Buat Pengaduan Baru</Text>
          <Text style={styles.subtitle}>Sampaikan aspirasi Anda secara mendetail. Anda juga dapat menyertakan foto.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul Pengaduan</Text>
            <TextInput
              style={styles.input}
              placeholder="Tuliskan pokok permasalahan (misal: Pipa Bocor)"
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Isi Deskripsi Pengaduan</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ceritakan kronologi kejadian, lokasi lengkap, dan lainnya secara mendetail..."
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto Pendukung (Opsional)</Text>
            {!image ? (
              <TouchableOpacity style={styles.imageSelector} onPress={handlePickImage}>
                <Text style={styles.imageSelectorIcon}>📷</Text>
                <Text style={styles.imageSelectorText}>Pilih Foto dari Galeri</Text>
                <Text style={styles.imageSelectorSub}>Format: JPG, PNG, WEBP (Maks 5MB)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.previewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                  <Text style={styles.removeImageButtonText}>Hapus Foto ✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => navigation.navigate('Home')}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Kirim Laporan</Text>
              )}
            </TouchableOpacity>
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
    marginBottom: 24,
    lineHeight: 18,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageSelector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSelectorIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  imageSelectorText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  imageSelectorSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  removeImageButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  removeImageButtonText: {
    color: '#ffffff',
    fontSize: 12,
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
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    flex: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
