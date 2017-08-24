'use strict';

const TERRAIN_SIZE = 1000; // In meters / units
const TERRAIN_SEGMENTS = 32; // Must be 2^n
const TERRAIN_SCALE_FACTOR = 4;
const TERRAIN_REAL_SIZE = TERRAIN_SIZE * TERRAIN_SCALE_FACTOR;
const TERRAIN_SIDE_VERTICES = TERRAIN_SEGMENTS + 1;

const TERRAIN_INITIAL_ELEVATION = 200;
const TERRAIN_DAMPING_FACTOR = 0.9;

const NUM_HIKERS = 100;
const HIKER_MOVE_PERIOD = 800; // In ms
const HIKER_SPEED = 25; // In units per move period

//const GRAVITY = 2; // In units / sec

const AFRAME = window.AFRAME;
const THREE = window.THREE;

const Raycaster = new THREE.Raycaster();
const DIRECTION_DOWN = new THREE.Vector3(0,-1,0);

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
 * The diamond pass of the diamond-square algorithm
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
         TERRAIN_INITIAL_ELEVATION);

}

function intersectTerrain(position) {
  Raycaster.set(position, DIRECTION_DOWN);
  Raycaster.near = 10;
  Raycaster.far = 4000;
  return Raycaster.intersectObject(document.getElementById('terrain').getObject3D('mesh'));
}

/**
 * Hikers helpers
 *
 */
function generateHikers(scene) {
  for (let i = 0; i < NUM_HIKERS; i++) {
    let hiker = document.createElement('a-entity');
    hiker.setAttribute('hiker','');
    hiker.setAttribute('scale', '10 10 10');
    hiker.setAttribute('position', {
      x: Math.floor((Math.random() * TERRAIN_REAL_SIZE) - (TERRAIN_REAL_SIZE/2)),
      y: 400, // NOTE: This must be *above* the terrain, will be updated when
               // the hiker is created to be just above ground
      z: Math.floor((Math.random() * TERRAIN_REAL_SIZE) - (TERRAIN_REAL_SIZE/2)),
    });
    scene.appendChild(hiker);
  }
}

/*************************************
 *
 * Components
 *
 *
 *************************************/

function registerComponents() {
  //
  // Terrain
  //
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

  //
  // Ship
  //
  AFRAME.registerComponent('ship', {
    schema: {
      speed: {type: 'number', default: 1},
    },
    init: function() {
      this.directionVec3 = new THREE.Vector3();
      this.camera = document.querySelector('a-camera');
    },
    tick: function(time, timeDelta) {
      let speed = this.data.speed * (timeDelta / 1000);
      let cameraRotation = this.camera.object3D.getWorldDirection();
      this.el.object3D.position.add(cameraRotation.multiplyScalar(-speed));
    },
  });

  //
  // Hiker
  //

  AFRAME.registerComponent('hiker', {
    init: function() {
      let hair = document.createElement('a-box');
      hair.setAttribute('position', '0 0 0');
      hair.setAttribute('color' , '#B17521');
      hair.setAttribute('scale', '1 0.4 1');
      this.el.appendChild(hair);

      let head = document.createElement('a-box');
      head.setAttribute('position', '0 -0.6 0');
      head.setAttribute('color', '#DBA96F');
      this.el.appendChild(head);

      let body = document.createElement('a-box');
      body.setAttribute('position', '0 -2 0');
      body.setAttribute('color', '#61CC4A');
      body.setAttribute('scale', '1 2 1');
      this.el.appendChild(body);

      let position = this.el.getAttribute('position');
      let terrainIntersection = intersectTerrain(position);
      this.el.setAttribute('position', {
        x: position.x,
        y: terrainIntersection[0].point.y + 31,
        z: position.z,
      });

      this.direction = new THREE.Vector3(Math.random(), 0, Math.random());
      this.timeSinceLastMove = 0;
    },

    // TODO: Update the y component so that it adapts to the terrain elevation
    tick: function(time, timeDelta) {
      this.timeSinceLastMove += timeDelta;
      if (this.timeSinceLastMove > HIKER_MOVE_PERIOD) {
        this.timeSinceLastMove = 0;
        let position = this.el.getAttribute('position');
        let newPosition = new THREE.Vector3(
          position.x + (this.direction.x * HIKER_SPEED),
          1000, // High enough so we can calculate the terrain intersection with a downwards ray
          position.z + (this.direction.z * HIKER_SPEED)
        );
        let terrainIntersection = intersectTerrain(newPosition);

        if (terrainIntersection.length === 0) {
          console.log('INVALID INTERSECTION', newPosition)
          this.el.parentNode.removeChild(this.el);
          return;
        }
        this.el.setAttribute('position', {
          x: terrainIntersection[0].point.x,
          y: terrainIntersection[0].point.y + 31,
          z: terrainIntersection[0].point.z,
        });
      }
    },
  });


}

/*************************************
 *
 * Main game functions
 *
 *
 *************************************/

(function() {


  registerComponents();

  window.onload = function() {

    let scene = document.querySelector('a-scene');

    // Generate terrain
    let terrain = document.createElement('a-entity');
    terrain.setAttribute('id', 'terrain');
    terrain.setAttribute('terrain', {size: TERRAIN_SIZE});
    terrain.setAttribute('position', '0 10 0');

    scene.appendChild(terrain);

    // Position ship

    // Generate hikers
    // FIXME: This is hacky, but we need to make sure the terrain has been
    // created and attached to the scene
    setTimeout(() => generateHikers(scene), 100);

  };

})();
