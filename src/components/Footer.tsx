import {Image, Pressable, View} from 'react-native';
import React from 'react';
import {useRelocationDice, useShakeDice} from '../babylon/actions';

export function Footer() {
  const relocationDice = useRelocationDice();
  const shakeDice = useShakeDice();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        padding: 16,
        flexGrow: 1,
        width: '100%',
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Pressable onPress={relocationDice}>
        <Image
          source={require('@assets/images/reset.png')}
          style={{height: 50, width: 50}}
        />
      </Pressable>
      <Pressable onPress={shakeDice}>
        <Image
          source={require('@assets/images/shake.png')}
          style={{height: 50, width: 50}}
        />
      </Pressable>
    </View>
  );
}
