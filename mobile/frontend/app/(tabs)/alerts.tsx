import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList, Alert as RNAlert } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { DataService } from '../../services/DataService';
import { Alert } from '../../models/Alert';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/Design';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  // id de l’alerte qui parle actuellement (ou null)
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  // Arrêter la synthèse vocale quand on quitte l’écran
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await DataService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Erreur chargement alertes :', err);
    }
  };

  const getSeverityColor = (severite: string) => {
    switch (severite) {
      case 'critical': return COLORS.DANGER;
      case 'danger': return COLORS.WARNING;
      case 'warning': return COLORS.INFO;
      default: return COLORS.SUCCESS;
    }
  };

  const getSeverityIcon = (severite: string) => {
    switch (severite) {
      case 'critical': return 'error';
      case 'danger': return 'warning';
      case 'warning': return 'info';
      default: return 'check-circle';
    }
  };

  const handlePlayAudio = async (alert: Alert) => {
    try {
      // Si on reclique sur la même alerte → on stoppe
      if (speakingId === alert.id) {
        await Speech.stop();
        setSpeakingId(null);
        return;
      }

      // On stoppe ce qui est en cours (si une autre alerte parlait)
      await Speech.stop();

      const textToSpeak = `${alert.titre}. ${alert.description}`;

      setSpeakingId(alert.id);

      Speech.speak(textToSpeak, {
        language: 'fr-FR',
        rate: 0.9,
        pitch: 1.0,
        onDone: () => setSpeakingId(null),
        onStopped: () => setSpeakingId(null),
        onError: (error: any) => {
          console.error('Erreur lecture audio:', error);
          RNAlert.alert('Erreur', 'Impossible de lire le message audio');
          setSpeakingId(null);
        },
      });
    } catch (error) {
      console.error('Erreur:', error);
      RNAlert.alert('Erreur', 'Une erreur est survenue');
      setSpeakingId(null);
    }
  };

  const renderAlert = ({ item }: { item: Alert }) => {
    const isThisSpeaking = speakingId === item.id;

    return (
      <View style={[styles.alertCard, { borderLeftColor: getSeverityColor(item.severite) }]}>
        <View style={styles.alertHeader}>
          <MaterialIcons
            name={getSeverityIcon(item.severite)}
            size={28}
            color={getSeverityColor(item.severite)}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.alertTitle}>{item.titre}</Text>
            <Text style={styles.alertType}>{item.type}</Text>
          </View>
        </View>

        <Text style={styles.alertDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.alertDate}>
            {new Date(item.date).toLocaleDateString('mg-MG')}
          </Text>

          {/* Bouton d'écoute - "Haino ny feo" */}
          <TouchableOpacity
            style={[
              styles.listenButton,
              isThisSpeaking && styles.listenButtonActive,
            ]}
            onPress={() => handlePlayAudio(item)}
            activeOpacity={0.8}
          >
            <Feather
              name={isThisSpeaking ? 'volume-x' : 'volume-2'}
              size={18}
              color={COLORS.WHITE}
            />
            <Text style={styles.listenButtonText}>
              {isThisSpeaking ? 'Hajanona' : 'Haino ny feo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fampitandremana</Text>
        <Text style={styles.subtitle}>Araho maso ireo loza mitatao</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {alerts.filter(a => a.severite === 'critical').length}
          </Text>
          <Text style={styles.statLabel}>Tandindonin-doza</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {alerts.filter(a => a.severite === 'danger').length}
          </Text>
          <Text style={styles.statLabel}>Mavesatra</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{alerts.length}</Text>
          <Text style={styles.statLabel}>Fitambarany</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              ✅ Tsy misy fampitandremana aloha izao
            </Text>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_100,
  },
  header: {
    backgroundColor: COLORS.DANGER,
    padding: SPACING.XL,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    ...TYPOGRAPHY.H2,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  subtitle: {
    ...TYPOGRAPHY.SUBTITLE,
    color: COLORS.GRAY_50,
    marginTop: SPACING.SM,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.LG,
    gap: SPACING.SM,
    marginTop: -20, // Effet de chevauchement
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    ...SHADOWS.LIGHT,
  },
  statNumber: {
    ...TYPOGRAPHY.H3,
    color: COLORS.DANGER,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  alertCard: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 6,
    ...SHADOWS.MEDIUM,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  alertTitle: {
    ...TYPOGRAPHY.TITLE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  alertType: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  alertDescription: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: SPACING.LG,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: SPACING.MD,
  },
  alertDate: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
    ...SHADOWS.LIGHT,
  },
  listenButtonActive: {
    backgroundColor: COLORS.DANGER,
  },
  listenButtonText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    ...TYPOGRAPHY.SUBTITLE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});