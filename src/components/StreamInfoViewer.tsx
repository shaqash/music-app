import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { useStreamInfo } from '../hooks/useStreamInfo';
import { accentColor } from '../theme/colors';
import type { AudioStream } from '../types/newpipe';
import { BackIcon } from './PlayerIcons';
import { Drawer } from './Drawer';
import { AudioStreamSelector } from './AudioStreamSelector';
import NextUpQueue from './NextUpQueue';
import { Description } from './Description';

const { height } = Dimensions.get('window');

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
      <ImageBackground
        source={{ uri: streamInfo?.thumbnailUrl }}
        style={styles.thumbnail}
        imageStyle={styles.thumbnailImg}
        blurRadius={1}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <BackIcon size={32} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discover</Text>
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
                <Text style={styles.title} numberOfLines={2}>{streamInfo.title}</Text>
                <Text style={styles.uploader}>By {streamInfo.uploaderName}</Text>
                <Text style={styles.views}>{streamInfo.viewCount.toLocaleString()} views</Text>
              </View>

              <View style={styles.settingsContainer}>
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                  <Text style={styles.title}>⚙</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsDescriptionOpen(!isDescriptionOpen)}>
                  <Text style={styles.title}>☰</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsNextUpOpen(!isNextUpOpen)}>
                  <Text style={styles.title}>Up Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

        </View>


        {streamInfo && (
          <>
            <Drawer isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} title="Quality Settings">
              <AudioStreamSelector
                streamInfo={streamInfo}
                handleStreamSelect={handleStreamSelect}
                selectedAudioStream={selectedAudioStream}
              />
            </Drawer>
            <Drawer title="Description" isOpen={isDescriptionOpen} toggle={() => setIsDescriptionOpen(!isDescriptionOpen)}>
              <Description description={streamInfo.description} />
            </Drawer>
            <Drawer title="Up Next" isOpen={isNextUpOpen} toggle={() => setIsNextUpOpen(!isNextUpOpen)}>
              <NextUpQueue />
            </Drawer>
          </>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10, 10, 10)',
  },
  header: {
    backgroundColor: 'rgba(18, 18, 18, 1)',
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
    textAlign: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 18,
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
    textAlign: 'center',
    color: '#fff',
    marginBottom: 8,
  },
  uploader: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 4,
  },
  views: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
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
    flex: 1,
    alignSelf: 'stretch',
    width: null,
  },
  thumbnailImg: {
    opacity: 0.2,
  },
});

export default StreamInfoViewer;
