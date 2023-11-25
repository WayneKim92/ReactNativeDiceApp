import React, {FunctionComponent, useEffect, useState} from 'react';
import cannon from 'cannon';
import {
  SafeAreaView,
  View,
  ViewProps,
  StatusBar,
  Button,
  DeviceEventEmitter,
} from 'react-native';
import {EngineView, useEngine} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core/Cameras/camera';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import '@babylonjs/loaders/glTF';
import {Scene} from '@babylonjs/core/scene';
import {
  MeshBuilder,
  Vector3,
  Color3,
  StandardMaterial,
  CannonJSPlugin,
  PhysicsImpostor,
} from '@babylonjs/core';

// @ts-ignore
global.CANNON = cannon;

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    if (engine) {
      // Create a new scene
      const scene = new Scene(engine);
      setScene(scene);

      // Enable the physics engine
      scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

      // Set the scene background color
      scene.createDefaultCameraOrLight(true, undefined, true);

      // set the active camera
      const activeCamera = scene.activeCamera as ArcRotateCamera;
      activeCamera.alpha += Math.PI;
      activeCamera.beta -= Math.PI / 4; // Adjust the vertical angle
      activeCamera.radius = 10;
      activeCamera.position = new Vector3(0, 10, 10);
      activeCamera.target = Vector3.Zero();
      setCamera(activeCamera);

      // Add a ground to the new scene
      const ground = MeshBuilder.CreateGround(
        'ground',
        {width: 100, height: 100},
        scene,
      );
      ground.physicsImpostor = new PhysicsImpostor(
        ground,
        PhysicsImpostor.BoxImpostor,
        {mass: 0},
        scene,
      );
      // Create a green material
      const groundMaterial = new StandardMaterial('groundMaterial', scene);
      groundMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1); // RGB values range from 0 to 1
      // Assign the material to the ground mesh
      ground.material = groundMaterial;
    }
  }, [engine]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('onAddBox', () => {
      if (scene === undefined) {
        return;
      }

      const box = MeshBuilder.CreateBox('box', {width: 1}, scene);
      box.position = new Vector3(0, 10, 0);
      box.physicsImpostor = new PhysicsImpostor(
        box,
        PhysicsImpostor.BoxImpostor,
        {mass: 1, restitution: 1},
        scene,
      );
      box.metadata = {createdAt: Date.now()};

      if (scene.meshes.length > 20) {
        const boxs = scene.meshes.filter(mesh => mesh.name === 'box');
        if (boxs.length > 10) {
          const oldestBox = boxs.sort(
            (a, b) => a.metadata.createdAt - b.metadata.createdAt,
          )[0];
          oldestBox.dispose();
        }
      }
    });

    return () => {
      listener.remove();
    };
  }, [scene]);

  return (
    <>
      <View style={props.style}>
        <View style={{flex: 1}}>
          <EngineView camera={camera} displayFrameRate={true} />
        </View>
      </View>
    </>
  );
};

export default function AddBoxExample() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <EngineScreen style={{flex: 1}} />
        <Button
          title={'Add Box'}
          onPress={() => {
            DeviceEventEmitter.emit('onAddBox');
          }}
        />
      </SafeAreaView>
    </>
  );
}
