import { useState, useEffect } from 'react';
import type { SearchResult } from '../types/newpipe';
import NewPipeService from '../services/NewPipeService';

export const useRelatedTracks = (currentTrackUrl?: string) => {
  const [relatedTracks, setRelatedTracks] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRelatedTracks = async () => {
      if (currentTrackUrl) {
        setIsLoading(true);
        setError(null);
        try {
          const tracks = await NewPipeService.getRelatedVideos(currentTrackUrl);
          setRelatedTracks(tracks);
        } catch (err) {
          console.error('Failed to fetch related tracks:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch related tracks'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRelatedTracks();
  }, [currentTrackUrl]);

  return { relatedTracks, isLoading, error };
};

export default useRelatedTracks;
