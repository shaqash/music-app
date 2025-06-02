import { NativeModules } from 'react-native';
import type { StreamInfo } from '../types/newpipe';

const { NewPipeModule } = NativeModules;

export class NewPipeService {
    /**
     * Get detailed information about a video stream
     * @param url The URL of the video
     * @returns Promise<StreamInfo>
     */
    static async getStreamInfo(url: string): Promise<StreamInfo> {
        return await NewPipeModule.getStreamInfo(url);
    }

    /**
     * Extract the video ID from a URL
     * @param url The URL of the video
     * @returns Promise<string>
     */
    static async getVideoId(url: string): Promise<string> {
        return await NewPipeModule.getVideoId(url);
    }
}

export default NewPipeService; 