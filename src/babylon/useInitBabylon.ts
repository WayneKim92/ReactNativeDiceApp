import {useEngine} from '@babylonjs/react-native';
import {useBabylonStore} from '../stores';
import {useEffect} from 'react';
import {useLoadDice} from './useLoadDice';
import {useInitCamera} from './useInitCamera';
import {usePhysicsEngine} from './usePhysicsEngine';
import {useDiceCountChanged, useShakeDice} from './actions';
import {useInitModels} from './useInitModels';
import RNShake from 'react-native-shake';
import {getLatestDiceCount} from '../storages/KeyValueStorage';

export const useInitBabylon = () => {
  const engine = useEngine();
  const {setEngine, setDiceCount} = useBabylonStore();

  useEffect(() => {
    setEngine(engine);
  }, [engine, setEngine]);
  usePhysicsEngine();
  useInitCamera();

  useLoadDice();
  useInitModels();

  useDiceCountChanged();

  useEffect(() => {
    (async () => {
      const latestDiceCount = await getLatestDiceCount();
      setDiceCount(latestDiceCount as number);
    })();
  }, [setDiceCount]);

  const shakeDice = useShakeDice();
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      shakeDice();
    });

    return () => {
      subscription.remove();
    };
  }, [shakeDice]);
};
