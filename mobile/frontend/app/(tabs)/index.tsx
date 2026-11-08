import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import {
  MaterialIcons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, interpolateColor } from 'react-native-reanimated';

// Animated Tractor Component
const AnimatedTractor = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Move tractor back and forth
    translateX.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 2000 }),
        withTiming(-20, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const tractorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={tractorStyle}>
      <MaterialIcons name="agriculture" size={60} color={COLORS.WHITE} />
    </Animated.View>
  );
};

/* COULEURS */
const COLORS = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#8D6E63',
  ACCENT: '#FFA000',
  BACKGROUND: '#F1F8E9',
  WHITE: '#FFFFFF',
  DANGER: '#D32F2F',
  INFO: '#0288D1',
  TEXT_MAIN: '#1B5E20',
  TEXT_SUB: '#546E7A',
};

export default function HomeScreen() {

  const [weather] = useState({
    temp: 24,
    humidite: 80,
    vent: 15,
    pluie: '10mm'
  });

  // Animation for header color change
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(2, { duration: 2000 }),
        withTiming(3, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3],
      ['#2E7D32', '#4CAF50', '#8BC34A', '#CDDC39']  // Different shades of green
    ),
  }));

  // Fonctionnalités principales pour la page d'accueil
  const mainFeatures = [
    {
      id: 1,
      icon: 'agriculture',
      title: 'Gestion Parcelles',
      description: 'Suivez vos terrains',
      color: '#4CAF50',
      iconColor: COLORS.PRIMARY,
      iconLib: 'MaterialIcons'
    },
    {
      id: 2,
      icon: 'watering-can',
      title: 'Irrigation',
      description: 'Contrôle automatique',
      color: '#2196F3',
      iconColor: COLORS.INFO,
      iconLib: 'MaterialCommunityIcons'
    },
    {
      id: 3,
      icon: 'bug',
      title: 'Santé Plantes',
      description: 'Détection maladies',
      color: '#FF9800',
      iconColor: COLORS.ACCENT,
      iconLib: 'MaterialCommunityIcons'
    },
    {
      id: 4,
      icon: 'shopping-cart',
      title: 'Marché',
      description: 'Prix & Ventes',
      color: '#9C27B0',
      iconColor: '#9C27B0',
      iconLib: 'Feather'
    },
    {
      id: 5,
      icon: 'book-open',
      title: 'Conseils',
      description: 'Expert agricole',
      color: '#009688',
      iconColor: '#009688',
      iconLib: 'Feather'
    },
    {
      id: 6,
      icon: 'chart-line',
      title: 'Analyses',
      description: 'Statistiques récoltes',
      color: '#795548',
      iconColor: COLORS.SECONDARY,
      iconLib: 'FontAwesome5'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

        {/* HEADER CENTRÉ */}
        <Animated.View style={[styles.header, animatedHeaderStyle]}>
          <View style={styles.headerContent}>
            <AnimatedTractor />
            <Text style={styles.appName}>TANTSAHA CONNECT</Text>
            <Text style={styles.tagline}>
              Fitaovana ho an'ny tantsaha maoderina
            </Text>
          </View>
        </Animated.View>

        {/* SALUTATION GRAND TEXTE */}
        <View style={styles.greetingBox}>
          <Text style={styles.greetingText}>
            Tongasoa eto amin'ny Tantsaha Connect 
          </Text>
          <Text style={styles.greetingSubText}>
            Mirary vokatra tsara sy fahombiazana amin'ny asa fambolena androany
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <StatCard icon="map" value="5" label="Parcelles" color={COLORS.PRIMARY} />
          <StatCard icon="notifications-active" value="2" label="Alertes" color={COLORS.DANGER} isMI />
          <StatCard icon="seedling" value="3" label="Cultures" color={COLORS.ACCENT} isMC />
        </View>

       

        {/* METEO */}
        <View style={styles.sectionCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Toetrandro anio</Text>
            <Feather name="cloud-rain" size={24} color={COLORS.INFO} />
          </View>
          <View style={styles.weatherGrid}>
            <WeatherItem icon="thermometer" label="Maripana" value={`${weather.temp}°C`} />
            <WeatherItem icon="droplet" label="Hamandoana" value={`${weather.humidite}%`} />
            <WeatherItem icon="wind" label="Rivotra" value={`${weather.vent}km/h`} />
            <WeatherItem icon="cloud-lightning" label="Eran-tsika" value={weather.pluie} />
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
}

/* COMPOSANTS */

const StatCard = ({ icon, value, label, color, isMC, isMI }: any) => (
  <View style={styles.miniCard}>
    {isMC
      ? <MaterialCommunityIcons name={icon} size={24} color={color} />
      : isMI
        ? <MaterialIcons name={icon} size={24} color={color} />
        : <FontAwesome5 name={icon} size={22} color={color} />
    }
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WeatherItem = ({ icon, label, value }: any) => (
  <View style={styles.weatherItem}>
    <Feather name={icon} size={18} color={COLORS.SECONDARY} />
    <Text style={styles.weatherLabel}>{label}</Text>
    <Text style={styles.weatherVal}>{value}</Text>
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },

  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 50,
    paddingBottom: 60,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 30,
    minHeight: 250,
  },

  headerContent: {
    alignItems: 'center',
  },

  headerIcon: {
    marginBottom: 10,
  },

  appName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 18,
    color: '#C8E6C9',
    textAlign: 'center',
    maxWidth: '80%',
  },

  greetingBox: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.TEXT_MAIN,
    textAlign: 'center',
    lineHeight: 32,
  },

  greetingSubText: {
    fontSize: 16,
    color: COLORS.TEXT_SUB,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },

  miniCard: {
    backgroundColor: COLORS.WHITE,
    width: '30%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  statVal: { fontSize: 22, fontWeight: 'bold', color: COLORS.TEXT_MAIN, marginTop: 5 },
  statLabel: { fontSize: 12, color: COLORS.TEXT_SUB, marginTop: 5 },

  sectionCard: {
    backgroundColor: COLORS.WHITE,
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  rowBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15 
  },
  
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.TEXT_MAIN 
  },

  weatherGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  
  weatherItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  
  weatherLabel: { 
    fontSize: 12, 
    color: COLORS.TEXT_SUB, 
    marginTop: 5 
  },
  
  weatherVal: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.TEXT_MAIN, 
    marginTop: 3 
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  featureCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_MAIN,
    textAlign: 'center',
    marginBottom: 4,
  },

  featureDesc: {
    fontSize: 11,
    color: COLORS.TEXT_SUB,
    textAlign: 'center',
  },

  tipContainer: {
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
  },

  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_MAIN,
    lineHeight: 20,
    marginBottom: 15,
  },

  tipButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },

  tipButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 12,
  },

  activityList: {
    marginTop: 5,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  activityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_MAIN,
  },

  activityTime: {
    fontSize: 12,
    color: COLORS.TEXT_SUB,
  },
});