import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ToggledComponent<T> = React.PropsWithChildren<T & { isOpen: boolean; toggle: () => void; }>

const { height } = Dimensions.get('window');

export const Drawer = ({ children, isOpen, toggle, title }: ToggledComponent<{ title: string }>) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={toggle}
      presentationStyle="formSheet"
    >
      <View style={styles.drawerContainer}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={toggle}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.drawerContent}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  drawerHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  drawerContent: {
    maxHeight: height * 0.6,
    paddingHorizontal: 12,
  },
  drawerContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  closeButton: {
    fontSize: 16,
    color: '#fff',
  },
  drawer: {
    gap: 6,
    backgroundColor: '#282828',
  },
});
