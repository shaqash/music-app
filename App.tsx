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
  Dimensions,
} from 'react-native';
import NewPipeService from './src/services/NewPipeService';
import { StorageService } from './src/services/StorageService';
import MusicPlayer from './src/components/MusicPlayer';
import StreamInfoViewer from './src/components/StreamInfoViewer';
import RecentVideos from './src/components/RecentVideos';
import type { SearchResult, StreamInfo, AudioStream } from './src/types/newpipe';

const { width } = Dimensions.get('window');

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
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        {item.thumbnailUrl && (
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
          />
        )}
        <View style={styles.playIconOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle} numberOfLines={2}>
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
        <View style={styles.searchView}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              placeholder="Search for music..."
              placeholderTextColor="#666"
              returnKeyType="search"
              autoFocus
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
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      );
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
  homeView: {
    flex: 1,
    paddingTop: 12,
  },
  searchView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
    backgroundColor: '#181818',
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#282828',
    borderRadius: 24,
    paddingHorizontal: 18,
    color: '#fff',
    fontSize: 16,
    marginRight: 12,
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
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    margin: 18,
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
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#282828',
    borderRadius: 12,
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
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: width * 0.35,
    height: (width * 0.35 * 9) / 16,
    borderRadius: 12,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  playIcon: {
    color: '#fff',
    fontSize: 24,
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
    lineHeight: 24,
  },
  playerContainer: {
    backgroundColor: '#282828',
    paddingBottom: Platform.OS === 'android' ? 12 : 0,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
});

export default App;
