import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Hymn } from '@/types/hymn';

interface HymnDetailProps {
  hymn: Hymn;
}

const HymnDetail: React.FC<HymnDetailProps> = ({ hymn }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hymn.name}</Text>
      <Text style={styles.id}>Hymn ID: {hymn.id}</Text>
      <Text style={styles.category}>Category: {hymn.category}</Text>
      <Text style={styles.verses}>{hymn.verses.join('\n')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 16,
    marginVertical: 10,
  },
  category: {
    fontSize: 16,
    marginVertical: 10,
  },
  verses: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default HymnDetail;