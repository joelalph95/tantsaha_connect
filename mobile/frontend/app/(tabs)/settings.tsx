import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DataService } from '../../services/DataService';
import { AppParameters } from '../../models/Parameters';

// Type pour un utilisateur
type User = {
  id: string;
  name: string;
  role: string;
  location: string;
};

const COLORS = {
  PRIMARY: '#2E7D32',
  SECONDARY: '#8D6E63',
  BACKGROUND: '#F1F8E9',
  WHITE: '#FFFFFF',
  DANGER: '#D32F2F',
  GRAY_BORDER: '#E0E0E0',
  TEXT_DARK: '#1B5E20',
  TEXT_LIGHT: '#546E7A',
  SUCCESS: '#4CAF50',
};

export default function SettingsScreen() {
  const [params, setParams] = useState<AppParameters | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // États pour le modal d'ajout/modification d'utilisateur
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Madagasikara');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await DataService.getParameters();

      // Récupération des utilisateurs (à adapter selon ton DataService réel)
      // Si tu n'as pas encore de méthode, voici un exemple avec AsyncStorage ou autre
      let storedUsers: User[] = [];
      try {
        // Exemple : storedUsers = await DataService.getUsers();
        // Pour le moment, on simule avec un utilisateur par défaut
        storedUsers = [
          { id: '1', name: 'Tantsaha', role: 'Mpamboly', location: 'Madagasikara' },
        ];
      } catch (e) {
        storedUsers = [];
      }

      setParams(data);
      setUsers(storedUsers);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Olana', 'Tsy afaka naka ny angona');
    } finally {
      setLoading(false);
    }
  };

  const updateParameter = async (updates: Partial<AppParameters>) => {
    if (!params) return;
    try {
      setSaving(true);
      const updated = await DataService.updateParameters(updates);
      setParams(updated);
    } catch (error) {
      Alert.alert('Olana', 'Tsy voatahiry ny fanovana');
    } finally {
      setSaving(false);
    }
  };

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setName(user.name);
      setRole(user.role);
      setLocation(user.location);
    } else {
      setEditingUser(null);
      setName('');
      setRole('');
      setLocation('Madagasikara');
    }
    setModalVisible(true);
  };

  const saveUser = async () => {
    if (!name.trim() || !role.trim()) {
      Alert.alert('Diso', 'Fenoy azafady ny anarana sy ny andraikitra');
      return;
    }

    const userData: User = {
      id: editingUser?.id || Date.now().toString(),
      name: name.trim(),
      role: role.trim(),
      location: location.trim() || 'Madagasikara',
    };

    let newUsers: User[];
    if (editingUser) {
      newUsers = users.map((u) => (u.id === editingUser.id ? userData : u));
    } else {
      newUsers = [...users, userData];
    }

    try {
      // À adapter : await DataService.saveUsers(newUsers);
      // Pour l'exemple, on met à jour localement
      setUsers(newUsers);
      setModalVisible(false);
      Alert.alert('Voatahiry', `Voatahiry ny mpampiasa "${userData.name}"`);
    } catch (error) {
      Alert.alert('Olana', 'Tsy voatahiry ny mpampiasa');
    }
  };

  const deleteUser = (user: User) => {
    if (users.length === 1) {
      Alert.alert('Tsy azo atao', 'Tsy afaka mamafa ny mpampiasa farany');
      return;
    }

    Alert.alert(
      'Hamafa ve ity mpampiasa ity?',
      `Ho voafafa tanteraka "${user.name}". Tsy azo averina izany.`,
      [
        { text: 'Aoka ihany', style: 'cancel' },
        {
          text: 'Eny, hamafa',
          style: 'destructive',
          onPress: async () => {
            try {
              const newUsers = users.filter((u) => u.id !== user.id);
              // await DataService.saveUsers(newUsers);
              setUsers(newUsers);
              Alert.alert('Voafafa', 'Voafafa ny mpampiasa');
            } catch (error) {
              Alert.alert('Olana', 'Tsy afaka namafa');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Hamafa ve ny angona rehetra?',
      'Ho voafafa tanteraka ny tanimboly, tatitra ary fandrindrana rehetra. Tsy azo averina izany.',
      [
        { text: 'Aoka ihany', style: 'cancel' },
        {
          text: 'Eny, hamafa',
          style: 'destructive',
          onPress: () => {
            // TODO: Implémenter la suppression réelle
            Alert.alert('Voafafa', 'Voafafa tanteraka ny angona rehetra.');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Am-pakana ny fandrindrana...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fandrindrana</Text>
          <Text style={styles.subtitle}>Fanamboarana ny fampiharana</Text>
        </View>

        {/* Section Mpampiasa */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mpampiasa</Text>
            <TouchableOpacity onPress={() => openUserModal()} style={styles.addButton}>
              <MaterialIcons name="add-circle-outline" size={28} color={COLORS.PRIMARY} />
              <Text style={styles.addButtonText}>Hanampy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {users.length === 0 ? (
              <View style={styles.emptyUsers}>
                <Text style={styles.emptyText}>Tsy misy mpampiasa voasoratra</Text>
                <TouchableOpacity onPress={() => openUserModal()}>
                  <Text style={styles.emptyLink}>Hanampy mpampiasa vaovao</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.userItem}>
                    <View style={styles.userInfo}>
                      <MaterialIcons name="person" size={32} color={COLORS.PRIMARY} />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userRole}>{item.role} • {item.location}</Text>
                      </View>
                    </View>
                    <View style={styles.userActions}>
                      <TouchableOpacity onPress={() => openUserModal(item)}>
                        <MaterialIcons name="edit" size={24} color={COLORS.SECONDARY} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteUser(item)} style={{ marginLeft: 16 }}>
                        <MaterialIcons name="delete" size={24} color={COLORS.DANGER} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
              />
            )}
          </View>
        </View>

        {/* Fifandraisana */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fifandraisana</Text>
          <View style={styles.card}>
            <View style={styles.switchItem}>
              <MaterialCommunityIcons name="wifi-off" size={28} color={COLORS.PRIMARY} />
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Mode tsy misy internet</Text>
                <Text style={styles.itemSubtext}>
                  Afaka ampiasaina na dia tsy misy connexion aza
                </Text>
              </View>
              <Switch
                value={params?.mode_offline || false}
                onValueChange={(value) => updateParameter({ mode_offline: value })}
                trackColor={{ false: '#C8E6C9', true: COLORS.PRIMARY }}
                thumbColor={COLORS.WHITE}
                ios_backgroundColor="#C8E6C9"
                disabled={saving}
              />
            </View>
          </View>
        </View>

        {/* Fampandrenesana */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fampandrenesana</Text>
          <View style={styles.card}>
            <View style={styles.switchItem}>
              <MaterialIcons name="notifications-active" size={28} color={COLORS.PRIMARY} />
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Fanairana</Text>
                <Text style={styles.itemSubtext}>
                  Mahazo fampitandremana momba ny toetr’andro sy loza
                </Text>
              </View>
              <Switch
                value={params?.notifications || false}
                onValueChange={(value) => updateParameter({ notifications: value })}
                trackColor={{ false: '#C8E6C9', true: COLORS.PRIMARY }}
                thumbColor={COLORS.WHITE}
                ios_backgroundColor="#C8E6C9"
                disabled={saving}
              />
            </View>
            {saving && (
              <View style={styles.savingIndicator}>
                <ActivityIndicator size="small" color={COLORS.SUCCESS} />
                <Text style={styles.savingText}>Mitahiry...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Farfana angona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farfana</Text>
          <TouchableOpacity
            style={styles.dangerCard}
            onPress={handleDeleteAllData}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Hamafa ny angona rehetra"
          >
            <MaterialIcons name="delete-forever" size={30} color={COLORS.DANGER} />
            <View style={styles.itemContent}>
              <Text style={styles.dangerText}>Fafana ny angona rehetra</Text>
              <Text style={styles.itemSubtext}>
                Tanimboly, tatitra ary fandrindrana rehetra
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.DANGER} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Tantsaha Connect v1.0</Text>
          <Text style={styles.footerText}>Natao ho an’ny tantsaha Malagasy</Text>
        </View>
      </ScrollView>

      {/* Modal Ajout/Modification Mpampiasa */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Hanova ny mpampiasa' : 'Mpampiasa vaovao'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color={COLORS.TEXT_DARK} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Anarana (oh: Rabe)"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Andraikitra (oh: Mpamboly, Mpitantana)"
              value={role}
              onChangeText={setRole}
            />
            <TextInput
              style={styles.input}
              placeholder="Toerana (oh: Antananarivo)"
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hanafoana</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveUser}
              >
                <Text style={styles.saveButtonText}>Hitahiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: COLORS.TEXT_DARK },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 60 : 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.WHITE },
  subtitle: { fontSize: 15, color: '#C8E6C9', marginTop: 6 },
  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addButtonText: { fontSize: 15, color: COLORS.PRIMARY, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
  },
  itemContent: { flex: 1 },
  itemLabel: { fontSize: 16, color: COLORS.TEXT_DARK, fontWeight: '600' },
  itemSubtext: { fontSize: 13, color: COLORS.TEXT_LIGHT, marginTop: 4, lineHeight: 18 },
  divider: { height: 1, backgroundColor: COLORS.GRAY_BORDER, marginHorizontal: 18 },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT_DARK },
  userRole: { fontSize: 13, color: COLORS.TEXT_LIGHT, marginTop: 2 },
  userActions: { flexDirection: 'row', alignItems: 'center' },
  emptyUsers: { padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 15, color: COLORS.TEXT_LIGHT, marginBottom: 10 },
  emptyLink: { fontSize: 15, color: COLORS.PRIMARY, fontWeight: '600' },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    gap: 16,
  },
  dangerText: { fontSize: 17, color: COLORS.DANGER, fontWeight: '700' },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  savingText: { fontSize: 13, color: COLORS.SUCCESS, fontWeight: '500' },
  footer: { padding: 40, alignItems: 'center' },
  versionText: { fontSize: 15, fontWeight: 'bold', color: COLORS.SECONDARY },
  footerText: { fontSize: 13, color: COLORS.TEXT_LIGHT, marginTop: 6, textAlign: 'center' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    width: '90%',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.TEXT_DARK },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY_BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelButton: { backgroundColor: '#EEEEEE' },
  cancelButtonText: { color: COLORS.TEXT_DARK, fontWeight: '600' },
  saveButton: { backgroundColor: COLORS.PRIMARY },
  saveButtonText: { color: COLORS.WHITE, fontWeight: '700' },
});