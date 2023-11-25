import React, {FunctionComponent, useEffect, useState} from 'react';
import cannon from 'cannon';
import {SafeAreaView, View, ViewProps, StatusBar} from 'react-native';
import {EngineView, useEngine} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core/Cameras/camera';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import '@babylonjs/loaders/glTF';
import {Scene} from '@babylonjs/core/scene';
import {MeshBuilder, Vector3} from '@babylonjs/core';
import earcut from 'earcut';

// @ts-ignore
global.CANNON = cannon;

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [_scene, setScene] = useState<Scene>();

  useEffect(() => {
    (async () => {
      if (engine) {
        // Create a new scene
        const scene = new Scene(engine);
        setScene(scene);

        // Set the scene background color
        scene.createDefaultCameraOrLight(true, undefined, true);

        // set the active camera
        const activeCamera = scene.activeCamera as ArcRotateCamera;
        activeCamera.alpha = Math.PI * 1.5; // alpha는 카메라의 수평 회전 각도를 결정 [ 0 ~ 2 ] 0 ~ 360
        activeCamera.beta = Math.PI * 0.45; // beta는 카메라의 수직 회전 각도를 결정 [ 0 ~ 2]
        activeCamera.radius = 450; //radius는 카메라와 타겟 사이의 거리를 결정
        activeCamera.target = Vector3.Zero(); // Set the target of the camera to the origin
        setCamera(activeCamera);

        // https://gero3.github.io/facetype.js/
        // fft 폰트 파일을 위 사이트에서 json으로 변경하면 폰트의 좌표값을 얻을 수 있다.
        const fontData =
          await require('../assets/fonts/Noto_Sans_KR_Bold.json');
        MeshBuilder.CreateText(
          'myText',
          '안녕 숨고 친구들!',
          fontData,
          {
            size: 16,
            resolution: 64,
            depth: 10,
          },
          scene,
          earcut,
        );
      }
    })();
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

export default function TextExample() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <EngineScreen style={{flex: 1}} />
      </SafeAreaView>
    </>
  );
}
