import {useEffect} from 'react';
import {CannonJSPlugin, Vector3} from '@babylonjs/core';
import {useBabylonStore} from '../stores';
import cannon from 'cannon';
// @ts-ignore
global.CANNON = cannon;

export const usePhysicsEngine = () => {
  const {scene} = useBabylonStore();

  useEffect(() => {
    if (scene) {
      scene.enablePhysics(new Vector3(0, -9.81 * 3, 0), new CannonJSPlugin());
    }
  }, [scene]);
};
