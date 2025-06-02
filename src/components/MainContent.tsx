import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useSearch } from '../hooks/useSearch';
import { useTrackSelection } from '../hooks/useTrackSelection';
import StreamInfoViewer from './StreamInfoViewer';
import SearchResult from './SearchResult';
import RecentVideos from './RecentVideos';
import type { SearchResult as SearchResultType } from '../types/newpipe';

export const MainContent: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    showSearch,
    setShowSearch,
    showStreamInfo,
    setShowStreamInfo,
    currentTrackUrl,
  } = useAppContext();

  const { handleSearch } = useSearch();
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
            renderItem={({ item }: { item: SearchResultType }) => (
              <SearchResult item={item} onSelect={handleTrackSelect} />
            )}
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

const styles = StyleSheet.create({
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
});

export default MainContent; 