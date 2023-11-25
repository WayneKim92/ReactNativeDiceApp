import {useEngine} from '@babylonjs/react-native';
import {useBabylonStore} from '../stores';
import {useEffect} from 'react';
import {useLoadDice} from './useLoadDice';
import {useInitCamera} from './useInitCamera';
import {usePhysicsEngine} from './usePhysicsEngine';
import {useDiceCountChanged} from './actions';
import {useInitModels} from './useInitModels';

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
};
