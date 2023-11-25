import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {EdgeInsets, Row, Spacer} from '@wayne-kim/react-native-layout';
import {maxDiceCount, minDiceCount} from '../babylon/consts';
import {useBabylonStore, useBottomSheetStore} from '../stores';
import {setLatestDiceCount} from '../storages/KeyValueStorage';
import Toast from 'react-native-simple-toast';
import {throttle} from 'lodash';

export function SettingBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '80%'], []);
  const {diceCount, setDiceCount} = useBabylonStore();
  const {setSettingBottomSheet} = useBottomSheetStore();

  const upDiceCount = throttle(
    () => {
      if (diceCount < maxDiceCount) {
        const newDiceCount = diceCount + 1;
        setDiceCount(newDiceCount);

        if (setLatestDiceCount) {
          setLatestDiceCount(newDiceCount).catch(() => {});
        }
      } else {
        Toast.show(
          `주사위는 최대 ${maxDiceCount}개까지만 지원합니다.`,
          Toast.SHORT,
        );
      }
    },
    2000,
    {trailing: false},
  );

  const downDiceCount = throttle(
    () => {
      if (diceCount > minDiceCount) {
        const newDiceCount = diceCount - 1;
        setDiceCount(newDiceCount);

        if (setLatestDiceCount) {
          setLatestDiceCount(newDiceCount).catch(() => {});
        }
      } else {
        Toast.show(
          `주사위는 최소 ${minDiceCount}개까지만 지원합니다.`,
          Toast.SHORT,
        );
      }
    },
    2000,
    {trailing: false},
  );

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
            onPress={upDiceCount}>
            <Text style={{color: 'white'}}>UP</Text>
          </Pressable>
          <Spacer size={8} />
          <Pressable
            style={{backgroundColor: 'black', padding: 8}}
            onPress={downDiceCount}>
            <Text style={{color: 'white'}}>Down</Text>
          </Pressable>
        </Row>
      </Row>
    </BottomSheet>
  );
}
