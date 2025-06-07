import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  NativeSyntheticEvent,
  NativeTouchEvent
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
  Event,
  State,
} from '@weights-ai/react-native-track-player';
import { PlayIcon, PauseIcon } from './PlayerIcons';
import { usePlayNextTrack } from '../hooks/usePlayNextTrack';

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
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const { playNextTrack } = usePlayNextTrack();
  const progressBarRef = useRef<View>(null);

  // Handle track player events
  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      console.error('Playback error:', event);
    }
  });

  useEffect(() => {
    if (!url) return;

    const setupTrack = async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          url,
          title,
          artist: subtitle,
        });
        await TrackPlayer.play();
      } catch (error) {
        console.error('Error setting up track:', error);
      }
    };

    setupTrack();
  }, [url, title, subtitle]);

  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleSeek = async (locationX: number, width: number) => {
    if (!progress.duration) return;

    const position = Math.max(0, Math.min(1, locationX / width));
    const seekTime = position * progress.duration;
    await TrackPlayer.seekTo(seekTime);
  };

  const handleProgressPress = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    if (progressBarRef.current) {
      progressBarRef.current.measure((_x: number, _y: number, width: number) => {
        handleSeek(e.nativeEvent.locationX, width);
      });
    }
  };

  if (!url) {
    return null;
  }

  const isPlaying = playbackState.state === State.Playing;
  const isLoading = playbackState.state === State.Connecting || playbackState.state === State.Buffering;

  return (
    <View style={styles.container}>
      {title && (
        <TouchableOpacity onPress={onTitlePress}>
          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.artist} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}

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
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <Pressable
            ref={progressBarRef}
            style={styles.progressBar}
            onPress={handleProgressPress}
          >
            <View style={styles.progressBackground} />
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(progress.position / (progress.duration || 1)) * 100}%`,
                },
              ]}
            />
          </Pressable>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
        </View>
      </View>
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