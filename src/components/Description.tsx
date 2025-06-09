import { ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';

export const Description = ({ description }: { description: string }) => {
  return (
    <ScrollView>
      <RenderHTML
        source={{ html: description }}
        tagsStyles={{
          body: {
            color: '#b3b3b3',
            paddingHorizontal: 6,
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 20,
          },
        }}
      />
    </ScrollView>
  );
};

