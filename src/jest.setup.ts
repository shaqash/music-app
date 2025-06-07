import { NativeModules } from 'react-native';

// Mock the NewPipeModule
NativeModules.NewPipeModule = {
  getStreamInfo: jest.fn(),
  getVideoId: jest.fn(),
  searchYoutube: jest.fn(),
  getRelatedVideos: jest.fn(),
};
