import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {View, ViewProps, Image, Pressable, Text} from 'react-native';
import {EngineView, useEngine} from '@babylonjs/react-native';
import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import {Camera} from '@babylonjs/core/Cameras/camera';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import BottomSheet from '@gorhom/bottom-sheet';
import {Row, EdgeInsets, Spacer} from '@wayne-kim/react-native-layout';

import '@babylonjs/loaders/glTF';
import {Scene} from '@babylonjs/core/scene';
import {
  CannonJSPlugin,
  Color3,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  StandardMaterial,
  Vector3,
  Matrix,
} from '@babylonjs/core';
import Toast from 'react-native-simple-toast';
import {throttle} from 'lodash';

// 물리엔진 적용
import cannon from 'cannon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// @ts-ignore
global.CANNON = cannon;

import {ArcRotateCameraPointersInput} from '@babylonjs/core';
class CustomArcRotateCameraPointersInput extends ArcRotateCameraPointersInput {
  onTouch(): void {
    // 아무 것도 하지 않기
    return;
  }
}

function randomNegativeOrPositiveOne() {
  return Math.floor(Math.random() * 2) === 0 ? -1 : 1;
}

const setWallTransparency = (mesh: Mesh) => {
  // Set the visibility of the wall
  mesh.visibility = 0;
};

const getDiceValue = (dice: Mesh) => {
  if (dice === null || dice === undefined) {
    return null;
  }

  // 주사위의 각 면에 대응하는 벡터를 정의합니다.
  const faceVectors = [
    new Vector3(0, 1, 0), // 위쪽 면
    new Vector3(0, -1, 0), // 아래쪽 면
    new Vector3(1, 0, 0), // 오른쪽 면
    new Vector3(-1, 0, 0), // 왼쪽 면
    new Vector3(0, 0, 1), // 앞쪽 면
    new Vector3(0, 0, -1), // 뒤쪽 면
  ];

  // 주사위의 면에 대응하는 숫자를 정의합니다.
  const faceValues = [1, 6, 5, 2, 3, 4];

  // 주사위의 회전 행렬을 가져옵니다.
  let rotationMatrix = new Matrix();
  if (dice && dice.rotationQuaternion) {
    rotationMatrix = dice.rotationQuaternion.toRotationMatrix(rotationMatrix);
  }

  let minDotProduct = Infinity;
  let value = -1;

  // 각 면에 대응하는 벡터를 확인합니다.
  for (let i = 0; i < faceVectors.length; i++) {
    // 벡터를 주사위의 월드 좌표계로 변환합니다.
    const worldVector = Vector3.TransformCoordinates(
      faceVectors[i],
      rotationMatrix,
    );

    // 변환된 벡터의 y 좌표가 가장 작은 경우, 이 면이 바닥에 닿았다고 판단합니다.
    if (worldVector.y < minDotProduct) {
      minDotProduct = worldVector.y;
      value = faceValues[i];
    }
  }

  return value;
};

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [scene, setScene] = useState<Scene>();
  const [diceCount, setDiceCount] = useState<number>(4);
  const [force] = useState<number>(5);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '80%'], []);
  const diceModelRef = useRef<Mesh>(null);
  const insets = useSafeAreaInsets();

  const handleSheetChanges = useCallback((index: number) => {
    if (bottomSheetRef.current === null) {
      return;
    }

    if (index === 0) {
      bottomSheetRef.current.close();
    }
  }, []);

  const showTotalCount = throttle(() => {
    if (scene === null || scene === undefined) {
      return;
    }
    // 전체 개수 보여주기
    const dices = scene.meshes.filter(mesh => mesh.name.startsWith('dice'));

    const counts = dices.map(dice => getDiceValue(dice as Mesh));
    // @ts-ignore
    const totalCount = counts.reduce((a: number, c) => a + c, 0);

    Toast.show(String(totalCount), Toast.SHORT, {
      backgroundColor: 'white',
      textColor: 'black',
    });
  }, 3000);

  const shakeDice = () => {
    if (scene) {
      scene.meshes.map(mesh => {
        if (mesh.name.startsWith('dice')) {
          if (mesh.physicsImpostor) {
            const forceDirection = new Vector3(
              1 + Math.random() * force * randomNegativeOrPositiveOne(),
              1 + Math.random() * force,
              1 + Math.random() * force * randomNegativeOrPositiveOne(),
            );

            if (mesh.physicsImpostor === null) {
              return;
            }

            mesh.physicsImpostor.applyImpulse(
              forceDirection.scale(force),
              mesh.getAbsolutePosition(),
            );
          }
        }

        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          showTotalCount, // 쓰로틀링 간격을 2000ms로 설정
          2000,
        );
      });
    }
  };

  const resetDice = () => {
    if (scene) {
      const dices = scene.meshes.filter(mesh => mesh.name.startsWith('dice'));

      dices.map((mesh, i) => {
        if (mesh.name.startsWith('dice')) {
          if (mesh.physicsImpostor) {
            // Reset the position of the dice
            if (i === 0) {
              mesh.position = new Vector3(1.5, 0.5, -1.5);
            }
            if (i === 1) {
              mesh.position = new Vector3(1.5, 0.5, 1.5);
            }
            if (i === 2) {
              mesh.position = new Vector3(-1.5, 0.5, 1.5);
            }
            if (i === 3) {
              mesh.position = new Vector3(-1.5, 0.5, -1.5);
            }

            // Reset the velocity of the dice
            mesh.physicsImpostor.setLinearVelocity(new Vector3(0, 0, 0));
            mesh.physicsImpostor.setAngularVelocity(new Vector3(0, 0, 0));
          }
        }
      });
    }
  };

  useEffect(() => {
    if (engine) {
      const url =
        'https://raw.githubusercontent.com/WayneKim92/ReactNativeHelloBabylon/practice/assets/3d_models/dice/scene.gltf';

      SceneLoader.LoadAsync(url, undefined, engine)
        .then(loadScene => {
          setScene(loadScene);
        })
        .catch(err => {
          console.log('🐞err', err);
        });
    }
  }, [engine]);

  useEffect(() => {
    if (scene) {
      // Enable the physics engine
      scene.enablePhysics(new Vector3(0, -9.81 * 3, 0), new CannonJSPlugin());

      // Set the scene background color
      scene.createDefaultCameraOrLight(true, undefined, true);

      // set the active camera
      const activeCamera = scene.activeCamera as ArcRotateCamera;
      setCamera(activeCamera);
      // 카메라 위치
      activeCamera.alpha = Math.PI * 0.5;
      activeCamera.beta = Math.PI * 0.1;
      activeCamera.radius = 15;
      // 확대 축소 범위 지정
      activeCamera.upperRadiusLimit = 20;
      activeCamera.lowerRadiusLimit = 5;
      // 카메라 회전 기능만 제거
      activeCamera.inputs.remove(activeCamera.inputs.attached.pointers);
      activeCamera.inputs.add(new CustomArcRotateCameraPointersInput());

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
      groundMaterial.specularColor = new Color3(0, 0, 0); // 빛의 반사를 제거합니다.
      ground.material = groundMaterial;

      // 주사위
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
          // @ts-ignore
          diceModelRef.current = mesh as Mesh;
        }
      });
    }
  }, [scene]);

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

  useEffect(() => {
    if (diceModelRef.current === null) {
      return;
    }

    if (scene) {
      // 기존에 생성된 주사위를 모두 제거합니다.
      scene.meshes
        .filter(mesh => mesh.name.startsWith('dice'))
        .forEach(mesh => {
          mesh.dispose();
        });

      // 주사위를 diceCount 수에 맞게 새로 생성합니다.
      for (let i = 0; i < diceCount; i++) {
        diceModelRef.current.position = new Vector3(0, 0.5, 40);
        const cloneDice = diceModelRef.current.clone(`dice${i}`, null, true);
        // 위치 겹치면 안 보이는 이슈 있어서, 서로 다르게 해주어야함
        if (cloneDice) {
          if (i === 0) {
            cloneDice.position = new Vector3(1.5, 0.5, -1.5);
          }
          if (i === 1) {
            cloneDice.position = new Vector3(1.5, 0.5, 1.5);
          }
          if (i === 2) {
            cloneDice.position = new Vector3(-1.5, 0.5, 1.5);
          }
          if (i === 3) {
            cloneDice.position = new Vector3(-1.5, 0.5, -1.5);
          }
        }
      }
    }
  }, [diceCount, scene]);

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
            <Pressable onPress={resetDice}>
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

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <Row edgeInsets={EdgeInsets.all(16)}>
              <Row alignItems={'center'} style={{width: 100, height: 50}}>
                <Text style={{fontSize: 16}}>주사위 수</Text>
                <Spacer size={16} />
                <Text style={{fontSize: 16}}>{diceCount}</Text>
                <Spacer size={16} />
                <Pressable
                  style={{backgroundColor: 'black', padding: 8}}
                  onPress={() => {
                    if (diceCount < 4) {
                      setDiceCount(diceCount + 1);
                    }
                  }}>
                  <Text style={{color: 'white'}}>UP</Text>
                </Pressable>
                <Spacer size={8} />
                <Pressable
                  style={{backgroundColor: 'black', padding: 8}}
                  onPress={() => {
                    if (diceCount > 1) {
                      setDiceCount(diceCount - 1);
                    }
                  }}>
                  <Text style={{color: 'white'}}>Down</Text>
                </Pressable>
              </Row>
            </Row>
          </BottomSheet>
        </View>
      </View>
    </>
  );
};

const DiceExample = () => {
  return <EngineScreen style={{flex: 1}} />;
};

export default DiceExample;
