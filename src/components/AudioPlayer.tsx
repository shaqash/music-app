import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAudioControls } from '../hooks/useAudioControls';
import { PauseIcon, PlayIcon } from './PlayerIcons';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC = () => {
  const {
    currentStreamInfo,
    setShowStreamInfo,
    togglePlayback,
    handleProgressPress,
    progressBarRef,
    progress,
    isLoading,
    isPlaying,
  } = useAudioControls();

  return (
    <View style={styles.container}>
      {currentStreamInfo?.title && (
        <TouchableOpacity onPress={() => setShowStreamInfo(true)}>
          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {currentStreamInfo.title}
            </Text>
            {currentStreamInfo.uploaderName && (
              <Text style={styles.artist} numberOfLines={1}>
                {currentStreamInfo.uploaderName}
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
            isPlaying ? <PauseIcon size={42} /> : <PlayIcon size={42} />
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
    height: 8,
    backgroundColor: '#404040',
    borderRadius: 12,
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
