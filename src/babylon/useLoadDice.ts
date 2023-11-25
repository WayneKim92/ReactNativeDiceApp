import {useEffect} from 'react';
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import {useBabylonStore} from '../stores';
import {Mesh, PhysicsImpostor, Vector3} from '@babylonjs/core';

export const useLoadDice = () => {
  const {engine, setScene, setDiceMesh} = useBabylonStore();

  useEffect(() => {
    if (engine) {
      const url =
        'https://raw.githubusercontent.com/WayneKim92/ReactNativeHelloBabylon/practice/assets/3d_models/dice/scene.gltf';

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
        })
        .catch(err => {
          console.log('🐞err', err);
        });
    }
  }, [engine, setDiceMesh, setScene]);
};
