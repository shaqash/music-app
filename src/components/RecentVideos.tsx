import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { StorageService } from '../services/StorageService';
import type { SearchResult } from '../types/newpipe';

interface RecentVideosProps {
    onVideoSelect: (video: SearchResult) => void;
}

export const RecentVideos: React.FC<RecentVideosProps> = ({ onVideoSelect }) => {
    const [recentVideos, setRecentVideos] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentVideos();
    }, []);

    const loadRecentVideos = async () => {
        try {
            const videos = await StorageService.getRecentVideos();
            setRecentVideos(videos);
        } catch (error) {
            console.error('Error loading recent videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderVideo = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.videoItem}
            onPress={() => onVideoSelect(item)}
        >
            {item.thumbnailUrl && (
                <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={styles.thumbnail}
                />
            )}
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (recentVideos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recent videos</Text>
                <Text style={styles.emptySubtext}>
                    Your recently played music videos will appear here
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Recent Videos</Text>
            <FlatList
                data={recentVideos}
                renderItem={renderVideo}
                keyExtractor={(item) => item.url}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#b3b3b3',
        textAlign: 'center',
    },
    listContent: {
        padding: 8,
    },
    videoItem: {
        flexDirection: 'row',
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#282828',
        borderRadius: 8,
    },
    thumbnail: {
        width: 120,
        height: 68,
        borderRadius: 4,
    },
    videoInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    videoTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
});

export default RecentVideos; 