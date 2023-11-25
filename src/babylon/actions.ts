import {useEffect, useRef} from 'react';
import Toast from 'react-native-simple-toast';
import {throttle} from 'lodash';
import {Matrix, Mesh, Vector3} from '@babylonjs/core';
import {useBabylonStore} from '../stores';
import {force} from './consts';
import {randomNegativeOrPositiveOne} from './utils';

export const useShowTotalCount = () => {
  const getDiceValue = useGetDiceValue();

  return throttle(() => {
    const totalCount = getDiceValue();
    Toast.show(String(totalCount), Toast.SHORT, {
      backgroundColor: 'white',
      textColor: 'black',
    });
  }, 3000);
};

export const useShakeDice = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {scene} = useBabylonStore();
  const directionRef = useRef(randomNegativeOrPositiveOne());

  const showTotalCount = useShowTotalCount();

  return () => {
    if (scene) {
      scene.meshes.map(mesh => {
        if (mesh.name.startsWith('dice')) {
          if (mesh.physicsImpostor) {
            const forceDirection = new Vector3(
              1 + Math.random() * force * directionRef.current,
              1 + Math.random() * force,
              1 + Math.random() * force * directionRef.current,
            );
            directionRef.current = directionRef.current * -1;

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
};

const useGetDiceValue = () => {
  const {scene} = useBabylonStore();

  return () => {
    if (scene === null || scene === undefined) {
      return;
    }
    // 전체 개수 보여주기
    const dices = scene.meshes.filter(mesh => mesh.name.startsWith('dice'));

    return (
      dices
        .map(dice => getDiceValue(dice as Mesh))
        // @ts-ignore
        .reduce((a: number, c) => a + c, 0)
    );
  };
};

export const useRelocationDice = () => {
  const {scene} = useBabylonStore();

  const getDiceValue = useGetDiceValue();

  return () => {
    if (scene) {
      const dices = scene.meshes.filter(mesh => mesh.name.startsWith('dice'));

      dices.map((mesh, i) => {
        if (mesh.name.startsWith('dice')) {
          if (mesh.physicsImpostor) {
            // Reset the position of the dice
            if (i === 0) {
              mesh.position = new Vector3(0, 0.5, 0);
            }
            if (i === 1) {
              mesh.position = new Vector3(1.5, 0.5, -1.5);
            }
            if (i === 2) {
              mesh.position = new Vector3(1.5, 0.5, 1.5);
            }
            if (i === 3) {
              mesh.position = new Vector3(-1.5, 0.5, 1.5);
            }
            if (i === 4) {
              mesh.position = new Vector3(-1.5, 0.5, -1.5);
            }

            // Reset the velocity of the dice
            mesh.physicsImpostor.setLinearVelocity(new Vector3(0, 0, 0));
            mesh.physicsImpostor.setAngularVelocity(new Vector3(0, 0, 0));
          }
        }
      });
    }

    Toast.show(String(getDiceValue()), Toast.SHORT, {
      backgroundColor: 'white',
      textColor: 'black',
    });
  };
};

export const useDiceCountChanged = () => {
  const {scene, diceMesh, diceCount} = useBabylonStore();

  useEffect(() => {
    if (diceMesh === null || scene === null) {
      return;
    }

    // 기존에 생성된 주사위를 모두 제거합니다.
    scene.meshes
      .filter(mesh => mesh.name.startsWith('dice'))
      .forEach(mesh => {
        mesh.dispose();
      });

    // 주사위를 diceCount 수에 맞게 새로 생성합니다.
    for (let i = 0; i < diceCount; i++) {
      diceMesh.position = new Vector3(0, 0.5, 40);
      const cloneDice = diceMesh.clone(`dice${i}`, null, true);
      // 위치 겹치면 안 보이는 이슈 있어서, 서로 다르게 해주어야함
      if (cloneDice) {
        if (i === 0) {
          cloneDice.position = new Vector3(0, 0.5, 0);
        }
        if (i === 1) {
          cloneDice.position = new Vector3(1.5, 0.5, -1.5);
        }
        if (i === 2) {
          cloneDice.position = new Vector3(1.5, 0.5, 1.5);
        }
        if (i === 3) {
          cloneDice.position = new Vector3(-1.5, 0.5, 1.5);
        }
        if (i === 4) {
          cloneDice.position = new Vector3(-1.5, 0.5, -1.5);
        }
      }
    }
  }, [diceCount, diceMesh, scene]);
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
