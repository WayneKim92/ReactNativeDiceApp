import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Linking, Pressable, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import {Column, EdgeInsets, Row, Spacer} from '@wayne-kim/react-native-layout';
import {maxDiceCount, minDiceCount} from '../babylon/consts';
import {useAppStore, useBottomSheetStore} from '../stores';
import {setLatestDiceCount} from '../storages/KeyValueStorage';
import Toast from 'react-native-simple-toast';
import {throttle} from 'lodash';
import {koreanDateFormat} from '../utils/date';
import {AdmobBanner} from './AdmobBanner';

export function SettingBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '80%'], []);
  const {diceCount, setDiceCount, history, clearHistory} = useAppStore();
  const {setSettingBottomSheet} = useBottomSheetStore();

  const countHistory = Object.keys(history).map(key => ({
    key,
    value: history[key],
  }));

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
      <Row edgeInsets={EdgeInsets.horizontal(16)}>
        <Row alignItems={'center'} flex={1}>
          <Text style={{fontSize: 16}}>주사위 수</Text>
          <Spacer size={16} />
          <Text style={{fontSize: 16}}>{diceCount}</Text>
          <Spacer flex={1} />

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

      <Spacer size={12} />

      <Column edgeInsets={EdgeInsets.horizontal(16)} style={{flex: 1}}>
        <Row alignItems={'center'}>
          <Text style={{fontSize: 16}}>주사위 점수 기록</Text>
          <Spacer flex={1} />
          <Pressable
            style={{backgroundColor: 'black', padding: 8}}
            onPress={clearHistory}>
            <Text style={{color: 'white'}}>초기화</Text>
          </Pressable>
        </Row>

        <Spacer size={12} />

        <Row edgeInsets={EdgeInsets.vertical(4)}>
          <Text style={{fontSize: 16}}>시간</Text>
          <Spacer flex={1} />
          <Text style={{fontSize: 16}}>점수</Text>
        </Row>

        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: '#D3D3D3',
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}>
          {countHistory.map(({key, value}) => (
            <Column
              key={key}
              style={{
                borderBottomWidth: 1.5,
                borderBottomColor: 'white',
              }}>
              <Row>
                <Text style={{fontSize: 16}}>
                  {koreanDateFormat(new Date(Number(key)))}
                </Text>
                <Spacer flex={1} />
                <Text style={{fontSize: 16}}>{value}</Text>
              </Row>

              <Spacer size={4} />
            </Column>
          ))}
        </ScrollView>

        <Spacer size={16} />

        <Pressable
          onPress={() =>
            Linking.openURL('https://forms.gle/wVJhpSDzJgWsbyhp7')
          }>
          <Text>요청사항</Text>
        </Pressable>
      </Column>

      <Spacer size={16} />

      <AdmobBanner />
    </BottomSheet>
  );
}
