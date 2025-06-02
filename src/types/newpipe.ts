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

declare module 'react-native' {
    interface NativeModulesStatic {
        NewPipeModule: {
            getStreamInfo(url: string): Promise<StreamInfo>;
            getVideoId(url: string): Promise<string>;
        };
    }
} 