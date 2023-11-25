import React, {FunctionComponent, useEffect, useState} from 'react';
import cannon from 'cannon';
import {SafeAreaView, View, ViewProps, StatusBar} from 'react-native';
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
  Animation,
} from '@babylonjs/core';

// @ts-ignore
global.CANNON = cannon;

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [_scene, setScene] = useState<Scene>();

  function createWall(
    scene: Scene,
    startPosition: Vector3,
    length: number,
    height: number,
  ) {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < height; j++) {
        const box = MeshBuilder.CreateBox('box', {width: 1}, scene);
        box.position = new Vector3(
          startPosition.x + i,
          startPosition.y + j,
          startPosition.z,
        );
        box.physicsImpostor = new PhysicsImpostor(
          box,
          PhysicsImpostor.BoxImpostor,
          {mass: 0.5, restitution: 0}, // mass is now 1
          scene,
        );
      }
    }
  }

  function createExpandingSphere(scene: Scene, startPosition: Vector3) {
    // Create a sphere
    const sphere = MeshBuilder.CreateSphere('sphere', {diameter: 1}, scene);
    sphere.position = startPosition;

    // Create a material for the sphere
    const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
    sphereMaterial.alpha = 0; // Make the sphere semi-transparent
    sphere.material = sphereMaterial;

    // Create an animation object
    const animation = new Animation(
      'sphereAnimation',
      'scaling',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    // Animation keys
    const keys = [];

    // At the animation key 0, the scaling value is 1
    keys.push({
      frame: 0,
      value: new Vector3(1, 1, 1),
    });

    // At the animation key 100, the scaling value is 10
    keys.push({
      frame: 5, // 더 빨리 애니메이션 하기
      value: new Vector3(10, 10, 10),
    });

    // Add these keys to the animation
    animation.setKeys(keys);

    // Link the animation to the sphere
    sphere.animations.push(animation);

    // Run the animation
    scene.beginAnimation(sphere, 0, 50, false, undefined, () => {
      // Add a new physics impostor with the updated size
      sphere.physicsImpostor = new PhysicsImpostor(
        sphere,
        PhysicsImpostor.SphereImpostor,
        {mass: 1, restitution: 1},
        scene,
      );
    });
  }

  useEffect(() => {
    if (engine) {
      // Create a new scene
      const scene = new Scene(engine);
      setScene(scene);

      // Enable the physics engine
      scene.enablePhysics(new Vector3(0, 0, 0), new CannonJSPlugin());

      // Set the scene background color
      scene.createDefaultCameraOrLight(true, undefined, true);

      // set the active camera
      const activeCamera = scene.activeCamera as ArcRotateCamera;
      activeCamera.alpha = Math.PI / 4; // Adjust the horizontal angle
      activeCamera.beta = Math.PI / 3; // Adjust the vertical angle
      activeCamera.radius = 20; // Adjust the distance between the camera and the target
      activeCamera.position = new Vector3(20, 20, 20); // Adjust the camera position
      activeCamera.target = new Vector3(5, 0, 0); // Adjust the target position
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
      ground.material = groundMaterial;

      createWall(scene, new Vector3(2.5, 1, 0), 5, 5);

      setTimeout(() => {
        createExpandingSphere(scene, new Vector3(5, 1, 2));
      }, 1000);
    }
  }, [engine]);

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

export default function ExplosionExample() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <EngineScreen style={{flex: 1}} />
      </SafeAreaView>
    </>
  );
}
