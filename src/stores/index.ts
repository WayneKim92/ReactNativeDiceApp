import {create} from 'zustand';
import {Scene} from '@babylonjs/core/scene';
import {Engine, Mesh, Nullable} from '@babylonjs/core';
import {Camera} from '@babylonjs/core/Cameras/camera';

interface BabylonStore {
  engine: Nullable<Engine>;
  setEngine: (engine: Nullable<Engine> | undefined) => void;
  scene: Nullable<Scene>;
  setScene: (scene: Nullable<Scene>) => void;
  camera: Nullable<Camera>;
  setCamera: (camera: Nullable<Camera>) => void;
  diceMesh: Nullable<Mesh>;
  setDiceMesh: (diceMesh: Nullable<Mesh>) => void;
}
export const useBabylonStore = create<BabylonStore>(set => ({
  engine: null,
  setEngine: engine => set({engine}),
  scene: null,
  setScene: scene => set({scene}),
  camera: null,
  setCamera: camera => set({camera}),
  diceMesh: null,
  setDiceMesh: diceMesh => set({diceMesh}),
}));
