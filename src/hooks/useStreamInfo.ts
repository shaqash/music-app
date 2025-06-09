import { useEffect } from 'react';
import { useState } from 'react';
import { AudioStream, StreamInfo } from '../types/newpipe';
import NewPipeService from '../services/NewPipeService';

interface UseStreamInfoViewerProps {
  initialUrl?: string;
  onClose?: () => void;
  onAudioStreamSelect?: (stream: AudioStream) => void;
}

/**
 * TODO: Convert to react-query for caching
 */
export const useStreamInfo = ({ initialUrl, onAudioStreamSelect }: UseStreamInfoViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [selectedAudioStream, setSelectedAudioStream] = useState<AudioStream | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      fetchStreamInfo(initialUrl);
    }
  }, [initialUrl]);

  const fetchStreamInfo = async (videoUrl: string) => {
    if (!videoUrl) {
      setError('Please enter a URL');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const info = await NewPipeService.getStreamInfo(videoUrl);
      setStreamInfo(info);

      // Automatically select highest quality audio stream
      if (info.audioStreams && info.audioStreams.length > 0) {
        const bestAudio = info.audioStreams.reduce((prev: AudioStream, current: AudioStream) =>
          prev.averageBitrate > current.averageBitrate ? prev : current
        );
        setSelectedAudioStream(bestAudio);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stream info');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamSelect = (stream: AudioStream) => {
    setSelectedAudioStream(stream);
    if (onAudioStreamSelect) {
      onAudioStreamSelect(stream);
    }
  };

  return {
    handleStreamSelect,
    error,
    streamInfo,
    selectedAudioStream,
    loading,
  };
};
