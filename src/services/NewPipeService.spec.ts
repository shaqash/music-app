import { NativeModules } from 'react-native';
import NewPipeService from './NewPipeService';
import type { StreamInfo } from '../types/newpipe';

describe('NewPipeService', () => {
    const mockStreamInfo: StreamInfo = {
        title: 'Test Video',
        uploaderName: 'Test Channel',
        description: 'Test Description',
        viewCount: 1000,
        videoStreams: [
            {
                url: 'https://example.com/video.mp4',
                resolution: '720p',
                format: 'MP4'
            }
        ]
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Set up mock implementations
        (NativeModules.NewPipeModule.getStreamInfo as jest.Mock).mockResolvedValue(mockStreamInfo);
        (NativeModules.NewPipeModule.getVideoId as jest.Mock).mockResolvedValue('test-video-id');
    });

    describe('getStreamInfo', () => {
        it('should return stream info for a valid URL', async () => {
            const url = 'https://youtube.com/watch?v=test123';
            const result = await NewPipeService.getStreamInfo(url);

            expect(result).toEqual(mockStreamInfo);
            expect(NativeModules.NewPipeModule.getStreamInfo).toHaveBeenCalledWith(url);
            expect(NativeModules.NewPipeModule.getStreamInfo).toHaveBeenCalledTimes(1);
        });

        it('should throw an error when native module fails', async () => {
            const error = new Error('Failed to extract video info');
            (NativeModules.NewPipeModule.getStreamInfo as jest.Mock).mockRejectedValueOnce(error);

            const url = 'https://youtube.com/watch?v=test123';
            await expect(NewPipeService.getStreamInfo(url)).rejects.toThrow('Failed to extract video info');
        });
    });

    describe('getVideoId', () => {
        it('should return video ID for a valid URL', async () => {
            const url = 'https://youtube.com/watch?v=test123';
            const result = await NewPipeService.getVideoId(url);

            expect(result).toBe('test-video-id');
            expect(NativeModules.NewPipeModule.getVideoId).toHaveBeenCalledWith(url);
            expect(NativeModules.NewPipeModule.getVideoId).toHaveBeenCalledTimes(1);
        });

        it('should throw an error when native module fails', async () => {
            const error = new Error('Failed to extract video ID');
            (NativeModules.NewPipeModule.getVideoId as jest.Mock).mockRejectedValueOnce(error);

            const url = 'https://youtube.com/watch?v=test123';
            await expect(NewPipeService.getVideoId(url)).rejects.toThrow('Failed to extract video ID');
        });
    });
}); 