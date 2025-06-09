import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StorageService } from '../services/StorageService';
import type { SearchResult } from '../types/newpipe';
import { accentColor } from '../theme/colors';

const { width } = Dimensions.get('window');

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
        <View style={styles.videoItemContainer}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
          />
        </View>
      )}
      <Text style={styles.videoTitle} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accentColor} />
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
      <Text style={styles.sectionTitle}>Recent</Text>
      <FlatList
        data={recentVideos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.url}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    padding: 12,
    paddingBottom: 6,
  },
  videoItemContainer: {
    borderRadius: 8,
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
    maxWidth: 84,
    marginRight: 12,
    borderRadius: 8,
  },
  thumbnail: {
    width: width * 0.22,
    height: (width * 0.22),
    borderRadius: 8,
  },
  videoTitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});

export default RecentVideos;
