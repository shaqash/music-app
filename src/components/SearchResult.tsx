import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SearchResult as SearchResultType } from '../types/newpipe';

const { width } = Dimensions.get('window');

interface SearchResultProps {
  item: SearchResultType;
  onSelect: (track: SearchResultType) => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({ item, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onSelect(item)}
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
};

const styles = StyleSheet.create({
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
});

export default SearchResult;
