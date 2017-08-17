'use strict';

const TERRAIN_SIZE = 100; // In meters / units
const TERRAIN_SEGMENTS = 10;

const AFRAME = window.AFRAME;
const THREE = window.THREE;

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

        this.geometry.rotateX(-Math.PI/2);

        //this.material = new THREE.MeshStandardMaterial({color: 0xff0000});
        this.material = new THREE.MeshPhongMaterial({
          color: 0x000000,
          wireframe: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(5,1,5);
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
