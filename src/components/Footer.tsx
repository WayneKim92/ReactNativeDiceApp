import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {EdgeInsets, Row, Spacer} from '@wayne-kim/react-native-layout';
import {useRelocationDice, useShakeDice} from '../babylon/actions';
import {useBottomSheetStore} from '../stores';

export function Footer() {
  const {settingBottomSheet} = useBottomSheetStore();
  const relocationDice = useRelocationDice();
  const shakeDice = useShakeDice();

  return (
    <Pressable onPress={shakeDice} style={styles.container}>
      <Row flexGrow={1} alignItems={'center'} edgeInsets={EdgeInsets.all(16)}>
        <Pressable onPress={relocationDice}>
          <Image
            source={require('@assets/images/relocation.png')}
            style={{height: 50, width: 50}}
          />
        </Pressable>

        <Spacer flex={1} />

        <Pressable
          onPress={() => {
            if (settingBottomSheet === null) {
              return;
            }
            settingBottomSheet.snapToIndex(1);
          }}>
          <Image
            source={require('@assets/images/setting.png')}
            style={{height: 40, width: 40}}
          />
        </Pressable>
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
