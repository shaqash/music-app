import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTrackSelection } from '../hooks/useTrackSelection';
import RecentVideos from './RecentVideos';
import { Search } from './Search';
import StreamInfoViewer from './StreamInfoViewer';

export const MainContent: React.FC = () => {
  const {
    showSearch,
    setShowSearch,
    showStreamInfo,
    setShowStreamInfo,
    currentTrackUrl,
  } = useAppContext();
  const { handleTrackSelect, handleAudioStreamSelect } = useTrackSelection();

  if (showStreamInfo) {
    return (
      <StreamInfoViewer
        initialUrl={currentTrackUrl}
        onClose={() => setShowStreamInfo(false)}
        onAudioStreamSelect={handleAudioStreamSelect}
      />
    );
  }

  if (showSearch) {
    return <Search />;
  }

  return (
    <View style={styles.homeView}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowSearch(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.searchButtonText}>Search for music...</Text>
      </TouchableOpacity>
      <RecentVideos onVideoSelect={handleTrackSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  homeView: {
    flex: 1,
  },
  searchButton: {
    margin: 12,
    padding: 12,
    backgroundColor: '#282828',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    padding: 18,
    textAlign: 'center',
    fontSize: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: 12,
  },
});

export default MainContent;
