// ThreeScene.js

import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';

export class ThreeScene {
  constructor(container) {
    this.container = container;

    // Create a scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333); // Set the background color to dark grey

    // Create a camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Create a renderer with antialiasing
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // Create ArcballControls
    this.controls = new ArcballControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false; // Disable translation/panning

    // Set the scene rotation for isometric view
    this.scene.rotation.x = Math.PI / 6; // Rotate about the x-axis
    this.scene.rotation.y = Math.PI / 4; // Rotate about the y-axis

    // Create a cube geometry
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Create a cube material
    this.cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Initialize an empty 3x3x3 grid
    this.grid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => false)
      )
    );

    // Create cubes with thick dark outlines based on the grid
    this.createCubesWithOutlines();

    // Create a point light
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(5, 5, 5);
    this.scene.add(this.pointLight);

    // Animation loop
    this.animate();
  }

  // Method to set the cube grid based on a 3x3x3 array of boolean values
  setCubeGrid(cubeGrid) {
    if (
      cubeGrid.length === 3 &&
      cubeGrid.every((layer) => layer.length === 3) &&
      cubeGrid.every((layer) => layer.every((row) => row.length === 3))
    ) {
      this.grid = cubeGrid;
    } else {
      console.error('Invalid cubeGrid. Please provide a 3x3x3 array of booleans.');
    }
  }

  // Method to create cubes with thick dark outlines based on the grid
  createCubesWithOutlines() {
    // Remove existing cubes from the scene
    this.scene.children = this.scene.children.filter(
      (child) => !(child instanceof THREE.Mesh)
    );
    // Remove existing edge geometries from the scene
    const edgeGeometries = this.scene.children.filter(
      (child) => child instanceof THREE.LineSegments
    );
    edgeGeometries.forEach((edgeGeometry) => {
      this.scene.remove(edgeGeometry);
    });

    // Create cubes based on the grid
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          if (this.grid[y][z][x]) {
            const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
            cube.position.set(x - 1, y - 1, z - 1);
            this.scene.add(cube);

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

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update controls
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  setCubeColor(_color) {
    this.cubeMaterial = new THREE.MeshBasicMaterial({ color: _color });
  }

}
