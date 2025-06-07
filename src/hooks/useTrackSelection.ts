import { useAppContext } from '../context/AppContext';
import NewPipeService from '../services/NewPipeService';
import { StorageService } from '../services/StorageService';
import TrackPlayer from '@weights-ai/react-native-track-player';
import type { SearchResult, AudioStream } from '../types/newpipe';

export const useTrackSelection = () => {
  const {
    setCurrentTrackUrl,
    setCurrentStreamInfo,
    setCurrentAudioStream,
    setLoadingStream,
    setError,
    currentStreamInfo,
  } = useAppContext();

  const handleTrackSelect = async (track: SearchResult) => {
    setLoadingStream(true);
    setCurrentTrackUrl(track.url);
    try {
      // Save to recent videos
      await StorageService.addRecentVideo(track);

      const info = await NewPipeService.getStreamInfo(track.url);
      setCurrentStreamInfo(info);

      // Automatically select highest quality audio stream
      if (info.audioStreams && info.audioStreams.length > 0) {
        const bestAudio = info.audioStreams.reduce((prev, current) =>
          prev.averageBitrate > current.averageBitrate ? prev : current
        );
        setCurrentAudioStream(bestAudio);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load track');
    } finally {
      setLoadingStream(false);
    }
  };

  const handleAudioStreamSelect = async (stream: AudioStream) => {
    setCurrentAudioStream(stream);
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        url: stream.url,
        title: currentStreamInfo?.title || 'Unknown Title',
        artist: currentStreamInfo?.uploaderName || 'Unknown Artist',
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error setting up track:', error);
      setError('Failed to play audio stream');
    }
  };

  return { handleTrackSelect, handleAudioStreamSelect };
};
