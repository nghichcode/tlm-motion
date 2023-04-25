import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, SafeAreaView} from 'react-native';

export const tagPresets = {
  default: {},
  zeroPad: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  spin: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignSelf: 'center'
  },
  alert: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignSelf: 'center',
    width: '100%'
  },
}
export type TagPresets = keyof typeof tagPresets

export interface PureBackdropModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  preset?: TagPresets,
}

export function PureBackdropModal(props: PureBackdropModalProps) {
  const {visible, onClose, children, preset} = props;

  const modalViewStyle = [
    styles.modalView,
    tagPresets[preset] || tagPresets.default
  ]

  if (!visible) return null
  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback style={styles.modalBackdrop} onPress={onClose}>
          <View style={styles.modalBackdrop}/>
        </TouchableWithoutFeedback>
        <SafeAreaView style={styles.modalFullWidth}>
          <View style={modalViewStyle}>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 8,
  },
  modalBackdrop: {
    backgroundColor: '#00000055',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9,
  },
  modalContainer: {alignItems: 'center', flex: 1, justifyContent: 'center'},
  modalFullWidth: {
    width: '82%',
    zIndex: 99,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});
