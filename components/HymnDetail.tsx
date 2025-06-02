import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, useColorScheme, Platform } from 'react-native';
import { Hymn } from '@/types/hymn';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Text, useThemeColor, View } from './Themed';
import * as FileSystem from 'expo-file-system';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { DarkTheme, LightTheme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// import hymnsData from '@/data/hymns.json'; // Uncomment if you need to use hymns data directly
interface HymnDetailProps {
    hymn: Hymn;
}

const HymnDetail = ({ hymn }: HymnDetailProps) => {
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const textColor = useThemeColor({}, 'text'); // Gets the current theme's text color
    const textColorSecondary = useThemeColor({}, 'searchText'); // Gets the current theme's text color
    const colorScheme = useColorScheme();

    const player = useAudioPlayer(selectedAudio);
    // const baseUrl = 'https://cdn.jsdelivr.net/gh/rodwanb/sda-hymns@main/mp3/';
    const baseUrl = 'https://raw.githubusercontent.com/rodwanb/sda-hymns/main/mp3/'

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
            // Ensure the file name has 3 digits by padding with leading zeros
            const fileName = `${hymn.id.toString().padStart(3, '0')}.mp3`;

            // const safeFileName = encodeURIComponent(hymn.file_name);
            const audioUrl = `${baseUrl}${fileName}`;
            // const localUri = await downloadAudioIfNeeded(hymn.file_name, audioUrl);
            // setSelectedAudio(localUri);
            setSelectedAudio(audioUrl);
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
            <ActivityIndicator size="small" color={textColor} />
        </View>
    );

    const playButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} onPress={() => playSound()}>
            <Ionicons name="play" size={22} color={textColor} />
        </TouchableOpacity>
    );
    const stopButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} onPress={() => stop()}>
            <Ionicons name="stop" size={22} color={textColor} />
        </TouchableOpacity>
    );

    const downloadButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} disabled>
            <Ionicons name="cloud-download" size={22} color={textColor} />
        </TouchableOpacity>
    );

    const deleteButton = (
        <TouchableOpacity style={{ paddingRight: 0 }} disabled>
            <Ionicons name="trash" size={22} color={textColor} />
        </TouchableOpacity>
    );

    const HeaderRight = () => {
        if (isDownloading) {
            return loadingAnimation;
        } else if (selectedAudio) {
            return stopButton;
        } else if (hymn.file_name) {
            return playButton;
        } else {
            return null; // No audio available
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1 }}
            edges={Platform.OS === 'android' ? ['left', 'right', 'bottom'] : undefined}
        >
            <ScrollView style={styles.container}>
                <Stack.Screen
                    options={{
                        title: `Hymn ${hymn.id}`,
                        headerBackButtonDisplayMode: 'minimal',
                        headerTintColor: textColor,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.background : LightTheme.colors.background,
                        },
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerRight: HeaderRight
                    }}
                />
                <Text style={styles.title}>{hymn.name}</Text>
                {/* <Text style={styles.id}>Hymn ID: {hymn.id}</Text> */}
                {/* <Text style={styles.category}>Category: {hymn.category}</Text> */}
                {/* <Text style={styles.verses}>{hymn.verses.map(verse => verse.text).join('\n\n')}</Text> */}
                {hymn.verses && hymn.verses.length > 0 ? (
                    hymn.verses.map((verse, index) => {
                        const fontColor = verse.id === -1 ? textColorSecondary : textColor; // Use different color for Refrain
                        const fontWeight = verse.id === -1 ? 'bold' : 'normal'; // Make Refrain bold
                        return (
                            <View key={index} style={{ flexDirection: 'column', alignItems: 'flex-start', marginHorizontal: RFPercentage(2), marginTop: RFPercentage(1), paddingBottom: RFPercentage(1) }}>
                                <Text style={[styles.verses, { fontSize: RFPercentage(3), color: fontColor }]}>
                                    {verse.id === -1 ? 'Refrain' : verse.id + 1}.
                                </Text>
                                <Text style={[styles.verses, { flex: 1, flexWrap: 'wrap', fontWeight: fontWeight, fontSize: RFPercentage(3), color: fontColor }]}>
                                    {verse.text}
                                </Text>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.verses}>No verses available for this hymn.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: RFPercentage(5.5),
        // fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: RFPercentage(2),
        // marginTop: RFPercentage(1),
        paddingHorizontal: RFPercentage(1),
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
        fontSize: RFPercentage(3),
        marginTop: 20,
        marginHorizontal: RFPercentage(2),
    },
});

export default HymnDetail;