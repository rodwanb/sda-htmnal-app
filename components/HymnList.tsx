import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import hymnsData from '@/data/hymns.json';
import { useThemeColor } from './Themed'; // Add this import

import { Text, View } from './Themed';

import { Hymn } from '@/types/hymn';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HymnList({ path }: { path: string }) {

  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const textColor = useThemeColor({}, 'text'); // Gets the current theme's text color
  const searchBarBg = useThemeColor({ light: '#fff', dark: '#222' }, 'background');
  const searchBarPlaceholderColor = useThemeColor({ light: '#888', dark: '#ccc' }, 'text')

  useEffect(() => {
    setHymns(hymnsData);
    setLoading(false);
  }, []);

  // Filter hymns based on search
  const filteredHymns = useMemo(() => {
    return hymns.filter(
      hymn =>
        hymn.name?.toLowerCase().includes(search.toLowerCase()) ||
        hymn.id?.toString().includes(search)
    )
      .filter(
        hymn => hymn.category !== 'Uncategorized' // Exclude hymns with 'Uncategorized' category
      )
      .filter(
        hymn => hymn.category_id <= 62 // Exclude hymns with 'Uncategorized' category
      );
  }, [hymns, search]);

  const renderHymnItem = ({ item }: { item: Hymn }) => (
    <TouchableOpacity onPress={() =>
      router.push(`/hymn/${item.id}`) // Navigate to hymn detail page
    }>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{item.id}. {item.name}</Text>
      {/* <MonoText>{item.verses[0]}</MonoText> */}
    </TouchableOpacity>
  );
  const keyExtractor = (item: { id: number }) => item.id.toString();

  const ListHeader = useMemo(() => (
    <>
      <Image source={require('@/assets/images/adventist_logo.png')} style={{ width: 100, height: 100, alignSelf: 'center', tintColor: textColor }} />
      <Text style={styles.logoText}>Seventh-day{'\n'}Adventist Hymnal</Text>
      <View style={[styles.searchBarContainer]}>
        <TextInput
          placeholder="Search hymns..."
          value={search}
          onChangeText={setSearch}
          style={[styles.searchBar, { backgroundColor: searchBarBg, color: searchBarPlaceholderColor }]}
          autoCapitalize="none"
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
          placeholderTextColor={searchBarPlaceholderColor}
        />
      </View>
    </>
  ), [search]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Loading hymns...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Error loading hymns: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <FlatList
          data={filteredHymns}
          renderItem={renderHymnItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<Text style={styles.text}>No hymns available.</Text>}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          )}
          keyboardShouldPersistTaps="always"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  logoText: {
    fontSize: 42,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    // color: Colors.light.text,
  },
  text: {
    fontSize: 20,
    lineHeight: 24,
    // color: Colors.light.text,
    marginHorizontal: 10,
    padding: 10,
  },
  separator: {
    // marginVertical: 30,
    height: 1,
    // width: '80%',
  },
  searchBarContainer: {
    padding: 10,
    // backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  searchBar: {
    // backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 46,
    fontSize: 20,
  },

});
