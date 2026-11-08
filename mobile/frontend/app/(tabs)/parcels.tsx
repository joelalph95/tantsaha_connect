import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useState } from 'react';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Parcel } from '../../models/Parcel';
import { COLORS, SPACING, SHADOWS } from '../../constants/Design';

export default function ParcelsScreen() {
  const [parcels, setParcels] = useState<Parcel[]>([
    {
      id: '1',
      nom: 'Tanimboly Test',
      superficie: 1500,
      localisation: 'Antananarivo',
      cultures: ['Vary'],
      farmerId: '', createdAt: '', updatedAt: ''
    }
  ]);
  
  // États pour les Modals
  const [modalVisible, setModalVisible] = useState(false);
  const [cultureModalVisible, setCultureModalVisible] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  
  // États des formulaires
  const [name, setName] = useState('');
  const [superficie, setSuperficie] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [newCulture, setNewCulture] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FONCTION : AJOUTER UNE PARCELLE ---
  const handleAddParcel = () => {
    const areaValue = parseFloat(superficie.replace(',', '.'));
    if (!name || isNaN(areaValue) || !localisation) {
      Alert.alert('Fenoina', 'Fenoy daholo ny banga azafady');
      return;
    }

    const newParcel: Parcel = {
      id: Date.now().toString(),
      nom: name,
      superficie: areaValue,
      localisation: localisation,
      cultures: [],
      farmerId: '', createdAt: '', updatedAt: ''
    };

    setParcels([newParcel, ...parcels]);
    setModalVisible(false);
    setName(''); setSuperficie(''); setLocalisation('');
  };

  // --- FONCTION : AJOUTER UNE CULTURE À UNE PARCELLE ---
  const handleAddCulture = () => {
    if (!newCulture.trim() || !selectedParcel) return;

    const updatedParcels = parcels.map(p => {
      if (p.id === selectedParcel.id) {
        return { ...p, cultures: [...(p.cultures || []), newCulture.trim()] };
      }
      return p;
    });

    setParcels(updatedParcels);
    setNewCulture('');
    setCultureModalVisible(false);
    setSelectedParcel(null);
  };

  const deleteParcel = (id: string) => {
    Alert.alert("Famafana", "Tena hamafa ity ve ianao?", [
      { text: "Tsia" },
      { text: "Eny", onPress: () => setParcels(parcels.filter(p => p.id !== id)) }
    ]);
  };

  const renderParcel = ({ item }: { item: Parcel }) => (
    <TouchableOpacity 
      style={styles.parcelCard} 
      onPress={() => {
        setSelectedParcel(item);
        setCultureModalVisible(true);
      }}
    >
      <View style={styles.parcelHeader}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="agriculture" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.parcelName}> {item.nom}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteParcel(item.id)}>
          <MaterialIcons name="delete-outline" size={22} color={COLORS.DANGER} />
        </TouchableOpacity>
      </View>

      <View style={styles.rowInfo}>
        <View style={styles.infoItem}>
          <Feather name="map-pin" size={14} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.infoText}> {item.localisation}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="aspect-ratio" size={14} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.infoText}> {item.superficie} m²</Text>
        </View>
      </View>
      
      <View style={styles.cultureTagContainer}>
        {item.cultures && item.cultures.length > 0 ? (
          item.cultures.map((c, index) => (
            <View key={index} style={styles.cultureTag}>
              <Text style={styles.cultureTagText}>{c}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCultureText}>+ Hanampy voly (tsindrio eto)</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ny tanimboliko</Text>
        <Text style={styles.subtitle}>Tsindrio ny tanimboly hanampiana voly</Text>
      </View>

      <FlatList
        data={parcels}
        renderItem={renderParcel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* --- MODAL 1 : CREER PARCELLE --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tanimboly vaovao</Text>
            <TextInput style={styles.input} placeholder="Anaran'ny tanimboly" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Velarantany (m²)" value={superficie} onChangeText={setSuperficie} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Toerana" value={localisation} onChangeText={setLocalisation} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text>Hajanonana</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddParcel}><Text style={{color:'white'}}>Mamorona</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2 : AJOUTER PRODUCTION (CULTURE) --- */}
      <Modal visible={cultureModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { marginBottom: 100 }]}>
            <Text style={styles.modalTitle}>Inona no volena eto?</Text>
            <Text style={{ marginBottom: 10, color: COLORS.TEXT_SECONDARY }}>Parcelle: {selectedParcel?.nom}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Ohatra: Vary, Katsaka, Voanjo..." 
              value={newCulture} 
              onChangeText={setNewCulture}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={() => { setCultureModalVisible(false); setNewCulture(''); }}
              >
                <Text>Hiverina</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddCulture}>
                <Text style={{color:'white'}}>Ampiana</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: COLORS.PRIMARY, padding: 25, paddingTop: 50, borderBottomRightRadius: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 5 },
  parcelCard: { backgroundColor: 'white', borderRadius: 15, padding: 16, marginBottom: 15, ...SHADOWS.LIGHT, elevation: 3 },
  parcelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  parcelName: { fontSize: 18, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  rowInfo: { flexDirection: 'row', gap: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: COLORS.TEXT_SECONDARY },
  cultureTagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 6 },
  cultureTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  cultureTagText: { fontSize: 12, color: '#2E7D32', fontWeight: '600' },
  noCultureText: { fontSize: 12, color: COLORS.PRIMARY, fontStyle: 'italic' },
  fab: { position: 'absolute', bottom: 25, right: 25, backgroundColor: COLORS.PRIMARY, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnCancel: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#eee', borderRadius: 10 },
  btnSubmit: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: COLORS.PRIMARY, borderRadius: 10 },
});