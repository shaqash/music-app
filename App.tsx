import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import NewPipeService from './src/services/NewPipeService';
import { StorageService } from './src/services/StorageService';
import MusicPlayer from './src/components/MusicPlayer';
import StreamInfoViewer from './src/components/StreamInfoViewer';
import RecentVideos from './src/components/RecentVideos';
import type { SearchResult, StreamInfo, AudioStream } from './src/types/newpipe';

function App(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Player state
  const [currentStreamInfo, setCurrentStreamInfo] = useState<StreamInfo | null>(null);
  const [currentAudioStream, setCurrentAudioStream] = useState<AudioStream | null>(null);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string>('');
  const [loadingStream, setLoadingStream] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const searchResults = await NewPipeService.searchYoutube(`${query.trim()} music`);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

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

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleTrackSelect(item)}
    >
      {item.thumbnailUrl && (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.thumbnail}
        />
      )}
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMainContent = () => {
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
      return (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              placeholder="Search for music..."
              placeholderTextColor="#b3b3b3"
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSearch(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" style={styles.loader} />
          ) : (
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.url}
              style={styles.resultsList}
              contentContainerStyle={styles.resultsContent}
            />
          )}
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setShowSearch(true)}
        >
          <Text style={styles.searchButtonText}>Search for music...</Text>
        </TouchableOpacity>
        <RecentVideos onVideoSelect={handleTrackSelect} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} >
      {renderMainContent()}
      <View style={styles.playerContainer}>
        <MusicPlayer
          streamInfo={currentStreamInfo}
          audioStream={currentAudioStream}
          isLoading={loadingStream}
          onStreamInfoPress={() => setShowStreamInfo(true)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  playerContainer: {
    backgroundColor: '#282828',
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#282828',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    marginRight: 8,
  },
  cancelButton: {
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: '#1DB954',
    fontSize: 16,
  },
  searchButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#282828',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: 8,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#282828',
    borderRadius: 8,
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 4,
  },
  resultTextContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default App;
