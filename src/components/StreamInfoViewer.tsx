import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import NewPipeService from '../services/NewPipeService';
import AudioPlayer from './AudioPlayer';
import type { StreamInfo, AudioStream } from '../types/newpipe';

interface StreamInfoViewerProps {
    initialUrl?: string;
}

export const StreamInfoViewer: React.FC<StreamInfoViewerProps> = ({ initialUrl = '' }) => {
    const [url, setUrl] = useState(initialUrl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
    const [selectedAudioStream, setSelectedAudioStream] = useState<AudioStream | null>(null);

    useEffect(() => {
        if (initialUrl) {
            setUrl(initialUrl);
            fetchStreamInfo(initialUrl);
        }
    }, [initialUrl]);

    const fetchStreamInfo = async (videoUrl: string) => {
        if (!videoUrl) {
            setError('Please enter a URL');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const info = await NewPipeService.getStreamInfo(videoUrl);
            setStreamInfo(info);
            
            // Automatically select highest quality audio stream
            if (info.audioStreams && info.audioStreams.length > 0) {
                const bestAudio = info.audioStreams.reduce((prev: AudioStream, current: AudioStream) => 
                    prev.averageBitrate > current.averageBitrate ? prev : current
                );
                setSelectedAudioStream(bestAudio);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stream info');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={url}
                    onChangeText={setUrl}
                    placeholder="Enter video URL"
                    placeholderTextColor="#666"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => fetchStreamInfo(url)}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Get Info</Text>
                    )}
                </TouchableOpacity>
            </View>

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}

            {streamInfo && (
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{streamInfo.title}</Text>
                    <Text style={styles.uploader}>By {streamInfo.uploaderName}</Text>
                    <Text style={styles.views}>{streamInfo.viewCount.toLocaleString()} views</Text>
                    
                    {selectedAudioStream && (
                        <AudioPlayer
                            url={selectedAudioStream.url}
                            title={`${streamInfo.title} (${selectedAudioStream.format})`}
                        />
                    )}

                    <Text style={styles.sectionTitle}>Available Audio Streams</Text>
                    {streamInfo.audioStreams.map((stream, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.streamItem,
                                selectedAudioStream?.url === stream.url && styles.selectedStream
                            ]}
                            onPress={() => setSelectedAudioStream(stream)}
                        >
                            <Text style={styles.streamText}>
                                {stream.format} - {(stream.averageBitrate / 1000).toFixed(0)}kbps
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{streamInfo.description}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
        color: '#000',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    uploader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    views: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    streamItem: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    selectedStream: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 1,
    },
    streamText: {
        fontSize: 14,
        color: '#333',
    },
});

export default StreamInfoViewer; 