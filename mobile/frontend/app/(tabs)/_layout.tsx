import { Tabs } from 'expo-router';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Design';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32', // Maitso (Vert forêt) - Loko famantarana ny tetikasa
        tabBarInactiveTintColor: '#546E7A',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      
      {/* Fandraisana - Pejy voalohany */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fandraisana',
          tabBarLabel: 'Fandraisana',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />

      {/* BF1: Toetany - Météo du jour (Laharana voalohany ⭐⭐⭐⭐⭐) */}
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Toetany',
          tabBarLabel: 'Toetany',
          tabBarIcon: ({ color, size }) => <Feather name="cloud-rain" color={color} size={size} />,
        }}
      />

      {/* BF2: Filazana Loza - Alertes agricoles */}
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Filazana Loza',
          tabBarLabel: 'Filazana Loza',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="alert-decagram" color={color} size={size} />,
        }}
      />

      {/* BF3: Saha - Gestion des Parcelles (Laharana voalohany ⭐⭐⭐⭐⭐) */}
      <Tabs.Screen
        name="parcels"
        options={{
          title: 'Saha',
          tabBarLabel: 'Saha',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="grid-view" color={color} size={size} />,
        }}
      />

      {/* BF4: Diary - Journal d’observation */}
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Diary',
          tabBarLabel: 'Diary',
          tabBarIcon: ({ color, size }) => <Feather name="edit-3" color={color} size={size} />,
        }}
      />

      {/* BF5: Toro-hevitra - Conseils agricoles (Misy feo audio) */}
      <Tabs.Screen
        name="advice"
        options={{
          title: 'Toro-hevitra',
          tabBarLabel: 'Toro-hevitra',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="lightbulb-outline" color={color} size={size} />,
        }}
      />

      {/* BNF3: Fikirana - Paramètres sy Mode hors-ligne */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Fikirana',
          tabBarLabel: 'Fikirana',
          tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}