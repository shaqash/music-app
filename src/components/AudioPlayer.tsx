import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  LayoutRectangle,
  Animated,
} from 'react-native';
import Sound from 'react-native-sound';
import { PlayIcon, PauseIcon } from './PlayerIcons';

Sound.setCategory('Playback', true);

interface AudioPlayerProps {
  url?: string;
  title?: string;
  subtitle?: string;
  onTitlePress?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, subtitle, onTitlePress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<number | null>(null);

  const startTimeUpdate = useCallback((soundObj: Sound) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isSeeking) {
        soundObj.getCurrentTime((seconds: number) => {
          setCurrentTime(seconds);
          const progress = seconds / soundObj.getDuration();
          Animated.timing(progressAnim, {
            toValue: progress,
            duration: 250,
            useNativeDriver: false,
          }).start();
        });
      }
    }, 250) as unknown as number;
  }, [progressAnim, isSeeking]);

  const stopTimeUpdate = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTimeUpdate();
      if (sound) {
        sound.release();
      }
    };
  }, [sound, stopTimeUpdate]);

  useEffect(() => {
    if (url) {
      if (sound) {
        stopTimeUpdate();
        sound.release();
      }

      setIsLoading(true);
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      progressAnim.setValue(0);

      try {
        const newSound = new Sound(url, undefined, (error: Error | null) => {
          setIsLoading(false);
          if (error) {
            console.error('Failed to load sound:', error);
            setError('Failed to load sound');
            return;
          }
          setSound(newSound);
          setIsPlaying(true);
          setDuration(newSound.getDuration());

          // Wait a brief moment for the sound to be fully ready
          setTimeout(() => {
            startTimeUpdate(newSound);
            
            // Auto-play when loaded
            newSound.play((success: boolean) => {
              if (!success) {
                console.error('Playback failed');
                setError('Playback failed');
                setIsPlaying(false);
                stopTimeUpdate();
              } else {
                setIsPlaying(true);
              }
            });
          }, 100);
        });
      } catch (err) {
        console.error('Error creating Sound instance:', err);
        setError('Failed to initialize audio player');
        setIsLoading(false);
      }
    }
  }, [url, startTimeUpdate, stopTimeUpdate, progressAnim]);

  const togglePlayback = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause(() => {
        setIsPlaying(false);
        stopTimeUpdate();
      });
    } else {
      setIsPlaying(true);
      sound.play((success: boolean) => {
        if (!success) {
          console.error('Playback failed');
          setError('Playback failed');
          setIsPlaying(false);
        }
      });
      startTimeUpdate(sound);
    }
  };

  const handleSeek = (locationX: number) => {
    if (!sound || isLoading || progressBarWidth === 0) return;

    setIsSeeking(true);
    const position = Math.max(0, Math.min(1, locationX / progressBarWidth));
    const seekTime = position * duration;

    // Update UI immediately
    setCurrentTime(seekTime);
    progressAnim.setValue(position);

    // Perform the seek
    sound.setCurrentTime(seekTime);
    setIsSeeking(false);
    if (isPlaying) {
      startTimeUpdate(sound);
    }
  };

  const handleProgressBarLayout = (event: { nativeEvent: { layout: LayoutRectangle } }) => {
    setProgressBarWidth(event.nativeEvent.layout.width);
  };

  if (!url) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && (
        <TouchableOpacity onPress={onTitlePress}>
          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />
            )}
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Pressable
              style={styles.progressBar}
              onLayout={handleProgressBarLayout}
              onPress={(e) => handleSeek(e.nativeEvent.locationX)}
            >
              <View style={styles.progressBackground} />
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </Pressable>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 12,
    minWidth: 36,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#404040',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#404040',
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1DB954',
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
    color: '#fff',
  },
  trackInfo: {
    marginBottom: 12,
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
});

export default AudioPlayer; 