import { StyleSheet, ScrollView, View, Text, Dimensions, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { DataService } from '../../services/DataService';
import { WeatherData } from '../../models/Weather';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/Design';

// --- EFFECTS ANIMATIONS (Tsy novaina ny lojika) ---

const RainEffect = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: 15 }, (_, i) => {
        const translateY = useSharedValue(0);
        const opacity = useSharedValue(1);

        useEffect(() => {
          translateY.value = withRepeat(
            withSequence(
              withTiming(-Dimensions.get('window').height, { duration: 1000 + i * 100 }),
              withTiming(0, { duration: 0 })
            ),
            -1,
            false
          );
          opacity.value = withRepeat(
            withSequence(
              withTiming(0, { duration: 1000 + i * 100 }),
              withTiming(1, { duration: 0 })
            ),
            -1,
            false
          );
        }, []);

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: translateY.value }],
          opacity: opacity.value,
        }));

        return (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                width: 2,
                height: 25,
                backgroundColor: 'rgba(255,255,255,0.5)',
                left: Math.random() * Dimensions.get('window').width,
                top: Math.random() * 100,
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const SunEffect = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 2000 }), -1, true);
    rotate.value = withRepeat(withTiming(360, { duration: 20000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'rgba(255, 215, 0, 0.3)',
          shadowColor: "#FFD700",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
        },
        animatedStyle,
      ]}
    />
  );
};

const CloudEffect = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 4000 }),
        withTiming(-30, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 40,
          left: 40,
          width: 100,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.3)',
        },
        animatedStyle,
      ]}
    />
  );
};

const StormEffect = () => {
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    flashOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(0, { duration: 50 }),
        withTiming(0.4, { duration: 100 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(255,255,255,0.2)' },
        animatedStyle,
      ]}
    />
  );
};

// --- MAIN COMPONENT ---

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Array<{
    day: string;
    condition: string;
    maxTemp: number;
    minTemp: number;
    pluie: number;
    uvIndex: number;
  }> | null>(null);

  useEffect(() => {
    loadWeather();
    loadForecast();
  }, []);

  const loadWeather = async () => {
    const data = await DataService.getWeather();
    setWeather(data);
  };

  const loadForecast = async () => {
    const days = ['Alakamisy', 'Zoma', 'Sabotsy'];
    const conditions = ['ensoleille', 'nuageux', 'pluvieux', 'orageux'];

    const forecastData = days.map((day) => ({
      day,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      maxTemp: Math.floor(Math.random() * 10) + 22,
      minTemp: Math.floor(Math.random() * 8) + 15,
      pluie: Math.floor(Math.random() * 15),
      uvIndex: Math.floor(Math.random() * 4) + 3,
    }));

    setForecast(forecastData);
  };

  if (!weather) return <View style={styles.loadingContainer}><Text>Am-pampidirana...</Text></View>;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensoleille': return 'wb-sunny';
      case 'nuageux': return 'cloud';
      case 'pluvieux': return 'umbrella';
      case 'orageux': return 'thunderstorm';
      default: return 'cloud';
    }
  };

  // Fandikan-teny ofisialy
  const translateCondition = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensoleille': return 'Mibaliaka'; // "Maina ny andro" na "Mibaliaka"
      case 'nuageux': return 'Manorona';     // "Manorona" fa tsy "Rahona" fotsiny
      case 'pluvieux': return 'Manorana';    // "Manorana"
      case 'orageux': return 'Misy Kotroka'; // "Kotroka" fa tsy "Kianja"
      default: return condition;
    }
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
    const today = new Date().getDay();
    const targetDay = (today + dayIndex) % 7;
    return days[targetDay];
  };

  // Torohevitra amin'ny teny Malagasy ofisialy
  const getWeatherAdvice = (condition: string, temp: number, pluie: number) => {
    if (condition === 'orageux') return 'Misy kotroka sy varatra! Arovy ny voly sy ny biby fiompy.';
    if (pluie > 5) return 'Ho avy ny orana, hamarino tsara ny lalan-drano eny an-tsaha.';
    if (temp > 30) return 'Mafana ny andro, ampitomboy ny rano hanondrahana.';
    return 'Tsara ny andro, mety amin\'ny fikarakarana sy ny fiavana.';
  };

  const renderWeatherEffect = () => {
    switch (weather.condition.toLowerCase()) {
      case 'pluvieux': return <RainEffect />;
      case 'ensoleille': return <SunEffect />;
      case 'nuageux': return <CloudEffect />;
      case 'orageux': return <StormEffect />;
      default: return null;
    }
  };

  // Loko arakaraka ny andro
  const getGradientColors = () => {
    switch (weather.condition.toLowerCase()) {
        case 'ensoleille': return ['#4FACFE', '#00F2FE'];
        case 'nuageux': return ['#636FA4', '#E8CBC0'];
        case 'pluvieux': return ['#373B44', '#4286f4'];
        case 'orageux': return ['#232526', '#414345'];
        default: return ['#4FACFE', '#00F2FE'];
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
      <StatusBar barStyle="light-content" />

      {/* Header madio kokoa */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Toetrandro</Text>
            <Text style={styles.headerSubtitle}>Vinavina ho an'ny fambolena</Text>
        </View>
        <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
                {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </Text>
        </View>
      </View>

      {/* KARATRA LEHIBE - REVISED */}
      <View style={styles.mainCardContainer}>
        <LinearGradient
          colors={getGradientColors() as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCardGradient}
        >
          {renderWeatherEffect()}

          <View style={styles.mainCardContent}>
            <View style={styles.mainTempWrapper}>
                 <Text style={styles.mainTemp}>{weather.temperature}°</Text>
                 <Text style={styles.conditionText}>{translateCondition(weather.condition)}</Text>
            </View>

            <View style={styles.mainIconWrapper}>
                <MaterialIcons
                    name={getWeatherIcon(weather.condition) as any}
                    size={80}
                    color={COLORS.WHITE}
                    style={{ textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 10 }}
                />
            </View>
          </View>

          <View style={styles.detailRow}>
             <View style={styles.detailItem}>
                <Feather name="droplet" size={16} color="white" />
                <Text style={styles.detailText}>{weather.humidite}%</Text>
                <Text style={styles.detailLabel}>Hamandoana</Text>
             </View>
             <View style={styles.detailDivider} />
             <View style={styles.detailItem}>
                <Feather name="wind" size={16} color="white" />
                <Text style={styles.detailText}>{weather.vent} km/h</Text>
                <Text style={styles.detailLabel}>Rivotra</Text>
             </View>
             <View style={styles.detailDivider} />
             <View style={styles.detailItem}>
                <Ionicons name="sunny-outline" size={16} color="white" />
                <Text style={styles.detailText}>{weather.uvIndex || 5}</Text>
                <Text style={styles.detailLabel}>Taratra UV</Text>
             </View>
          </View>
        </LinearGradient>
      </View>

      {/* Toro-hevitra - Design vaovao */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Torohevitra ho anao</Text>
        <View style={styles.adviceCard}>
            <View style={styles.adviceIconContainer}>
                <MaterialIcons name="info-outline" size={24} color="#FFF" />
            </View>
            <Text style={styles.adviceText}>
                {getWeatherAdvice(weather.condition, weather.temperature, weather.pluie)}
            </Text>
        </View>
      </View>

      {/* Vinavina 3 andro */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Vinavina 3 andro</Text>

        {forecast && forecast.map((day, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{getDayName(index + 1)}</Text>

            <View style={styles.forecastConditionContainer}>
                <MaterialIcons name={getWeatherIcon(day.condition) as any} size={22} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.forecastConditionText}>{translateCondition(day.condition)}</Text>
            </View>

            <View style={styles.forecastTempContainer}>
                <Text style={styles.maxTemp}>{day.maxTemp}°</Text>
                <Text style={styles.minTemp}>{day.minTemp}°</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Nohavaozina: {new Date(weather.updatedAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Loko malefaka kokoa
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: 60,
    paddingBottom: SPACING.MD,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A237E', // Bleu fonce
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7986CB',
    marginTop: -2,
  },
  dateBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    color: '#3F51B5',
    fontWeight: '700',
    fontSize: 12,
  },
  // Main Card Styles
  mainCardContainer: {
    marginHorizontal: SPACING.LG,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: SPACING.XL,
  },
  mainCardGradient: {
    borderRadius: 24,
    padding: SPACING.XL,
    overflow: 'hidden',
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTempWrapper: {
    flex: 1,
  },
  mainTemp: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.WHITE,
    includeFontPadding: false,
  },
  conditionText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: -5,
  },
  mainIconWrapper: {
    width: 100,
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  detailText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  // Section Styles
  sectionContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 12,
  },
  adviceCard: {
    backgroundColor: '#FF7043', // Orange mafana
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#FF7043",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  adviceIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
  // Forecast Styles
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFF0F4',
  },
  forecastDay: {
    width: 90,
    fontWeight: '700',
    color: '#37474F',
    fontSize: 15,
  },
  forecastConditionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastConditionText: {
    marginLeft: 8,
    color: '#78909C',
    fontSize: 13,
  },
  forecastTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
    justifyContent: 'flex-end',
  },
  maxTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474F',
    marginRight: 8,
  },
  minTemp: {
    fontSize: 16,
    color: '#B0BEC5',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#B0BEC5',
    fontSize: 11,
  }
});