import * as THREE from 'three';

let targetRotationX = 0.05;
let targetRotationY = 0.02;
let mouseX = 0, mouseY = 0;
let mouseXOnMouseDown = 0, mouseYOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const drag = 0.0002;
const slowingFactor = 0.98;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#globe")});
renderer.setSize(window.innerWidth, window.innerHeight);

// Sphere (globe)
const eMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('texture/earthmap.jpg'),
    bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpeg'),
    bumpScale: 10
  })
);
scene.add(eMesh);

// galaxy
const galaxyGeo = new THREE.SphereGeometry(1.5, 50, 100);
const sMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('texture/galaxy.jpeg'),
  side: THREE.BackSide
});

const startMesh = new THREE.Mesh(galaxyGeo, sMaterial);
scene.add(startMesh);

// Lighting
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

const pointlight = new THREE.PointLight(0xffffff, 150);
pointlight.position.set(5, 3, 5);
scene.add(pointlight);

camera.position.z = 1.6;

const latLonToXYZ = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const cambodiaCoords = latLonToXYZ(13, 75, 0.5);
const chinaCoords = latLonToXYZ(40, 100, 0.5);
const ausCoords = latLonToXYZ(-20, 50, 0.5);
const japanCoords = latLonToXYZ(38.5, 43, 0.5);;

const redDotTexture = new THREE.TextureLoader().load('texture/red-dot.png');

const redDotMaterial = new THREE.SpriteMaterial({
  map: redDotTexture,
  depthTest: false  
});

const redDot = new THREE.Sprite(redDotMaterial);
const redDot2 = new THREE.Sprite(redDotMaterial);
const redDot3 = new THREE.Sprite(redDotMaterial);
const redDot4 = new THREE.Sprite(redDotMaterial);

redDot.position.set(cambodiaCoords.x, cambodiaCoords.y, cambodiaCoords.z);
redDot.scale.set(0.05, 0.05, 0.1);  

redDot2.position.set(chinaCoords.x, chinaCoords.y, chinaCoords.z);
redDot2.scale.set(0.05, 0.05, 0.1);

redDot3.position.set(chinaCoords.x, chinaCoords.y, chinaCoords.z);
redDot3.scale.set(0.05, 0.05, 0.1);

redDot4.position.set(japanCoords.x, japanCoords.y, japanCoords.z);
redDot4.scale.set(0.05, 0.05, 0.1);

redDot.renderOrder = 1;  
redDot2.renderOrder = 1;
redDot3.renderOrder = 1;
redDot4.renderOrder = 1;

scene.add(redDot);
scene.add(redDot2)
scene.add(redDot3)
scene.add(redDot4)

function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  mouseXOnMouseDown = event.clientX - windowHalfX;
  mouseYOnMouseDown = event.clientY - windowHalfY;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  targetRotationX = (mouseX - mouseXOnMouseDown) * drag;
  targetRotationY = (mouseY - mouseYOnMouseDown) * drag;
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
}

const updateRedDotPosition = () => {
  const globeRotationMatrix = new THREE.Matrix4().makeRotationFromEuler(eMesh.rotation);  
  const transformedCoords = cambodiaCoords.clone().applyMatrix4(globeRotationMatrix);  
  const transformedCoords2 = chinaCoords.clone().applyMatrix4(globeRotationMatrix);  
  const transformedCoords3 = ausCoords.clone().applyMatrix4(globeRotationMatrix);  
  const transformedCoords4 = japanCoords.clone().applyMatrix4(globeRotationMatrix);  
  redDot.position.copy(transformedCoords);  
  redDot2.position.copy(transformedCoords2);
  redDot3.position.copy(transformedCoords3);
  redDot4.position.copy(transformedCoords4);
};


document.addEventListener('click', onDocumentClick, false);

function onDocumentClick(event) {
  // cambodia
  const vector = redDot.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
  const radius = redDot.scale.x * window.innerWidth / 2; 
  const distance = Math.sqrt(Math.pow(event.clientX - x, 2) + Math.pow(event.clientY - y, 2));

  if (distance < radius) {
    const letterDiv = document.getElementById('letter');
    letterDiv.style.display = 'block';
    letterDiv.style.display = 'flex';
    letterDiv.scrollIntoView({ behavior: 'smooth' });
    letterDiv.style.justifyContent = "center";
    letterDiv.style.alignItems = "center";
  }

  // china
  const vector2 = redDot2.position.clone().project(camera);
  const x2 = (vector2.x * 0.5 + 0.5) * window.innerWidth;
  const y2 = -(vector2.y * 0.5 - 0.5) * window.innerHeight;
  const radius2 = redDot2.scale.x * window.innerWidth / 2; 
  const distance2 = Math.sqrt(Math.pow(event.clientX - x2, 2) + Math.pow(event.clientY - y2, 2));

  if (distance2 < radius2) {
    const HobbiesDiv = document.getElementById('Hobbies');
    HobbiesDiv.style.display = 'block';
    HobbiesDiv.style.display = 'flex';
    HobbiesDiv.scrollIntoView({ behavior: 'smooth' });
    HobbiesDiv.style.justifyContent = "center";
    HobbiesDiv.style.alignItems = "center";
  }

  //australia
  const vector3 = redDot3.position.clone().project(camera);
  const x3 = (vector3.x * 0.5 + 0.5) * window.innerWidth;
  const y3 = -(vector3.y * 0.5 - 0.5) * window.innerHeight;
  const radius3 = redDot3.scale.x * window.innerWidth / 2; 
  const distance3 = Math.sqrt(Math.pow(event.clientX - x3, 2) + Math.pow(event.clientY - y3, 2));

  if (distance3 < radius3) {
    const AustraliaDiv = document.getElementById('Australia');
    AustraliaDiv.style.display = 'block';
    AustraliaDiv.style.display = 'flex';
    AustraliaDiv.scrollIntoView({ behavior: 'smooth' });
    AustraliaDiv.style.justifyContent = "center";
    AustraliaDiv.style.alignItems = "center";
    
  }

  // japan
  const vector4 = redDot4.position.clone().project(camera);
  const x4 = (vector4.x * 0.5 + 0.5) * window.innerWidth;
  const y4 = -(vector4.y * 0.5 - 0.5) * window.innerHeight;
  const radius4 = redDot4.scale.x * window.innerWidth / 2; 
  const distance4 = Math.sqrt(Math.pow(event.clientX - x4, 2) + Math.pow(event.clientY - y4, 2));

  if (distance4 < radius4) {
    const JapanDiv = document.getElementById('Japan');
    JapanDiv.style.display = 'block';
    JapanDiv.style.display = 'flex';
    JapanDiv.scrollIntoView({ behavior: 'smooth' });
  }

}

// Animation 
const animate = () => {
  eMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX / 2);
  eMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY / 2);
  targetRotationX *= slowingFactor;
  targetRotationY *= slowingFactor;

  updateRedDotPosition();  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

document.addEventListener('mousedown', onDocumentMouseDown, false);
