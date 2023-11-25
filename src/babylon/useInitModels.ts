import {useEffect} from 'react';
import {MeshBuilder, PhysicsImpostor, Vector3} from '@babylonjs/core';
import {useBabylonStore} from '../stores';
import {setMeshTransparency} from './utils';

export const useInitModels = () => {
  const {scene} = useBabylonStore();

  useEffect(() => {
    if (scene) {
      // Create a wall around the dice
      const wallSize = 7.5; // Adjust the size as needed
      const wallThickness = 0.1; // Adjust the thickness as needed

      // Create the 4 walls
      const wall1 = MeshBuilder.CreateBox(
        'wall',
        {width: wallSize, height: wallSize, depth: wallThickness},
        scene,
      );
      const wall2 = MeshBuilder.CreateBox(
        'wall2',
        {width: wallSize, height: wallSize, depth: wallThickness},
        scene,
      );
      const wall3 = MeshBuilder.CreateBox(
        'wall3',
        {width: wallThickness, height: wallSize, depth: wallSize},
        scene,
      );
      const wall4 = MeshBuilder.CreateBox(
        'wall4',
        {width: wallThickness, height: wallSize, depth: wallSize},
        scene,
      );

      wall1.position = new Vector3(0, 0, wallSize / 2);
      wall2.position = new Vector3(0, 0, -wallSize / 2);
      wall3.position = new Vector3(wallSize / 2, 0, 0);
      wall4.position = new Vector3(-wallSize / 2, 0, 0);

      wall1.physicsImpostor = new PhysicsImpostor(
        wall1,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );
      wall2.physicsImpostor = new PhysicsImpostor(
        wall2,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );
      wall3.physicsImpostor = new PhysicsImpostor(
        wall3,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );
      wall4.physicsImpostor = new PhysicsImpostor(
        wall4,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );

      // 지붕
      const roofSize = 8;
      const roofThickness = 1;
      const roof = MeshBuilder.CreateBox(
        'roof',
        {width: roofSize, height: roofThickness, depth: roofSize},
        scene,
      );
      roof.position = new Vector3(0, roofSize / 2, 0);
      roof.physicsImpostor = new PhysicsImpostor(
        roof,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );

      // 커버 투명하게
      setMeshTransparency(wall1);
      setMeshTransparency(wall2);
      setMeshTransparency(wall3);
      setMeshTransparency(wall4);
      setMeshTransparency(roof);
    }
  }, [scene]);
};
