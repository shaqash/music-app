/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { StreamInfoViewer } from './src/components/StreamInfoViewer';
import { MusicVideoSearch } from './src/components/MusicVideoSearch';

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'search' | 'info'>('search');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

  const handleVideoSelect = (url: string) => {
    setSelectedVideoUrl(url);
    setActiveTab('info');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Music Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Video Info
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' ? (
        <MusicVideoSearch onVideoSelect={handleVideoSelect} />
      ) : (
        <StreamInfoViewer initialUrl={selectedVideoUrl} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default App;
