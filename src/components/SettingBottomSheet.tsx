import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {EdgeInsets, Row, Spacer} from '@wayne-kim/react-native-layout';
import {maxDiceCount, minDiceCount} from '../babylon/consts';
import {useBabylonStore, useBottomSheetStore} from '../stores';

export function SettingBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '80%'], []);
  const {diceCount, setDiceCount} = useBabylonStore();
  const {setSettingBottomSheet} = useBottomSheetStore();

  const handleSheetChanges = useCallback((index: number) => {
    if (bottomSheetRef.current === null) {
      return;
    }

    if (index === 0) {
      bottomSheetRef.current.close();
    }
  }, []);

  useEffect(() => {
    setSettingBottomSheet(bottomSheetRef.current);
  }, [setSettingBottomSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <Row edgeInsets={EdgeInsets.all(16)}>
        <Row alignItems={'center'} style={{width: 100, height: 50}}>
          <Text style={{fontSize: 16}}>주사위 수</Text>
          <Spacer size={16} />
          <Text style={{fontSize: 16}}>{diceCount}</Text>
          <Spacer size={16} />
          <Pressable
            style={{backgroundColor: 'black', padding: 8}}
            onPress={() => {
              if (diceCount < maxDiceCount) {
                setDiceCount(diceCount + 1);
              }
            }}>
            <Text style={{color: 'white'}}>UP</Text>
          </Pressable>
          <Spacer size={8} />
          <Pressable
            style={{backgroundColor: 'black', padding: 8}}
            onPress={() => {
              if (diceCount > minDiceCount) {
                setDiceCount(diceCount - 1);
              }
            }}>
            <Text style={{color: 'white'}}>Down</Text>
          </Pressable>
        </Row>
      </Row>
    </BottomSheet>
  );
}
