import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silence mode (iOS) and ignore errors
Sound.setCategory('Playback', true);

interface AudioPlayerProps {
  url?: string;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.release();
      }
    };
  }, []);

  useEffect(() => {
    if (url) {
      // Release previous sound if exists
      if (sound) {
        sound.release();
      }
      
      setIsLoading(true);
      setError(null);

      try {
        // Initialize new sound with basePath parameter
        const newSound = new Sound(url, undefined, (error: Error | null) => {
          setIsLoading(false);
          if (error) {
            console.error('Failed to load sound:', error);
            setError('Failed to load sound');
            return;
          }
          setSound(newSound);
        });
      } catch (err) {
        console.error('Error creating Sound instance:', err);
        setError('Failed to initialize audio player');
        setIsLoading(false);
      }
    }
  }, [url]);

  const togglePlayback = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
      sound.play((success: boolean) => {
        if (!success) {
          console.error('Playback failed');
          setError('Playback failed');
        }
        setIsPlaying(false);
      });
    }
  };

  if (!url) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {title || 'Audio Track'}
      </Text>
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayback}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default AudioPlayer; 