import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import { useStreamInfo } from '../hooks/useStreamInfo';
import { accentColor } from '../theme/colors';
import type { AudioStream } from '../types/newpipe';
import { BackIcon } from './PlayerIcons';
import { Drawer } from './Drawer';
import { AudioStreamSelector } from './AudioStreamSelector';
import NextUpQueue from './NextUpQueue';

const { height, width } = Dimensions.get('window');

interface StreamInfoViewerProps {
    initialUrl?: string;
    onClose?: () => void;
    onAudioStreamSelect?: (stream: AudioStream) => void;
}

export const StreamInfoViewer: React.FC<StreamInfoViewerProps> = ({
  initialUrl = '',
  onClose,
  onAudioStreamSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isNextUpOpen, setIsNextUpOpen] = useState(false);
  const {error, streamInfo, loading, selectedAudioStream, handleStreamSelect} = useStreamInfo({
    initialUrl,
    onAudioStreamSelect,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <BackIcon size={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stream Info</Text>
      </View>

      <View
        style={styles.scrollView}
      >
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={accentColor} />
          </View>
        ) : streamInfo ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Image src={streamInfo.thumbnailUrl} source={{ uri: streamInfo.thumbnailUrl }} style={styles.thumbnail} />
              <Text style={styles.title}>{streamInfo.title}</Text>
              <Text style={styles.uploader}>By {streamInfo.uploaderName}</Text>
              <Text style={styles.views}>{streamInfo.viewCount.toLocaleString()} views</Text>
            </View>

            <View style={styles.settingsContainer}>
              <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.title}>⚙</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDescriptionOpen(!isDescriptionOpen)}>
                <Text style={styles.title}>Lyrics</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsNextUpOpen(!isNextUpOpen)}>
                <Text style={styles.title}>Next Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>


      {streamInfo && (
        <>
          <Drawer isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} title="Settings">
            <AudioStreamSelector
              streamInfo={streamInfo}
              handleStreamSelect={handleStreamSelect}
              selectedAudioStream={selectedAudioStream}
            />
          </Drawer>
          <Drawer title="Description" isOpen={isDescriptionOpen} toggle={() => setIsDescriptionOpen(!isDescriptionOpen)}>
            <RenderHTML source={{ html: streamInfo.description }} tagsStyles={{ body: { color: '#fff', fontSize: 14 } }} />
          </Drawer>
          <Drawer title="Next Up" isOpen={isNextUpOpen} toggle={() => setIsNextUpOpen(!isNextUpOpen)}>
            <NextUpQueue />
          </Drawer>
        </>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  scrollView: {
    flex: 1,
  },
  infoHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 12,
  },
  scrollViewContent: {
    paddingBottom: height * 0.15, // Add padding at the bottom to account for the NextUp component
  },
  closeButton: {
    paddingVertical: 6,
    marginRight: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    color: '#fff',
    backgroundColor: '#282828',
  },
  button: {
    backgroundColor: accentColor,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#ff4444',
    padding: 16,
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  uploader: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  views: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b3b3b3',
  },
  streamItem: {
    backgroundColor: '#282828',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedStream: {
    backgroundColor: accentColor,
  },
  streamText: {
    fontSize: 14,
    color: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.7,
  },
  thumbnail: {
    alignSelf: 'center',
    height: width * 0.6,
    width: width * 0.6,
    marginBottom: 16,
    elevation: 10,
  },
});

export default StreamInfoViewer;
