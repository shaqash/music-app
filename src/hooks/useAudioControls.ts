import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from '@weights-ai/react-native-track-player';
import { useEffect, useMemo, useRef } from 'react';
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  View,
  DeviceEventEmitter,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { usePlayNextTrack } from './usePlayNextTrack';
import { PLAYBACK_NEXT, PLAYBACK_PREVIOUS } from '../services/TrackPlayerService';

export const useAudioControls = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const progressBarRef = useRef<View>(null);
  const {
    currentAudioStream,
    currentStreamInfo,
    setShowStreamInfo,
  } = useAppContext();
  const { playNextTrack } = usePlayNextTrack();

  // Handle track player events
  useTrackPlayerEvents([Event.PlaybackError, Event.PlaybackQueueEnded], (event) => {
    if (event.type === Event.PlaybackError) {
      console.error('Playback error:', event);
    } else if (event.type === Event.PlaybackQueueEnded) {
      // Auto-play next track when current track ends
      playNextTrack();
    }
  });

  // Handle remote control events
  useEffect(() => {
    const nextSubscription = DeviceEventEmitter.addListener(PLAYBACK_NEXT, () => {
      playNextTrack();
    });

    const previousSubscription = DeviceEventEmitter.addListener(PLAYBACK_PREVIOUS, () => {
      // TODO: Implement previous track functionality
      console.log('Previous track not implemented yet');
    });

    return () => {
      nextSubscription.remove();
      previousSubscription.remove();
    };
  }, [playNextTrack]);

  useEffect(() => {
    if (!currentAudioStream?.url) { return; }

    const setupTrack = async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          url: currentAudioStream.url,
          title: currentStreamInfo?.title,
          artist: currentStreamInfo?.uploaderName,
        });
        await TrackPlayer.play();
      } catch (error) {
        console.error('Error setting up track:', error);
      }
    };

    setupTrack();
  }, [currentAudioStream?.url, currentStreamInfo]);

  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleSeek = async (locationX: number, width: number) => {
    if (!progress.duration) { return; }

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

  const isPlaying = useMemo(() => playbackState.state === State.Playing, [playbackState]);
  const isLoading = useMemo(() => playbackState.state === State.Loading || playbackState.state === State.Buffering, [playbackState]);

  return {
    isLoading,
    isPlaying,
    togglePlayback,
    handleSeek,
    handleProgressPress,
    progressBarRef,
    progress,
    playbackState,
    currentAudioStream,
    currentStreamInfo,
    setShowStreamInfo,
  };
};
