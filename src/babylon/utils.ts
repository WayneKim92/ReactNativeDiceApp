import {Mesh} from '@babylonjs/core';

export function randomNegativeOrPositiveOne() {
  return Math.floor(Math.random() * 2) === 0 ? -1 : 1;
}

export const setMeshTransparency = (mesh: Mesh) => {
  // Set the visibility of the wall
  mesh.visibility = 0;
};
