import React, {FunctionComponent, useEffect, useRef} from 'react';
import {View, ViewProps, Image, Pressable} from 'react-native';
import {EngineView} from '@babylonjs/react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import '@babylonjs/loaders/glTF';
import {Mesh, MeshBuilder, PhysicsImpostor, Vector3} from '@babylonjs/core';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useBabylonStore} from './stores';
import {useInitBabylon} from './babylon/useInitBabylon';
import {useRelocationDice, useShakeDice} from './babylon/actions';
import {SettingBottomSheet} from './components/SettingBottomSheet';

const setWallTransparency = (mesh: Mesh) => {
  // Set the visibility of the wall
  mesh.visibility = 0;
};

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const {scene, camera} = useBabylonStore();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const insets = useSafeAreaInsets();

  useInitBabylon();

  const shakeDice = useShakeDice();
  const relocationDice = useRelocationDice();

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
      setWallTransparency(wall1);
      setWallTransparency(wall2);
      setWallTransparency(wall3);
      setWallTransparency(wall4);
      setWallTransparency(roof);
    }
  }, [scene]);

  console.log('🐞??', camera);

  return (
    <>
      <View style={props.style}>
        <View style={{flex: 1}}>
          <EngineView camera={camera} displayFrameRate={true} />

          <View
            style={{
              position: 'absolute',
              top: insets.top,
              padding: 16,
              flexGrow: 1,
              width: '100%',
              alignContent: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Pressable
              onPress={() => {
                if (bottomSheetRef.current === null) {
                  return;
                }
                bottomSheetRef.current.snapToIndex(1);
              }}>
              <Image
                source={require('../assets/images/setting.png')}
                style={{height: 50, width: 50}}
              />
            </Pressable>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              padding: 16,
              flexGrow: 1,
              width: '100%',
              alignContent: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Pressable onPress={relocationDice}>
              <Image
                source={require('../assets/images/reset.png')}
                style={{height: 50, width: 50}}
              />
            </Pressable>
            <Pressable onPress={shakeDice}>
              <Image
                source={require('../assets/images/shake.png')}
                style={{height: 50, width: 50}}
              />
            </Pressable>
          </View>

          <SettingBottomSheet />
        </View>
      </View>
    </>
  );
};

const MainScreen = () => {
  return <EngineScreen style={{flex: 1}} />;
};

export default MainScreen;
