import React, { useEffect } from 'react';
import {
  View, Animated, Easing, Image
} from 'react-native';
import { PureBackdropModal } from "./pure-backdrop-modal";

export interface BottomModalProps {
  visible: boolean
}

export function LoadingModal(props: BottomModalProps) {
  const {visible} = props;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(
          spinValue,
          {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
          }
        )
      ).start()
    }
    return () => {
    }
  })

  const spinValue = new Animated.Value(0);
  const spin = spinValue?.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  if (!visible) return null
  return (
    <PureBackdropModal visible={visible} onClose={() => null} preset={'spin'}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Animated.View style={{transform: [{rotate: spin}]}}>
          <Image
            style={{width: 64, height: 64}}
            source={require('../../assets/icons/settings.png')}
          />
        </Animated.View>
      </View>
    </PureBackdropModal>
  );
}
