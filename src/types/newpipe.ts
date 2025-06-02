export interface VideoStream {
    url: string;
    resolution: string;
    format: string;
}

export interface AudioStream {
    url: string;
    averageBitrate: number;
    format: string;
}

export interface StreamInfo {
    title: string;
    uploaderName: string;
    description: string;
    viewCount: number;
    videoStreams: VideoStream[];
    audioStreams: AudioStream[];
}

export interface SearchResult {
    title: string;
    url: string;
    thumbnailUrl?: string;
}

declare module 'react-native' {
    interface NativeModulesStatic {
        NewPipeModule: {
            getStreamInfo(url: string): Promise<StreamInfo>;
            getVideoId(url: string): Promise<string>;
            searchYoutube(query: string): Promise<SearchResult[]>;
            getRelatedVideos(url: string): Promise<SearchResult[]>;
        };
    }
} 