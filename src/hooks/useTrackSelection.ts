import { useAppContext } from '../context/AppContext';
import NewPipeService from '../services/NewPipeService';
import { StorageService } from '../services/StorageService';
import type { SearchResult, AudioStream } from '../types/newpipe';

export const useTrackSelection = () => {
  const {
    setCurrentTrackUrl,
    setCurrentStreamInfo,
    setCurrentAudioStream,
    setLoadingStream,
    setError,
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

  const handleAudioStreamSelect = (stream: AudioStream) => {
    setCurrentAudioStream(stream);
  };

  return { handleTrackSelect, handleAudioStreamSelect };
}; 