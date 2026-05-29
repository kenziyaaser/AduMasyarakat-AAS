import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView, 
  useWindowDimensions 
} from 'react-native';

export default function LandingScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768; // Tablet or Web layout

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../assets/bg-planting.jpg')} 
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        imageStyle={{ opacity: 0.08 }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Navigation Header for Web & Tablet */}
        <View style={[styles.navHeader, isLargeScreen && styles.navHeaderLarge]}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandIcon}>🛡️</Text>
            <Text style={styles.brandText}>AduMasyarakat</Text>
          </View>
          <View style={styles.navButtons}>
            <TouchableOpacity 
              style={styles.navBtnLogin} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.navBtnLoginText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navBtnRegister} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.navBtnRegisterText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, isLargeScreen && styles.heroSectionLarge]}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✨ Sistem Pengaduan Online Resmi</Text>
          </View>
          
          <Text style={[styles.heroTitle, isLargeScreen && styles.heroTitleLarge]}>
            Suara Anda Perubahan Kita,{' '}
            <Text style={styles.heroTitleAccent}>Laporkan Keluhan Secara Cepat & Transparan</Text>
          </Text>
          
          <Text style={[styles.heroDesc, isLargeScreen && styles.heroDescLarge]}>
            AduMasyarakat memfasilitasi Anda untuk melaporkan masalah fasilitas umum, lingkungan, dan pelayanan publik secara instan. Mari bersama-sama wujudkan lingkungan yang lebih baik.
          </Text>

          <View style={styles.heroBtnContainer}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnPrimary]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnPrimaryText}>Laporkan Sekarang &rarr;</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.btn, styles.btnSecondary]} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.btnSecondaryText}>Daftar Akun Baru</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, isLargeScreen && styles.statsSectionLarge]}>
          <View style={[styles.statsGrid, isLargeScreen && styles.statsGridLarge]}>
            <View style={[styles.statCard, isLargeScreen && styles.statCardLarge]}>
              <Text style={styles.statNum}>120+</Text>
              <Text style={styles.statLabel}>Total Laporan Masuk</Text>
            </View>
            <View style={[styles.statCard, isLargeScreen && styles.statCardLarge]}>
              <Text style={styles.statNum}>45</Text>
              <Text style={styles.statLabel}>Sedang Diproses</Text>
            </View>
            <View style={[styles.statCard, isLargeScreen && styles.statCardLarge]}>
              <Text style={styles.statNum}>72</Text>
              <Text style={styles.statLabel}>Selesai Ditangani</Text>
            </View>
            <View style={[styles.statCard, isLargeScreen && styles.statCardLarge]}>
              <Text style={styles.statNum}>24/7</Text>
              <Text style={styles.statLabel}>Layanan Pemantauan</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kenapa Menggunakan AduMasyarakat?</Text>
            <Text style={styles.sectionSubtitle}>
              Kami menghadirkan platform pelaporan yang andal, transparan, dan mudah diakses oleh seluruh lapisan masyarakat.
            </Text>
          </View>

          <View style={[styles.featuresGrid, isLargeScreen && styles.featuresGridLarge]}>
            <View style={[styles.featureCard, isLargeScreen && styles.featureCardLarge]}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🕒</Text>
              </View>
              <Text style={styles.featureTitle}>Real-Time Update</Text>
              <Text style={styles.featureDesc}>
                Pantau status penanganan pengaduan Anda secara real-time langsung dari dashboard atau aplikasi mobile.
              </Text>
            </View>

            <View style={[styles.featureCard, isLargeScreen && styles.featureCardLarge]}>
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]}>
                <Text style={styles.featureIcon}>🔒</Text>
              </View>
              <Text style={styles.featureTitle}>Aman & Terpercaya</Text>
              <Text style={styles.featureDesc}>
                Semua informasi pengadu dijaga kerahasiaannya dengan sistem autentikasi dan keamanan yang mutakhir.
              </Text>
            </View>

            <View style={[styles.featureCard, isLargeScreen && styles.featureCardLarge]}>
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
                <Text style={styles.featureIcon}>✅</Text>
              </View>
              <Text style={styles.featureTitle}>Respon Cepat</Text>
              <Text style={styles.featureDesc}>
                Dapatkan tanggapan administratif resmi langsung dari admin instansi terkait untuk setiap laporan yang Anda ajukan.
              </Text>
            </View>
          </View>
        </View>

        {/* Process Flow Section */}
        <View style={styles.flowSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alur Pengaduan</Text>
            <Text style={styles.sectionSubtitle}>
              Ikuti 4 langkah mudah untuk melaporkan dan menyelesaikan permasalahan di sekitar Anda.
            </Text>
          </View>

          <View style={[styles.flowGrid, isLargeScreen && styles.flowGridLarge]}>
            <View style={[styles.flowStep, isLargeScreen && styles.flowStepLarge]}>
              <View style={styles.flowNumContainer}>
                <Text style={styles.flowNum}>1</Text>
              </View>
              <Text style={styles.flowStepTitle}>Tulis Laporan</Text>
              <Text style={styles.flowStepDesc}>Tulis keluhan secara rinci dan unggah foto bukti pendukung yang valid.</Text>
            </View>

            <View style={[styles.flowStep, isLargeScreen && styles.flowStepLarge]}>
              <View style={[styles.flowNumContainer, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]}>
                <Text style={[styles.flowNum, { color: '#4f46e5' }]}>2</Text>
              </View>
              <Text style={styles.flowStepTitle}>Verifikasi Laporan</Text>
              <Text style={styles.flowStepDesc}>Admin kami akan memeriksa kelayakan dan memvalidasi kebenaran laporan Anda.</Text>
            </View>

            <View style={[styles.flowStep, isLargeScreen && styles.flowStepLarge]}>
              <View style={[styles.flowNumContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Text style={[styles.flowNum, { color: '#d97706' }]}>3</Text>
              </View>
              <Text style={styles.flowStepTitle}>Tindak Lanjut</Text>
              <Text style={styles.flowStepDesc}>Laporan disetujui, diproses, dan ditindaklanjuti oleh petugas di lapangan.</Text>
            </View>

            <View style={[styles.flowStep, isLargeScreen && styles.flowStepLarge]}>
              <View style={[styles.flowNumContainer, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
                <Text style={[styles.flowNum, { color: '#059669' }]}>4</Text>
              </View>
              <Text style={styles.flowStepTitle}>Laporan Selesai</Text>
              <Text style={styles.flowStepDesc}>Status laporan berubah menjadi selesai dan admin memberikan tanggapan resmi.</Text>
            </View>
          </View>
        </View>

        {/* Call to Action Card */}
        <View style={styles.ctaWrapper}>
          <View style={[styles.ctaCard, isLargeScreen && styles.ctaCardLarge]}>
            <Text style={styles.ctaTitle}>Siap Melaporkan Masalah Hari Ini?</Text>
            <Text style={styles.ctaDesc}>
              Setiap tindakan kecil Anda sangat berharga bagi kenyamanan bersama. Laporkan permasalahan di lingkungan sekitar Anda sekarang juga secara transparan.
            </Text>
            <TouchableOpacity 
              style={[styles.btn, styles.btnPrimary, { width: isLargeScreen ? 'auto' : '100%', paddingHorizontal: 32 }]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnPrimaryText}>Mulai Lapor Sekarang &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandIcon}>🛡️</Text>
            <Text style={styles.footerBrandText}>AduMasyarakat</Text>
          </View>
          <Text style={styles.footerText}>
            &copy; {new Date().getFullYear()} AduMasyarakat. Hak Cipta Dilindungi Undang-Undang.
          </Text>
          <Text style={[styles.footerText, { fontSize: 11, marginTop: 4, opacity: 0.7 }]}>
            Dibuat dengan dedikasi untuk transparansi fasilitas umum & ketertiban masyarakat.
          </Text>
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
  scrollContainer: {
    paddingBottom: 40,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  navHeaderLarge: {
    paddingHorizontal: 80,
    paddingVertical: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBtnLogin: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  navBtnLoginText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  navBtnRegister: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navBtnRegisterText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroSectionLarge: {
    paddingHorizontal: 120,
    paddingVertical: 80,
  },
  heroBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    marginBottom: 20,
  },
  heroBadgeText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
    maxWidth: 700,
  },
  heroTitleLarge: {
    fontSize: 44,
    lineHeight: 56,
  },
  heroTitleAccent: {
    color: '#2563eb',
  },
  heroDesc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 600,
  },
  heroDescLarge: {
    fontSize: 16,
    lineHeight: 26,
  },
  heroBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  btnSecondaryText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 15,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  statsSectionLarge: {
    paddingHorizontal: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statsGridLarge: {
    flexWrap: 'nowrap',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  statCardLarge: {
    width: 'auto',
    flex: 1,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 550,
  },
  featuresGrid: {
    gap: 16,
  },
  featuresGridLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  featureCardLarge: {
    flex: 1,
    height: '100%',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 26,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  flowSection: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  flowGrid: {
    gap: 20,
  },
  flowGridLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flowStep: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
  },
  flowStepLarge: {
    flex: 1,
  },
  flowNumContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  flowNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  flowStepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  flowStepDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaWrapper: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  ctaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  ctaCardLarge: {
    paddingVertical: 48,
    paddingHorizontal: 80,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 550,
  },
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerBrandIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  footerBrandText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});
