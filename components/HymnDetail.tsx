import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Hymn } from '@/types/hymn';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Text, View } from './Themed';
import * as FileSystem from 'expo-file-system';

// import hymnsData from '@/data/hymns.json'; // Uncomment if you need to use hymns data directly
interface HymnDetailProps {
    hymn: Hymn;
}

const HymnDetail = ({ hymn }: HymnDetailProps) => {
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const player = useAudioPlayer(selectedAudio);
    const baseUrl = 'https://cdn.jsdelivr.net/gh/rodwanb/sda-hymns@main/mp3/';

    const getLocalFileUri = (fileName: string) => {
        return `${FileSystem.documentDirectory}${encodeURIComponent(fileName)}`;
    };

    const downloadAudioIfNeeded = async (fileName: string, remoteUrl: string) => {
        const localUri = getLocalFileUri(fileName);
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (!fileInfo.exists) {
            setIsDownloading(true);
            try {
                await FileSystem.downloadAsync(remoteUrl, localUri);
            } catch (error) {
                console.error('Download failed:', error);
            }
            setIsDownloading(false);
        }
        return localUri;
    };

    const playSound = async () => {
        try {
            if (!hymn || !hymn.file_name) {
                console.error('Hymn or file_name is not defined');
                return;
            }
            const safeFileName = encodeURIComponent(hymn.file_name);
            const audioUrl = `${baseUrl}${safeFileName}`;
            const localUri = await downloadAudioIfNeeded(hymn.file_name, audioUrl);
            setSelectedAudio(localUri);
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const stop = () => {
        if (player) {
            player.pause();
            setSelectedAudio(null);
        }
    };

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
        })
    }, []);

    useEffect(() => {
        console.log('Selected audio changed:', selectedAudio);
        if (selectedAudio && player) {
            player.play();
        } else {
            player?.pause();
        }
    }, [selectedAudio]);

    const loadingAnimation = (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#007AFF" />
        </View>
    );

    const playButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} onPress={() => playSound()}>
            <Ionicons name="play" size={22} color="#007AFF" />
        </TouchableOpacity>
    );
    const stopButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} onPress={() => stop()}>
            <Ionicons name="stop" size={22} color="#007AFF" />
        </TouchableOpacity>
    );
    
    const downloadButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} disabled>
            <Ionicons name="cloud-download" size={22} color="#007AFF" />
        </TouchableOpacity>
    );

    const deleteButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} disabled>
            <Ionicons name="trash" size={22} color="#007AFF" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: hymn.name,
                    // headerStyle: { backgroundColor: '#f8f8f8' },
                    // headerTintColor: '#333',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerRight: () => (
                        <>
                            {isDownloading ? (
                                loadingAnimation
                            ) : selectedAudio ? (
                                stopButton
                            ) : hymn.file_name ? (
                                playButton
                            ) : null}
                        </>
                    )
                }}
            />
            <Text style={styles.title}>{hymn.name}</Text>
            <Text style={styles.id}>Hymn ID: {hymn.id}</Text>
            <Text style={styles.category}>Category: {hymn.category}</Text>
            {/* <Text style={styles.verses}>{hymn.verses.map(verse => verse.text).join('\n\n')}</Text> */}
            {hymn.verses && hymn.verses.length > 0 ? (
                hymn.verses.map((verse, index) => (
                    <Text key={index} style={styles.verses}>
                        {index + 1}. {verse.text}
                    </Text>
                ))
            ) : (
                <Text style={styles.verses}>No verses available for this hymn.</Text>
            )}
        </ScrollView>
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
        fontSize: 20,
        marginTop: 20,
    },
});

export default HymnDetail;