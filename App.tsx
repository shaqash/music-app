/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
} from 'react-native';
import NewPipeService from './src/services/NewPipeService';
import MusicPlayer from './src/components/MusicPlayer';
import StreamInfoViewer from './src/components/StreamInfoViewer';
import type { SearchResult, StreamInfo, AudioStream } from './src/types/newpipe';

function App(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {showStreamInfo ? (
        <StreamInfoViewer
          initialUrl={currentTrackUrl}
          onClose={() => setShowStreamInfo(false)}
          onAudioStreamSelect={handleAudioStreamSelect}
        />
      ) : (
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
      )}

      <MusicPlayer
        streamInfo={currentStreamInfo}
        audioStream={currentAudioStream}
        isLoading={loadingStream}
        onStreamInfoPress={() => setShowStreamInfo(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  searchInput: {
    backgroundColor: '#282828',
    color: '#fff',
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#282828',
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  resultTextContainer: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff4444',
    padding: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default App;
