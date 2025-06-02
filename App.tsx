import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { AppProvider } from './src/context/AppContext';
import MusicPlayer from './src/components/MusicPlayer';
import MainContent from './src/components/MainContent';
import { useAppContext } from './src/context/AppContext';

function AppContent(): React.JSX.Element {
  const {
    currentStreamInfo,
    currentAudioStream,
    loadingStream,
    setShowStreamInfo,
  } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <MainContent />
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
    backgroundColor: '#282828',
    paddingBottom: Platform.OS === 'android' ? 18 : 0,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
});

export default App;
