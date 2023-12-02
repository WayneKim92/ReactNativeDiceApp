import {useEffect} from 'react';
import {
  ArcRotateCameraPointersInput,
  Nullable,
  PointerTouch,
} from '@babylonjs/core';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {useBabylonStore} from '../stores';
import {useShakeDice} from './actions';

export const useInitCamera = () => {
  const {scene, setCamera} = useBabylonStore();
  const shakeDice = useShakeDice();

  useEffect(() => {
    if (scene) {
      // Set the scene background color
      scene.createDefaultCameraOrLight(true, undefined, true);

      // set the active camera
      const activeCamera = scene.activeCamera as ArcRotateCamera;
      setCamera(activeCamera);
      // 카메라 위치
      activeCamera.alpha = Math.PI * 0.5;
      activeCamera.beta = Math.PI * 0.1;
      activeCamera.radius = 20;
      // 확대 축소 범위 지정
      activeCamera.upperRadiusLimit = 20;
      activeCamera.lowerRadiusLimit = 5;
      // 카메라 회전 기능만 제거
      activeCamera.inputs.remove(activeCamera.inputs.attached.pointers);
      activeCamera.inputs.add(
        new CustomArcRotateCameraPointersInput(shakeDice),
      );
    }

    // TODO: shakeDice 의존성 입력하면 무한반복 발생하는 것 해결하기
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, setCamera]);
};

class CustomArcRotateCameraPointersInput extends ArcRotateCameraPointersInput {
  pinchPrecision = 250;
  onShakeDice: () => void;

  constructor(onShakeDice: () => void) {
    super();
    this.onShakeDice = onShakeDice;
  }

  onTouch(): void {
    this.onShakeDice();
    return;
  }

  onButtonDown() {
    this.onShakeDice();
    return;
  }

  onDoubleTap() {
    return;
  }

  onMultiTouch(
    pointA: Nullable<PointerTouch>,
    pointB: Nullable<PointerTouch>,
    previousPinchSquaredDistance: number,
    pinchSquaredDistance: number,
    _previousMultiTouchPanPosition: Nullable<PointerTouch>,
    _multiTouchPanPosition: Nullable<PointerTouch>,
  ) {
    super.onMultiTouch(
      pointA,
      pointB,
      // 확대|축소
      previousPinchSquaredDistance,
      pinchSquaredDistance,
      // 멀티 터치 위치 안 사용하기 위해 null 처리
      null,
      null,
    );
  }
}
