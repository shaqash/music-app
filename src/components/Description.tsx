import { StyleSheet, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

export const Description = ({ description }: { description: string }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Description</Text>
      <RenderHTML source={{ html: description }} tagsStyles={{ body: { color: '#b3b3b3', fontSize: 14, lineHeight: 20 } }} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
});
