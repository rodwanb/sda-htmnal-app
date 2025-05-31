import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, TextInput, Touchable, TouchableOpacity } from 'react-native';
import hymnsData from '@/data/hymns.json';
import { useThemeColor } from './Themed'; // Add this import

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';
import { Hymn } from '@/types/hymn';

import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useRef } from 'react';

export default function HymnList({ path }: { path: string }) {

  const [hymns, setHymns] = React.useState<Hymn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = useState('');
  const separatorColor = useThemeColor({}, 'text'); // Gets the current theme's text color
  const searchBarBg = useThemeColor({ light: '#fff', dark: '#222' }, 'background');
  const searchBarPlaceholderColor = useThemeColor({ light: '#888', dark: '#ccc' }, 'text')

  useEffect(() => {
    setHymns(hymnsData);
    setLoading(false);
    setAudioModeAsync({
      playsInSilentMode: true,
    })
  }, []);

  // Filter hymns based on search
  const filteredHymns = hymns.filter(
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

  const audioFiles: { [key: string]: any } = {
    '1': require('@/assets/audio/001.mp3'),
    // ...add all your hymn audio files here
  };

  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const player = useAudioPlayer(selectedAudio);

  const playSound = (hymnId: number) => {
    const audioSource = audioFiles[hymnId.toString()];
    setSelectedAudio(audioSource);
  };

  useEffect(() => {
    if (selectedAudio && player) {
      player.play();
    } else {
      player?.pause();
    }
  }, [selectedAudio]);

  const renderHymnItem = ({ item }: { item: Hymn }) => (
    <TouchableOpacity onPress={() => playSound(item.id)}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{item.id}. {item.name}</Text>
      {/* <MonoText>{item.verses[0]}</MonoText> */}
    </TouchableOpacity>
  );
  const keyExtractor = (item: { id: number }) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading hymns...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error loading hymns: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.searchBarContainer, { backgroundColor: searchBarBg }]}>
        <TextInput
          placeholder="Search hymns..."
          value={search}
          onChangeText={setSearch}
          style={[styles.searchBar, { color: searchBarPlaceholderColor }]}
          autoCapitalize="none"
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
          placeholderTextColor={searchBarPlaceholderColor}
        />
      </View>
      <FlatList
        data={filteredHymns}
        renderItem={renderHymnItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.text}>No hymns available.</Text>}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        )}
        keyboardShouldPersistTaps="always"
      />
    </View>
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
    // backgroundColor: '#fff',
  },
  searchBar: {
    // backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    fontSize: 16,
  },

});
