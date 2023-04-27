import * as THREE from "three";
import { gsap } from "gsap";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("matCap-5.png");

const fontLoader = new FontLoader();

let text = null;
let textGeometry = null;

fontLoader.load("fonts/droid_sans_bold.typeface.json", font => {
   textGeometry = new TextGeometry("404", {
      font,
      size: 2,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4
   });

   const textMaterial = new THREE.MeshMatcapMaterial({ matcap: texture });

   text = new THREE.Mesh(textGeometry, textMaterial);
   text.geometry.center();
   //  text.position.y = 0.5;

   scene.add(text);
});

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// Set up the mousemove event listener on the container element
document.body.addEventListener("mousemove", e => {
   if (text) {
      const mouseX = e.clientX / window.innerWidth - 0.1;
      const mouseY = e.clientY / window.innerHeight - 0.1;

      // text.rotation.x = mouseY * 0.1;
      // text.rotation.y = mouseX * 0.1;

      gsap.to(text.rotation, {
         x: mouseY * Math.PI * 0.1,
         y: mouseX * Math.PI * 0.1,
         ease: "power3.inOut",
         duration: 0.5
      });
   }
});

const resizeMesh = () => {
   if (window.innerWidth > 1037) {
      text.scale.set(1, 1, 1);
   }

   if (window.innerWidth < 1037) {
      text.scale.set(0.8, 0.8, 0.8);
   }

   if (window.innerWidth < 590) {
      text.scale.set(0.5, 0.5, 0.5);
   }

   if (window.innerWidth < 400) {
      text.scale.set(0.4, 0.4, 0.4);
   }
};

window.addEventListener("resize", () => {
   sizes.width = window.innerWidth;
   sizes.height = window.innerHeight;

   camera.aspect = sizes.width / sizes.height;
   camera.updateProjectionMatrix();

   renderer.setSize(sizes.width, sizes.height);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

   if (text) {
      resizeMesh();
   }
});

const tick = () => {
   renderer.render(scene, camera);
   window.requestAnimationFrame(tick);
};

tick();

window.onload = () => {
   if (text) {
      resizeMesh();
   }
};
