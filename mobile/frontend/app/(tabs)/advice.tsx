import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { DataService } from '../../services/DataService';
import { Advice } from '../../models/Advice';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/Design';

const { width } = Dimensions.get('window');

export default function AdviceScreen() {
  const [advice, setAdvice] = useState<Advice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAdvice();
    DataService.initializeAdvice();
  }, []);

  const loadAdvice = async () => {
    const data = await DataService.getAdvice();
    setAdvice(data);
  };

  const categories = [
    { key: 'all', label: 'Rehetra', icon: 'grid-view', color: '#6366f1' },
    { key: 'general', label: 'Ankapobeny', icon: 'lightbulb', color: '#f59e0b' },
    { key: 'fertilisation', label: 'Zezika', icon: 'leaf', color: '#10b981' },
    { key: 'irrigation', label: 'Rano', icon: 'water', color: '#3b82f6' },
    { key: 'parasites', label: 'Bibikely', icon: 'bug-report', color: '#ef4444' },
    { key: 'maladie', label: 'Aretina', icon: 'healing', color: '#8b5cf6' },
  ];

  const filteredAdvice = selectedCategory === 'all' 
    ? advice 
    : advice.filter(a => a.categorie === selectedCategory);

  const getLevelInfo = (niveau: string) => {
    switch (niveau) {
      case 'advanced': return { label: 'Sarotra', color: '#ef4444', bg: '#fee2e2' };
      case 'intermediate': return { label: 'Antonony', color: '#f59e0b', bg: '#fef3c7' };
      default: return { label: 'Tsotra', color: '#10b981', bg: '#d1fae5' };
    }
  };

  const renderAdvice = ({ item }: { item: Advice }) => {
    const level = getLevelInfo(item.niveau);
    const categoryColor = categories.find(c => c.key === item.categorie)?.color || COLORS.PRIMARY;

    return (
      <View style={styles.adviceCard}>
        {/* Barre de couleur latérale pour identifier la catégorie */}
        <View style={[styles.cardAccent, { backgroundColor: categoryColor }]} />
        
        <View style={styles.cardMainContent}>
          <View style={styles.adviceHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.adviceTitle}>{item.titre}</Text>
              {item.culture && (
                <View style={styles.cultureTag}>
                  <Text style={styles.cultureTagText}>{item.culture}</Text>
                </View>
              )}
            </View>
            <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
              <Text style={[styles.levelText, { color: level.color }]}>{level.label}</Text>
            </View>
          </View>

          <Text style={styles.adviceDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.adviceFooter}>
            <View style={styles.categoryInfo}>
               <MaterialIcons name="label" size={14} color={COLORS.GRAY_300} />
               <Text style={styles.categoryInfoText}>
                 {categories.find(c => c.key === item.categorie)?.label}
               </Text>
            </View>
            
            {item.audio && (
              <TouchableOpacity style={styles.audioPlayButton}>
                <Ionicons name="play-circle" size={24} color={COLORS.PRIMARY} />
                <Text style={styles.audioPlayText}>Henoy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER DESIGN */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Torohevitra</Text>
          <Text style={styles.subtitle}>Hampitomboana ny vokatrao</Text>
        </View>
        <View style={styles.headerIcon}>
           <FontAwesome5 name="seedling" size={40} color="rgba(255,255,255,0.2)" />
        </View>
      </View>

      {/* CATEGORIES HORIZONTALES */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.key;
            return (
              <TouchableOpacity
                style={[styles.categoryItem, isActive && styles.categoryItemActive]}
                onPress={() => setSelectedCategory(item.key)}
              >
                <View style={[styles.iconCircle, { backgroundColor: isActive ? 'white' : '#f1f5f9' }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={isActive ? item.color : '#64748b'} />
                </View>
                <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.key}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{filteredAdvice.length} torohevitra hita</Text>
          <View style={styles.divider} />
        </View>

        {filteredAdvice.length > 0 ? (
          filteredAdvice.map((item) => (
            <View key={item.id}>{renderAdvice({ item })}</View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="auto-fix-off" size={64} color={COLORS.GRAY_500} />
            <Text style={styles.emptyStateTitle}>Tsy misy hita</Text>
            <Text style={styles.emptyStateSub}>Andramo ovaina ny sokajy fikarohana</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomRightRadius: 40,
  },
  headerContent: { flex: 1 },
  headerIcon: { marginLeft: 20 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  filterSection: {
    marginTop: -25,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingRight: 16,
    paddingLeft: 6,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 12,
    ...SHADOWS.LIGHT,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryItemActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  categoryLabelActive: {
    color: 'white',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 15,
  },
  resultsCount: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginRight: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  adviceCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  cardAccent: {
    width: 5,
  },
  cardMainContent: {
    flex: 1,
    padding: 16,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  adviceTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cultureTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  cultureTagText: {
    fontSize: 11,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  adviceDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  adviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryInfoText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  audioPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioPlayText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 16,
  },
  emptyStateSub: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
  },
});