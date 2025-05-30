import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import hymnsData from '@/data/hymns.json';
import { useThemeColor } from './Themed'; // Add this import

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';
import { Hymn } from '@/types/hymn';

export default function HymnList({ path }: { path: string }) {

  const [hymns, setHymns] = React.useState<Hymn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const separatorColor = useThemeColor({}, 'text'); // Gets the current theme's text color

  // useeffect to fetch hymns data from hymns.json and parse it
  useEffect(() => {
    const fetchHymns = async () => {
      try {
        setHymns(hymnsData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };
    fetchHymns();
  }, []);
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
  if (hymns.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hymns found.</Text>
      </View>
    );
  }
  const renderHymnItem = ({ item }: { item: Hymn }) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{item.id}. {item.name}</Text>
        {/* <MonoText>{item.verses[0]}</MonoText> */}
      </TouchableOpacity>
    </View>
  );
  const keyExtractor = (item: { id: number }) => item.id.toString();

  return (
    <View style={styles.container}>
      <FlatList
        data={hymns}
        renderItem={renderHymnItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.text}>No hymns available.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />}
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

});
