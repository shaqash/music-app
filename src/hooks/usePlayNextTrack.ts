import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import useRelatedTracks from "./useRelatedTracks";
import { useTrackSelection } from "./useTrackSelection";

export const usePlayNextTrack = () => {
    const { currentTrackUrl } = useAppContext();
    const { relatedTracks } = useRelatedTracks(currentTrackUrl);
    const { handleTrackSelect } = useTrackSelection();

    console.log('relatedTracks1', relatedTracks);

    const playNextTrack = useCallback(() => {
        console.log('relatedTracks2', relatedTracks);
        if (relatedTracks.length > 0) {
            handleTrackSelect(relatedTracks[0]);
        }
    }, [relatedTracks]);

    return { playNextTrack };
}