import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Image, SafeAreaView, ActivityIndicator, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, logout } = useAuth();

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.log('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch data whenever user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)', label: 'Pending' };
      case 'process':
        return { bg: 'rgba(79, 70, 229, 0.12)', text: '#4f46e5', border: 'rgba(79, 70, 229, 0.2)', label: 'Diproses' };
      case 'done':
        return { bg: 'rgba(5, 150, 105, 0.12)', text: '#059669', border: 'rgba(5, 150, 105, 0.2)', label: 'Selesai' };
      default:
        return { bg: '#e2e8f0', text: '#64748b', border: '#cbd5e1', label: 'Unknown' };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const renderItem = ({ item }) => {
    const status = getStatusStyle(item.status);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('DetailComplaint', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
          <View style={[styles.badge, { backgroundColor: status.bg, borderColor: status.border }]}>
            <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

        {item.image && (
          <Image 
            source={{ uri: `${API_URL}/uploads/${item.image}` }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            💬 {item.response_message ? 'Sudah ditanggapi' : 'Menunggu tanggapan'}
          </Text>
          <Text style={styles.detailLink}>Lihat detail &rarr;</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../assets/bg-planting.jpg')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}
      />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileClickable} 
          onPress={() => navigation.navigate('Profile')}
        >
          {user?.avatar ? (
            <Image 
              source={{ uri: `${API_URL}/uploads/${user.avatar}` }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.welcomeText}>Halo, 👋</Text>
            <Text style={styles.nameText}>{user?.name}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pengaduan Anda</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>Belum ada laporan pengaduan.</Text>
          <Text style={styles.emptySubtitle}>Tekan tombol di bawah untuk mengirim laporan pertama Anda.</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
          }
        />
      )}

      {/* FAB Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateComplaint')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  welcomeText: {
    color: '#64748b',
    fontSize: 14,
  },
  nameText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  profileClickable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  avatarFallbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  logoutButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    color: '#64748b',
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardDesc: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
    marginTop: 4,
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
  },
  detailLink: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
});
