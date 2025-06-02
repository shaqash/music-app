import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import type { SearchResult } from '../types/newpipe';
import useRelatedTracks from '../hooks/useRelatedTracks';
import { useAppContext } from '../context/AppContext';
import NextUpTrack from './NextUpTrack';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const NextUpQueue: React.FC = () => {
    const { currentTrackUrl } = useAppContext();
    const { relatedTracks } = useRelatedTracks(currentTrackUrl);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const toggleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCollapsed(!isCollapsed);
        Animated.timing(rotateAnim, {
            toValue: isCollapsed ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    if (relatedTracks.length === 0) {
        return (
            <View style={styles.emptyContainer} />
        );
    }

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleCollapse} style={styles.headerContainer}>
                <Text style={styles.title}>Next Up</Text>
                <Animated.Text style={[styles.collapseIcon, { transform: [{ rotate: spin }] }]}>
                    ▲
                </Animated.Text>
            </TouchableOpacity>
            {!isCollapsed && (
                <FlatList
                    data={relatedTracks}
                    renderItem={({ item }: { item: SearchResult }) => (
                        <NextUpTrack
                            track={item}
                            isCurrentTrack={item.url === currentTrackUrl}
                        />
                    )}
                    keyExtractor={(item) => item.url}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    collapseIcon: {
        color: '#fff',
        fontSize: 16,
    },
    listContent: {
        padding: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});

export default NextUpQueue; 