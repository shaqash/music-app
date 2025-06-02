import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SearchResult } from '../types/newpipe';

const RECENT_VIDEOS_KEY = '@discombobulate:recent_videos';
const MAX_RECENT_VIDEOS = 20;

export class StorageService {
    static async getRecentVideos(): Promise<SearchResult[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(RECENT_VIDEOS_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Error reading recent videos:', e);
            return [];
        }
    }

    static async addRecentVideo(video: SearchResult): Promise<void> {
        try {
            // Get current videos
            const currentVideos = await this.getRecentVideos();
            
            // Remove if video already exists (to move it to top)
            const filteredVideos = currentVideos.filter(v => v.url !== video.url);
            
            // Add new video at the beginning
            const newVideos = [video, ...filteredVideos].slice(0, MAX_RECENT_VIDEOS);
            
            // Save updated list
            await AsyncStorage.setItem(RECENT_VIDEOS_KEY, JSON.stringify(newVideos));
        } catch (e) {
            console.error('Error saving recent video:', e);
        }
    }

    static async clearRecentVideos(): Promise<void> {
        try {
            await AsyncStorage.removeItem(RECENT_VIDEOS_KEY);
        } catch (e) {
            console.error('Error clearing recent videos:', e);
        }
    }
} 