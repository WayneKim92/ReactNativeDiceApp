import {useEngine} from '@babylonjs/react-native';
import {useBabylonStore} from '../stores';
import {useEffect} from 'react';
import {useLoadDice} from './useLoadDice';
import {useInitCamera} from './useInitCamera';
import {usePhysicsEngine} from './usePhysicsEngine';
import {useDiceCountChanged, useShakeDice} from './actions';
import {useInitModels} from './useInitModels';
import RNShake from 'react-native-shake';

export const useInitBabylon = () => {
  const engine = useEngine();
  const {setEngine} = useBabylonStore();

  useEffect(() => {
    setEngine(engine);
  }, [engine, setEngine]);
  usePhysicsEngine();
  useInitCamera();

  useLoadDice();
  useInitModels();

  useDiceCountChanged();

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
