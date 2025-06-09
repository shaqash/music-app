import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackIcon } from './PlayerIcons';

export type ToggledComponent<T> = React.PropsWithChildren<T & { isOpen: boolean; toggle: () => void; }>


export const Drawer = ({ children, isOpen, toggle, title }: ToggledComponent<{ title: string }>) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      // animationType="slide"
      onRequestClose={toggle}
      presentationStyle="overFullScreen"
    >
      <View style={styles.drawerContainer}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <TouchableOpacity onPress={toggle} style={styles.closeButton}>
              <BackIcon size={32} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
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
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    paddingVertical: 6,
    marginRight: 6,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  drawerContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  drawerContainer: {
    flex: 1,
  },
  drawer: {
    flex: 1,
    gap: 6,
    backgroundColor: 'rgba(30, 30, 30, 1)',
  },
});
