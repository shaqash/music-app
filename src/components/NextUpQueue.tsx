import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import type { SearchResult } from '../types/newpipe';

const { width } = Dimensions.get('window');

interface NextUpQueueProps {
  nextTracks: SearchResult[];
  onTrackSelect: (track: SearchResult) => void;
  currentTrackUrl?: string;
}

export const NextUpQueue: React.FC<NextUpQueueProps> = ({
  nextTracks,
  onTrackSelect,
  currentTrackUrl,
}) => {
  const renderTrack = ({ item }: { item: SearchResult }) => {
    const isCurrentTrack = item.url === currentTrackUrl;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrentTrack && styles.currentTrack]}
        onPress={() => onTrackSelect(item)}
        activeOpacity={0.7}
        disabled={isCurrentTrack}
      >
        <View style={styles.thumbnailContainer}>
          {item.thumbnailUrl && (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnail}
            />
          )}
          {isCurrentTrack && (
            <View style={styles.playingIndicator}>
              <Text style={styles.playingText}>Now Playing</Text>
            </View>
          )}
        </View>
        <View style={styles.trackInfo}>
          <Text 
            style={[styles.trackTitle, isCurrentTrack && styles.currentTrackTitle]} 
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (nextTracks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No upcoming tracks</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next Up</Text>
      <FlatList
        data={nextTracks}
        renderItem={renderTrack}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    padding: 18,
  },
  listContent: {
    padding: 12,
  },
  trackItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#282828',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  currentTrack: {
    backgroundColor: '#383838',
    borderColor: '#1DB954',
    borderWidth: 1,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: width * 0.25,
    height: (width * 0.25 * 9) / 16,
    borderRadius: 12,
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1DB954',
    paddingVertical: 6,
    alignItems: 'center',
  },
  playingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    lineHeight: 18,
  },
  currentTrackTitle: {
    color: '#1DB954',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default NextUpQueue; 