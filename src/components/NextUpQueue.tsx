import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import type { SearchResult } from '../types/newpipe';
import useRelatedTracks from '../hooks/useRelatedTracks';
import { useAppContext } from '../context/AppContext';
import NextUpTrack from './NextUpTrack';


export const NextUpQueue: React.FC = () => {
  const { currentTrackUrl } = useAppContext();
  const { relatedTracks } = useRelatedTracks(currentTrackUrl);

  if (relatedTracks.length === 0) {
    return (
      <View style={styles.emptyContainer} />
    );
  }

  return (
    <FlatList
      data={relatedTracks}
      renderItem={({ item }: { item: SearchResult }) => (
        <NextUpTrack
          track={item}
          isCurrentTrack={item.url === currentTrackUrl}
        />
      )}
      keyExtractor={(item) => item.url}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  collapseIcon: {
    color: '#fff',
    fontSize: 28,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default NextUpQueue;
