import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useSearch } from '../hooks/useSearch';
import { useTrackSelection } from '../hooks/useTrackSelection';
import { accentColor } from '../theme/colors';
import type { SearchResult as SearchResultType } from '../types/newpipe';
import SearchResult from './SearchResult';

export const Search = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    setShowSearch,
  } = useAppContext();
  const { handleSearch } = useSearch();
  const { handleTrackSelect } = useTrackSelection();


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
        <ActivityIndicator size="large" color={accentColor} style={styles.loader} />
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
};


const styles = StyleSheet.create({
  homeView: {
    flex: 1,
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
    color: accentColor,
    fontSize: 16,
    fontWeight: '600',
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
