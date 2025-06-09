import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import useRelatedTracks from './useRelatedTracks';
import { useTrackSelection } from './useTrackSelection';

export const usePlayNextTrack = () => {
  const { currentTrackUrl } = useAppContext();
  const { relatedTracks } = useRelatedTracks(currentTrackUrl);
  const { handleTrackSelect } = useTrackSelection();

  const playNextTrack = useCallback(() => {
    if (relatedTracks.length > 0) {
      handleTrackSelect(relatedTracks[0]);
    }
  }, [handleTrackSelect, relatedTracks]);

  return { playNextTrack };
};
