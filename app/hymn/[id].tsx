import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Touchable, TouchableOpacity, ScrollView } from 'react-native';
import hymnsData from '@/data/hymns.json';
import { Hymn } from '@/types/hymn';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { audioFiles } from '@/constants/audio-files';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const HymnDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const player = useAudioPlayer(selectedAudio);

  const playSound = (hymnId: string) => {
    const audioSource = audioFiles[hymnId];
    setSelectedAudio(audioSource);
  };

  // const audioFiles: { [key: string]: any } = {
  //   '1': require('@/assets/audio/001.mp3'),
  //   // ...add all your hymn audio files here
  // };

  useEffect(() => {
    if (selectedAudio && player) {
      player.play();
    } else {
      player?.pause();
    }
  }, [selectedAudio]);


  const hymn: Hymn | undefined = hymnsData.find(h => h.id === Number(id));

  if (!hymn) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Hymn Not Found',
            headerStyle: { backgroundColor: '#f8f8f8' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Text style={styles.text}>Hymn not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: hymn.name,
            headerStyle: { backgroundColor: '#f8f8f8' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' },
            headerRight: () => (
              <TouchableOpacity style={{ paddingRight: 0 }} onPress={() => playSound(Array.isArray(id) ? id[0] : id)}>
                <Ionicons
                  name="play"
                  size={22}
                  color="#007AFF"
                />

              </TouchableOpacity>
            ),
          }}
        />
        <Text style={styles.title}>{hymn.name}</Text>
        <Text style={styles.text}>Category: {hymn.category}</Text>
        {/* Add more hymn details here */}

        {hymn.verses && hymn.verses.length > 0 ? (
          hymn.verses.map((verse, index) => (
            <Text key={index} style={styles.text}>
              {index + 1}. {verse.text}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No verses available for this hymn.</Text>
        )}

        {/* Add more hymn details here */}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default HymnDetail;