import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import type { SearchResult } from '../types/newpipe';
import { useTrackSelection } from '../hooks/useTrackSelection';
import { accentColor } from '../theme/colors';

const { width } = Dimensions.get('window');

interface NextUpTrackProps {
    track: SearchResult;
    isCurrentTrack: boolean;
}

export const NextUpTrack: React.FC<NextUpTrackProps> = ({
  track,
  isCurrentTrack,
}) => {
  const { handleTrackSelect } = useTrackSelection();

  return (
    <TouchableOpacity
      style={[styles.trackItem, isCurrentTrack && styles.currentTrack]}
      onPress={() => handleTrackSelect(track)}
      activeOpacity={0.7}
      disabled={isCurrentTrack}
    >
      <View style={styles.thumbnailContainer}>
        {track.thumbnailUrl && (
          <Image
            source={{ uri: track.thumbnailUrl }}
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
          {track.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trackItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#404040',
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
    borderColor: accentColor,
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
    backgroundColor: accentColor,
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
    color: accentColor,
  },
});

export default NextUpTrack;
