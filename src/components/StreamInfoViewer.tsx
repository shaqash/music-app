import React, { useState, useEffect } from 'react';
import {
  View,
  Text, TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import NewPipeService from '../services/NewPipeService';
import type { StreamInfo, AudioStream } from '../types/newpipe';
import { BackIcon } from './PlayerIcons';
import { RenderHTML } from 'react-native-render-html';

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
  const [error, setError] = useState<string | null>(null);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [selectedAudioStream, setSelectedAudioStream] = useState<AudioStream | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      fetchStreamInfo(initialUrl);
    }
  }, [initialUrl]);

  const fetchStreamInfo = async (videoUrl: string) => {
    if (!videoUrl) {
      setError('Please enter a URL');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const info = await NewPipeService.getStreamInfo(videoUrl);
      setStreamInfo(info);

      // Automatically select highest quality audio stream
      if (info.audioStreams && info.audioStreams.length > 0) {
        const bestAudio = info.audioStreams.reduce((prev: AudioStream, current: AudioStream) =>
          prev.averageBitrate > current.averageBitrate ? prev : current
        );
        setSelectedAudioStream(bestAudio);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stream info');
    } finally {
      setLoading(false);
    }
  };

  const handleStreamSelect = (stream: AudioStream) => {
    setSelectedAudioStream(stream);
    if (onAudioStreamSelect) {
      onAudioStreamSelect(stream);
    }
  };

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        ) : streamInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{streamInfo.title}</Text>
            <Text style={styles.uploader}>By {streamInfo.uploaderName}</Text>
            <Text style={styles.views}>{streamInfo.viewCount.toLocaleString()} views</Text>

            <Text style={styles.sectionTitle}>Available Audio Streams</Text>
            {streamInfo.audioStreams.map((stream, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.streamItem,
                  selectedAudioStream?.url === stream.url && styles.selectedStream,
                ]}
                onPress={() => handleStreamSelect(stream)}
              >
                <Text style={styles.streamText}>
                  {stream.format} - {stream.averageBitrate}kbps
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              <RenderHTML source={{ html: streamInfo.description }} tagsStyles={{ body: { color: '#fff' } }} />
            </Text>
          </View>
        ) : null}
      </ScrollView>
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
    backgroundColor: '#1DB954',
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
    backgroundColor: '#1DB954',
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
});

export default StreamInfoViewer;
