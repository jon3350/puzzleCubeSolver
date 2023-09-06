// MultiColorThreeScene.js
import * as THREE from 'three';
import { ThreeScene } from './threeScene';

export class MultiColorThreeScene extends ThreeScene {
  constructor(container) {
    super(container);

    // Initialize an empty 3x3x3 grid with default color
    this.grid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => 0x00ff00)
      )
    );

    // Create cubes with thick dark outlines based on the grid
    this.createCubesWithOutlines();
  }

  // Method to set the cube grid based on a 3x3x3 array of colors
  setColors(colors) {
    if (
      colors.length === 3 &&
      colors.every((layer) => layer.length === 3) &&
      colors.every((layer) => layer.every((row) => row.length === 3))
    ) {
      this.grid = colors;
      // Recreate cubes with updated colors
      this.createCubesWithOutlines();
    } else {
      console.error('Invalid colors array. Please provide a 3x3x3 array of colors.');
    }
  }

  // Method to create cubes with thick dark outlines based on the grid
  createCubesWithOutlines() {
    // Remove existing cubes and edge geometries from the scene
    this.scene.children = this.scene.children.filter(
      (child) => !(child instanceof THREE.Mesh) && !(child instanceof THREE.LineSegments)
    );

    // Create cubes based on the grid
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const color = this.grid[x][y][z];
          const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
          const cubeMaterial = new THREE.MeshBasicMaterial({ color });
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(x - 1, y - 1, z - 1);
          this.scene.add(cube);


          //THIS MIGHT NOT BE NEEDED SINCE THE EDGES SHOULD ALWAYS BE FILLED (Works if you delete it)
            // Create edges geometry
            const edges = new THREE.EdgesGeometry(this.cubeGeometry);
            const edgesMaterial = new THREE.LineBasicMaterial({
              color: 0x000000, // Set outline color to black
              linewidth: 5, // Adjust line width for thick outline
            });
            const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
            edgesMesh.position.set(x - 1, y - 1, z - 1);
            this.scene.add(edgesMesh);
        }
      }
    }
  }
}