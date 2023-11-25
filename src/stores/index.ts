import {create} from 'zustand';
import {Scene} from '@babylonjs/core/scene';
import {Engine, Mesh, Nullable} from '@babylonjs/core';
import {Camera} from '@babylonjs/core/Cameras/camera';
import BottomSheet from '@gorhom/bottom-sheet';
import {minDiceCount} from '../babylon/consts';

interface BabylonStore {
  engine: Nullable<Engine>;
  setEngine: (engine: Nullable<Engine> | undefined) => void;
  scene: Nullable<Scene>;
  setScene: (scene: Nullable<Scene>) => void;
  camera: Camera | any;
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

interface AppStore {
  diceCount: number;
  setDiceCount: (diceCount: number) => void;
  history: Object;
  setHistory: (count: number) => void;
  clearHistory: () => void;
}
// @ts-ignore
export const useAppStore = create<AppStore>(set => ({
  diceCount: minDiceCount,
  setDiceCount: diceCount => set({diceCount}),
  history: [],
  setHistory: count =>
    set({history: {...useAppStore.getState().history, [Date.now()]: count}}),
  clearHistory: () => set({history: {}}),
}));

interface BottomSheetStore {
  settingBottomSheet: Nullable<BottomSheet>;
  setSettingBottomSheet: (settingBottomSheet: Nullable<BottomSheet>) => void;
}
export const useBottomSheetStore = create<BottomSheetStore>(set => ({
  settingBottomSheet: null,
  setSettingBottomSheet: settingBottomSheet => set({settingBottomSheet}),
}));
