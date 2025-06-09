import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { accentColor } from '../theme/colors';
import { AudioStream, StreamInfo } from '../types/newpipe';

const { height } = Dimensions.get('window');

export const AudioStreamSelector = ({ streamInfo, selectedAudioStream, handleStreamSelect }: { streamInfo: StreamInfo, selectedAudioStream: AudioStream | null, handleStreamSelect: (stream: AudioStream) => void }) => {

  return streamInfo.audioStreams.map((stream, index) => (
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
  )
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
});
