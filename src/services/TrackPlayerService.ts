import TrackPlayer, { Event } from '@weights-ai/react-native-track-player';
import { DeviceEventEmitter } from 'react-native';

export const PLAYBACK_NEXT = 'playback_next';
export const PLAYBACK_PREVIOUS = 'playback_previous';

export const PlaybackService = async function() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    DeviceEventEmitter.emit(PLAYBACK_NEXT);
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    DeviceEventEmitter.emit(PLAYBACK_PREVIOUS);
  });
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.reset();
  });
};
