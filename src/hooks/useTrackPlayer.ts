import { useEffect } from 'react';
import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from '@weights-ai/react-native-track-player';

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.Stop,
        Capability.Skip,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      progressUpdateEventInterval: 1,
    });

    return true;
  } catch (error) {
    console.error('Failed to setup player:', error);
    return false;
  }
};

export const useTrackPlayerSetup = () => {
  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        if (mounted) {
          await setupPlayer();
        }
      } catch (error) {
        console.error('Error setting up track player:', error);
      }
    };

    setup();

    return () => {
      mounted = false;
      TrackPlayer.reset();
    };
  }, []);
};
