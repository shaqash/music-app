import React, { createContext, useContext, useState } from 'react';
import type { SearchResult, StreamInfo, AudioStream } from '../types/newpipe';

interface AppContextType {
  // Search state
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;

  // Player state
  currentStreamInfo: StreamInfo | null;
  setCurrentStreamInfo: (info: StreamInfo | null) => void;
  currentAudioStream: AudioStream | null;
  setCurrentAudioStream: (stream: AudioStream | null) => void;
  currentTrackUrl: string;
  setCurrentTrackUrl: (url: string) => void;
  loadingStream: boolean;
  setLoadingStream: (loading: boolean) => void;
  showStreamInfo: boolean;
  setShowStreamInfo: (show: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Player state
  const [currentStreamInfo, setCurrentStreamInfo] = useState<StreamInfo | null>(null);
  const [currentAudioStream, setCurrentAudioStream] = useState<AudioStream | null>(null);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string>('');
  const [loadingStream, setLoadingStream] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(false);

  const value = {
    query,
    setQuery,
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
    showSearch,
    setShowSearch,
    currentStreamInfo,
    setCurrentStreamInfo,
    currentAudioStream,
    setCurrentAudioStream,
    currentTrackUrl,
    setCurrentTrackUrl,
    loadingStream,
    setLoadingStream,
    showStreamInfo,
    setShowStreamInfo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
