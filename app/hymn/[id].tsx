import React, { } from 'react';
import { Text, StyleSheet } from 'react-native';
import hymnsData from '@/data/hymns.json';
import { Hymn } from '@/types/hymn';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import HymnDetail from '@/components/HymnDetail';
import { View } from '@/components/Themed';

const HymnPage = () => {
  const { id } = useLocalSearchParams();
  const hymn: Hymn | undefined = hymnsData.find(h => h.id === Number(id));
  if (!hymn) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Hymn Not Found',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Text style={styles.text}>Hymn not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HymnDetail hymn={hymn} />
    </View>
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

export default HymnPage;