'use strict';

const TERRAIN_SIZE = 1000; // In meters / units
const TERRAIN_SEGMENTS = 32; // Must be 2^n
const TERRAIN_SCALE_FACTOR = 4;
const TERRAIN_SIDE_VERTICES = TERRAIN_SEGMENTS + 1;

const TERRAIN_INITIAL_DAMPING = 200;
const TERRAIN_DAMPING_FACTOR = 0.9;

const AFRAME = window.AFRAME;
const THREE = window.THREE;

/**** Terrain generation ******/

const rr = () => Math.random() * Math.random();
const coordsToIndex = (x,y) => {
  return ((x + TERRAIN_SIDE_VERTICES) % TERRAIN_SIDE_VERTICES) +
    (TERRAIN_SIDE_VERTICES * ((y + TERRAIN_SIDE_VERTICES) % TERRAIN_SIDE_VERTICES));
};

/**
 * Calculate the average of the z-values of four vertices, then add the
 * elevation multiplied by a random number
 */
function averagePoints(vertices, tl, tr, bl, br, elevation) {
  let sum = vertices[tl].z + vertices[tr].z + vertices[bl].z + vertices[br].z;
  return (sum / 4) + rr() * elevation;
}

var diamond; // Just to avoid a JSHint warning

/**
 * The recursive square pass of the diamond-square algorithm.
 */
function square(vertices, tx, ty, bx, by, elevation) {

  let half = (bx - tx) / 2;

  if (half < 1) return;

  let middleX = tx + half;
  let middleY = ty + half;

  let middle = coordsToIndex(middleX, middleY);
  let tl = coordsToIndex(tx, ty);
  let tr = coordsToIndex(bx, ty);
  let bl = coordsToIndex(tx, by);
  let br = coordsToIndex(bx, by);

  vertices[middle].z = averagePoints(vertices, tl, tr, bl, br, elevation);

  elevation *= TERRAIN_DAMPING_FACTOR;

  // top diamond
  diamond(vertices, tx, ty, middleX, ty - half, elevation);
  // right diamond
  diamond(vertices, middleX, middleY, bx, ty, elevation);
  // bottom diamond
  diamond(vertices, tx, by, middleX, middleY, elevation);
  // left diamond
  diamond(vertices, tx - half, middleY, tx, ty, elevation);

  // Squares again
  elevation *= TERRAIN_DAMPING_FACTOR;

  // top left square
  square(vertices, tx, ty, tx + half, ty + half, elevation);
  // top right square
  square(vertices, tx + half, ty, bx, ty + half, elevation);
  // bottom left square
  square(vertices, tx, ty + half, tx + half, by, elevation);
  // bottom right square
  square(vertices, tx + half, ty + half, bx, by, elevation);
}

/**
 * The diamon pass of the diamon-square algorithm
 */
function diamond(vertices, lx, ly, tx, ty, elevation) {
  let dist = tx - lx;

  let middleX = tx;
  let middleY = ly;
  let middle = coordsToIndex(middleX, middleY);

  let l = coordsToIndex(lx, ly);
  let t = coordsToIndex(tx, ty);
  let r = coordsToIndex(middleX + dist, ly);
  let b = coordsToIndex(middleX, middleY + dist);

  vertices[middle].z = averagePoints(vertices, l, t, r, b, elevation);

  elevation += TERRAIN_DAMPING_FACTOR;
}

/**
 * Assign z values to the vertex list using the diamond-square algorithm
 */
function generateTerrain(vertices) {
  // Initialize corner values

  square(vertices,
         0, 0, // top
         TERRAIN_SIDE_VERTICES - 1, TERRAIN_SIDE_VERTICES - 1, // bottom
         TERRAIN_INITIAL_DAMPING);

}

/*************************************
 *
 * Main game functions
 *
 *
 *************************************/

(function() {

    // Create terrain
    AFRAME.registerComponent('terrain', {
      schema: {
        size: {type: 'number', default: 1},
      },
      init: function() {
        let data = this.data;
        let el = this.el;

        this.geometry = new THREE.PlaneGeometry(data.size, data.size,
                                                TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);

        generateTerrain(this.geometry.vertices);

        this.geometry.rotateX(-Math.PI/2);

        this.material = new THREE.MeshPhongMaterial({
          color: 0x7d4745,
          shading: THREE.FlatShading,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(TERRAIN_SCALE_FACTOR,1,TERRAIN_SCALE_FACTOR);
        el.setObject3D('mesh', this.mesh);
      }

    });


  window.onload = function() {

    let scene = document.getElementById('scene');

    let terrain = document.createElement('a-entity');
    terrain.setAttribute('terrain', `size: ${TERRAIN_SIZE}`);
    terrain.setAttribute('position', {x: 0, y: -10,z: 0});

    scene.appendChild(terrain);
  };

})();
