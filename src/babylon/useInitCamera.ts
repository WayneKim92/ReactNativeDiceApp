import {useEffect} from 'react';
import {
  ArcRotateCameraPointersInput,
  Color3,
  MeshBuilder,
  PhysicsImpostor,
  StandardMaterial,
} from '@babylonjs/core';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {useBabylonStore} from '../stores';

export const useInitCamera = () => {
  const {scene, setCamera} = useBabylonStore();

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
    }
  }, [scene, setCamera]);
};

class CustomArcRotateCameraPointersInput extends ArcRotateCameraPointersInput {
  onTouch(): void {
    // 아무 것도 하지 않기
    return;
  }

  onDoubleTap() {
    // super.onDoubleTap();

    return;
  }
}
