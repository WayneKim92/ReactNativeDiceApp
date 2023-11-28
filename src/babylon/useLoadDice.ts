import '@babylonjs/loaders/glTF';

import {useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import {Mesh, PhysicsImpostor, Vector3} from '@babylonjs/core';
import {useBabylonStore} from '../stores';

export const useLoadDice = () => {
  const {engine, setScene, setDiceMesh} = useBabylonStore();

  useEffect(() => {
    if (engine) {
      // TODO: 로컬 파일을 읽어서 사용하거나 ReactNativeHelloBabylon 리포지토리 대신 다른 리포를 만들자.
      const url =
        'https://raw.githubusercontent.com/WayneKim92/Assets/main/3d_models/dice/scene.gltf';

      SceneLoader.LoadAsync(url, undefined, engine)
        .then(scene => {
          setScene(scene);

          scene.meshes.map(mesh => {
            if (mesh.name === 'Object_4') {
              if (mesh.parent) {
                // Detach the mesh from its parent
                mesh.setParent(null);
              }

              mesh.name = 'originDice';
              mesh.position = new Vector3(0, 0.5, 40);
              mesh.physicsImpostor = new PhysicsImpostor(
                mesh,
                PhysicsImpostor.BoxImpostor,
                {mass: 1, restitution: 1},
                scene,
              );
              setDiceMesh(mesh as Mesh);
            }
          });

          BootSplash.hide();
        })
        .catch(err => {
          console.log('🐞err', err);
        });
    }
  }, [engine, setDiceMesh, setScene]);
};
