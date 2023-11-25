import {Image, Pressable, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomSheetStore} from '../stores';

export function Header() {
  const insets = useSafeAreaInsets();
  const {settingBottomSheet} = useBottomSheetStore();

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top,
        padding: 16,
        flexGrow: 1,
        width: '100%',
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Pressable
        onPress={() => {
          if (settingBottomSheet === null) {
            return;
          }
          settingBottomSheet.snapToIndex(1);
        }}>
        <Image
          source={require('@assets/images/setting.png')}
          style={{height: 50, width: 50}}
        />
      </Pressable>
    </View>
  );
}
