'use strict';

const TERRAIN_SIZE = 1000; // In meters / units
const TERRAIN_SEGMENTS = 32; // Must be 2^n
const TERRAIN_SCALE_FACTOR = 4;
const TERRAIN_SIDE_VERTICES = TERRAIN_SEGMENTS + 1;

//const TERRAIN_VERTICES = TERRAIN_SIDE_VERTICES * TERRAIN_SIDE_VERTICES;
const TERRAIN_INITIAL_DAMPING = 200;
const TERRAIN_DAMPING_FACTOR = 0.9;

const AFRAME = window.AFRAME;
const THREE = window.THREE;

const rr = () => Math.random() * Math.random();
const coordsToIndex = (x,y) => {
  return ((x + TERRAIN_SIDE_VERTICES) % TERRAIN_SIDE_VERTICES) +
    (TERRAIN_SIDE_VERTICES * ((y + TERRAIN_SIDE_VERTICES) % TERRAIN_SIDE_VERTICES));
};


function averagePoints(vertices, tl, tr, bl, br, damping) {
  let sum = vertices[tl].z + vertices[tr].z + vertices[bl].z + vertices[br].z;
  return (sum / 4) + rr() * damping;
}

var diamond; // Just to avoid a JSHint warning

function square(vertices, tx, ty, bx, by, damping) {

  let half = (bx - tx) / 2;

  if (half < 1) return;

  let middleX = tx + half;
  let middleY = ty + half;

  let middle = coordsToIndex(middleX, middleY);
  let tl = coordsToIndex(tx, ty);
  let tr = coordsToIndex(bx, ty);
  let bl = coordsToIndex(tx, by);
  let br = coordsToIndex(bx, by);

  // console.log('middle',tl,tr,bl,br);
  // console.log('avg', averagePoints(vertices, tl, tr, bl, br));
  vertices[middle].z = averagePoints(vertices, tl, tr, bl, br, damping);

  damping *= TERRAIN_DAMPING_FACTOR;

  // top diamond
  diamond(vertices, tx, ty, middleX, ty - half, damping);
  // right diamond
  diamond(vertices, middleX, middleY, bx, ty, damping);
  // bottom diamond
  diamond(vertices, tx, by, middleX, middleY, damping);
  // left diamond
  diamond(vertices, tx - half, middleY, tx, ty, damping);

  // Squares again
  damping *= TERRAIN_DAMPING_FACTOR;

  // top left square
  square(vertices, tx, ty, tx + half, ty + half, damping);
  // top right square
  square(vertices, tx + half, ty, bx, ty + half, damping);
  // bottom left square
  square(vertices, tx, ty + half, tx + half, by, damping);
  // bottom right square
  square(vertices, tx + half, ty + half, bx, by, damping);
}

function diamond(vertices, lx, ly, tx, ty, damping) {
  let dist = tx - lx;

  let middleX = tx;
  let middleY = ly;
  let middle = coordsToIndex(middleX, middleY);

  let l = coordsToIndex(lx, ly);
  let t = coordsToIndex(tx, ty);
  let r = coordsToIndex(middleX + dist, ly);
  let b = coordsToIndex(middleX, middleY + dist);

  vertices[middle].z = averagePoints(vertices, l, t, r, b, damping);

  damping += TERRAIN_DAMPING_FACTOR;
}

function diamondSquare(vertices) {
  // Initialize corner values

  square(vertices,
         0, 0, // top
         TERRAIN_SIDE_VERTICES - 1, TERRAIN_SIDE_VERTICES - 1, // bottom
         TERRAIN_INITIAL_DAMPING);

}

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

        diamondSquare(this.geometry.vertices);

        this.geometry.rotateX(-Math.PI/2);

        this.material = new THREE.MeshPhongMaterial({
          color: 0x7d4745,
          shading: THREE.FlatShading,
        });
        //this.material = new THREE.MeshPhongMaterial({
        //  color: 0x00ff88,
          //wireframe: true
        //});

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
