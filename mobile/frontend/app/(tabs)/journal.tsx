import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/Design';

// Types stricts
type ObsType = 'maladie' | 'insecte' | 'climat' | 'sol' | 'autre';
type ObsGravite = 'faible' | 'moyen' | 'grave';

type Observation = {
  id: string;
  titre: string;
  description: string;
  type: ObsType;
  gravite: ObsGravite;
  date: string;
  photo?: string;
};

// Optionnel : données de départ
const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: '1',
    titre: "Ohatra: Nahitana kankana",
    description: "Nahita kankana teny amin'ny voly katsaka tamin'ny maraina.",
    type: 'insecte',
    gravite: 'moyen',
    date: new Date().toISOString(),
    photo: undefined,
  },
];

export default function JournalScreen() {
  const [observations, setObservations] = useState<Observation[]>(INITIAL_OBSERVATIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // États du formulaire
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ObsType>('autre');
  const [gravite, setGravite] = useState<ObsGravite>('moyen');

  const resetForm = () => {
    setTitre('');
    setDescription('');
    setType('autre');
    setGravite('moyen');
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    resetForm();
  };

  const openNewModal = () => {
    setEditingId(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (obs: Observation) => {
    setEditingId(obs.id);
    setTitre(obs.titre);
    setDescription(obs.description);
    setType(obs.type);
    setGravite(obs.gravite);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!titre.trim() || !description.trim()) {
      Alert.alert('Fenoina', 'Fenoy ny lohateny sy ny antsipiriany azafady');
      return;
    }

    if (editingId) {
      // Mode édition
      setObservations((prev) =>
        prev.map((obs) =>
          obs.id === editingId
            ? {
                ...obs,
                titre: titre.trim(),
                description: description.trim(),
                type,
                gravite,
                // On garde la date de création d’origine
              }
            : obs
        )
      );
      Alert.alert('Vita', 'Voaova ny fanamarihanao');
    } else {
      // Mode ajout
      const newObs: Observation = {
        id: Date.now().toString(),
        titre: titre.trim(),
        description: description.trim(),
        type,
        gravite,
        date: new Date().toISOString(),
        photo: undefined,
      };

      setObservations((prev) => [newObs, ...prev]);
      Alert.alert('Vita', 'Tafiditra ny fanamarihanao');
    }

    closeModal();
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Hamafa fanamarihana',
      'Tena hofafana tanteraka ity fanamarihana ity?',
      [
        { text: 'Tsia', style: 'cancel' },
        {
          text: 'Eny',
          style: 'destructive',
          onPress: () => {
            setObservations((prev) => prev.filter((obs) => obs.id !== id));
          },
        },
      ]
    );
  };

  const getGraviteColor = (g: string) => {
    if (g === 'grave') return '#ef4444';
    if (g === 'moyen') return '#f59e0b';
    return '#10b981';
  };

  const renderItem = ({ item }: { item: Observation }) => (
    <View style={styles.card}>
      <View
        style={[
          styles.typeIndicator,
          { backgroundColor: getGraviteColor(item.gravite) },
        ]}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.titre}
            </Text>
            <Text style={styles.cardDate}>
              {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          <View style={styles.cardHeaderRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => openEditModal(item)}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.deleteIconBtn]}
              onPress={() => confirmDelete(item.id)}
            >
              <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.tag}>
            <MaterialIcons name="label" size={14} color={COLORS.PRIMARY} />
            <Text style={styles.tagText}>{item.type.toUpperCase()}</Text>
          </View>

          <View
            style={[
              styles.gravitePill,
              { backgroundColor: getGraviteColor(item.gravite) + '22' },
            ]}
          >
            <View
              style={[
                styles.graviteDot,
                { backgroundColor: getGraviteColor(item.gravite) },
              ]}
            />
            <Text
              style={[
                styles.graviteLabel,
                { color: getGraviteColor(item.gravite) },
              ]}
            >
              {item.gravite === 'grave'
                ? 'Mafy'
                : item.gravite === 'moyen'
                ? 'Antonony'
                : 'Maivana'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER AMÉLIORÉ */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Diarin'ny Mpamboly</Text>
            <Text style={styles.subtitle}>
              Tahirizo ireo zava-mitranga eny an-tsaha
            </Text>
          </View>
          <View style={styles.headerIconCircle}>
            <MaterialIcons name="grass" size={26} color="white" />
          </View>
        </View>

        <Text style={styles.headerCount}>
          {observations.length} fanamarihana
        </Text>
      </View>

      {/* LISTE DES JOURNAUX */}
      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="edit-3" size={50} color={COLORS.GRAY_300} />
            <Text style={styles.emptyText}>Mbola tsy misy fanamarihana</Text>
          </View>
        }
      />

      {/* BOUTON FLOTTANT AJOUT */}
      <TouchableOpacity style={styles.fab} onPress={openNewModal}>
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* MODAL AJOUT / MODIFICATION */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Hanova fanamarihana' : 'Fanamarihana Vaovao'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingId
                    ? 'Ahitsio na ampiana ny vaovao'
                    : 'Fenoy tsara ny vaovao an-tsaha'}
                </Text>
              </View>
              <TouchableOpacity onPress={closeModal}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={COLORS.GRAY_500}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Inona no lohateny?</Text>
            <TextInput
              style={styles.input}
              value={titre}
              onChangeText={setTitre}
              placeholder="Ohatra: Nahitana kankana"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Antsipiriany</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder="Lazao eto ny zava-mitranga, ny andro, ny toerana..."
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Sokajy</Text>
            <View style={styles.row}>
              {(['insecte', 'maladie', 'climat', 'sol', 'autre'] as ObsType[]).map(
                (t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.choice, type === t && styles.choiceActive]}
                    onPress={() => setType(t)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        type === t && styles.choiceTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.label}>Hery</Text>
            <View style={styles.row}>
              {(['faible', 'moyen', 'grave'] as ObsGravite[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.choice,
                    gravite === g && styles.choiceActive,
                  ]}
                  onPress={() => setGravite(g)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      gravite === g && styles.choiceTextActive,
                    ]}
                  >
                    {g === 'grave'
                      ? 'Mafy'
                      : g === 'moyen'
                      ? 'Antonony'
                      : 'Maivana'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {editingId ? 'OVAINA' : 'TAHIRIZINA'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5E7EB' },

  // HEADER
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    ...SHADOWS.LIGHT,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  headerCount: {
    marginTop: 14,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },

  // LISTE
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },

  // CARTE JOURNAL
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.LIGHT,
  },
  typeIndicator: { width: 5 },
  cardContent: { flex: 1, padding: 14 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: { flex: 1, paddingRight: 8 },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  cardDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  iconBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.06)',
  },
  deleteIconBtn: {
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  cardDesc: {
    color: '#4B5563',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    letterSpacing: 0.5,
  },
  gravitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  graviteDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  graviteLabel: { fontSize: 12, fontWeight: '600' },

  // BOUTON FLOTTANT
  fab: {
    position: 'absolute',
    bottom: 26,
    right: 24,
    backgroundColor: COLORS.PRIMARY,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.LIGHT,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  // FORMULAIRE
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  choice: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  choiceActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  choiceText: { color: '#4B5563', fontSize: 12, fontWeight: '600' },
  choiceTextActive: { color: 'white' },

  saveBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    ...SHADOWS.LIGHT,
  },
  saveBtnText: { color: 'white', fontWeight: '700', fontSize: 16 },

  // ÉTAT VIDE
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#9CA3AF', marginTop: 10, fontSize: 14 },
});