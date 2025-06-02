import React, { useState } from 'react';
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
import type { StreamInfo } from '../types/newpipe';

export const StreamInfoViewer: React.FC = () => {
    const [url, setUrl] = useState('');
    const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchInfo = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const info = await NewPipeService.getStreamInfo(url);
            setStreamInfo(info);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stream info');
            setStreamInfo(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={url}
                    onChangeText={setUrl}
                    placeholder="Enter video URL"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleFetchInfo}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading...' : 'Get Info'}
                    </Text>
                </TouchableOpacity>
            </View>

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}

            {loading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            )}

            {streamInfo && (
                <ScrollView style={styles.infoContainer}>
                    <Text style={styles.title}>{streamInfo.title}</Text>
                    <Text style={styles.uploader}>By: {streamInfo.uploaderName}</Text>
                    <Text style={styles.views}>Views: {streamInfo.viewCount}</Text>
                    
                    <Text style={styles.sectionTitle}>Description:</Text>
                    <Text style={styles.description}>{streamInfo.description}</Text>
                    
                    <Text style={styles.sectionTitle}>Available Streams:</Text>
                    {streamInfo.videoStreams.map((stream, index) => (
                        <View key={index} style={styles.streamItem}>
                            <Text>Resolution: {stream.resolution}</Text>
                            <Text>Format: {stream.format}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 16,
    },
    loader: {
        marginVertical: 24,
    },
    infoContainer: {
        flex: 1,
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
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 8,
    },
}); 