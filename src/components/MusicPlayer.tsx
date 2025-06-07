import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AudioPlayer from './AudioPlayer';
import type { StreamInfo, AudioStream } from '../types/newpipe';

interface MusicPlayerProps {
  streamInfo: StreamInfo | null;
  audioStream: AudioStream | null;
  isLoading: boolean;
  onStreamInfoPress?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  streamInfo,
  audioStream,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#1DB954" />
      </View>
    );
  }

  if (!streamInfo || !audioStream) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTrackText}>No track selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AudioPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#121212',
  },
  trackInfo: {
    marginBottom: 8,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  noTrackText: {
    color: '#b3b3b3',
    textAlign: 'center',
  },
});

export default MusicPlayer;
