import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { AppProvider } from './src/context/AppContext';
import MusicPlayer from './src/components/MusicPlayer';
import MainContent from './src/components/MainContent';
import { useAppContext } from './src/context/AppContext';
import { useTrackPlayerSetup } from './src/hooks/useTrackPlayer';

const { height } = Dimensions.get('window');

function AppContent(): React.JSX.Element {
  const {
    currentStreamInfo,
    currentAudioStream,
    loadingStream,
    setShowStreamInfo,
    showStreamInfo,
  } = useAppContext();

  useTrackPlayerSetup();

  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showStreamInfo ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showStreamInfo, slideAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <MainContent />
      <View style={styles.playerContainer}>
        {showStreamInfo && (
          <View
            style={styles.queueContainer}
          >
            {/* <NextUpQueue /> */}
          </View>
        )}
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

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  playerContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingBottom: Platform.OS === 'android' ? 18 : 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  queueContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '112%',
    maxHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default App;
