import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

export default function DetailComplaintScreen({ route, navigation }) {
  const { id } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`/complaints/${id}`);
      setComplaint(response.data);
    } catch (error) {
      console.log('Error fetching complaint detail:', error);
      Alert.alert('Eror', 'Gagal memuat detail laporan.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'process': return 'Diproses';
      case 'done': return 'Selesai';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!complaint) return null;

  // Active status indices for visual tracker
  const statuses = ['pending', 'process', 'done'];
  const currentIndex = statuses.indexOf(complaint.status);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../assets/bg-planting.jpg')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Status Tracker */}
        <View style={styles.trackerContainer}>
          <Text style={styles.trackerTitle}>Status Tracking</Text>
          <View style={styles.stepsRow}>
            {statuses.map((s, index) => {
              const isActive = index <= currentIndex;
              const isLast = index === statuses.length - 1;
              
              return (
                <React.Fragment key={s}>
                  <View style={styles.stepItem}>
                    <View style={[
                      styles.stepCircle, 
                      isActive ? styles.stepCircleActive : styles.stepCircleInactive
                    ]}>
                      <Text style={styles.stepNumber}>
                        {index === 0 ? '🕒' : index === 1 ? '⚙️' : '✅'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.stepLabel, 
                      isActive ? styles.stepLabelActive : styles.stepLabelInactive
                    ]}>
                      {getStatusLabel(s)}
                    </Text>
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.stepLine, 
                      index < currentIndex ? styles.stepLineActive : styles.stepLineInactive
                    ]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Complaint Info */}
        <View style={styles.card}>
          <Text style={styles.dateText}>Dikirim: {formatDate(complaint.created_at)}</Text>
          <Text style={styles.titleText}>{complaint.title}</Text>
          <Text style={styles.descText}>{complaint.description}</Text>

          {complaint.image && (
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>Foto Lampiran:</Text>
              <Image 
                source={{ uri: `${API_URL}/uploads/${complaint.image}` }} 
                style={styles.image} 
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Responses Section */}
        <View style={styles.responsesContainer}>
          <Text style={styles.responsesHeader}>Tanggapan Petugas ({complaint.responses?.length || 0})</Text>
          
          {(!complaint.responses || complaint.responses.length === 0) ? (
            <View style={styles.emptyResponses}>
              <Text style={styles.emptyResponsesText}>Laporan Anda sedang dikaji dan belum mendapatkan tanggapan dari petugas.</Text>
            </View>
          ) : (
            complaint.responses.map((resp) => (
              <View key={resp.id} style={styles.responseCard}>
                <View style={styles.responseHeader}>
                  <Text style={styles.responseAdmin}>👮 {resp.admin_name} (Admin)</Text>
                  <Text style={styles.responseTime}>{formatDate(resp.created_at)}</Text>
                </View>
                <Text style={styles.responseText}>{resp.message}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  trackerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  stepCircleInactive: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  stepNumber: {
    fontSize: 16,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#0f172a',
  },
  stepLabelInactive: {
    color: '#64748b',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: -12,
    marginBottom: 18, // Align line with circles
  },
  stepLineActive: {
    backgroundColor: '#2563eb',
  },
  stepLineInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 26,
  },
  descText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  imageContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 16,
  },
  imageLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  responsesContainer: {
    marginBottom: 40,
  },
  responsesHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  emptyResponses: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  emptyResponsesText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  responseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  responseAdmin: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 13,
  },
  responseTime: {
    color: '#64748b',
    fontSize: 11,
  },
  responseText: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 20,
  },
});
