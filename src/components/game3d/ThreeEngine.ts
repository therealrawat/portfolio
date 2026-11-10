import * as THREE from 'three';
import { STATIONS, DATA_CORES, type StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';

export type ActionType = 'pickup' | 'throw' | 'enter_rover' | 'exit_rover';

export interface ActionPrompt {
  type: ActionType;
  label: string;
  key: string;
}

export interface EngineCallbacks {
  onNearbyStation: (station: StationData | null) => void;
  onCollectCore: (coreId: number, totalCollected: number) => void;
  onSpeedChange: (speed: number) => void;
  onPlayerState?: (x: number, z: number, rotation: number) => void;
  onTeleportState?: (isTeleporting: boolean) => void;
  onActionPrompt?: (prompt: ActionPrompt | null) => void;
  onDriveState?: (isDriving: boolean) => void;
}

export type PropType = 'cube' | 'sphere' | 'cylinder' | 'pyramid';

export interface InteractiveProp {
  id: number;
  type: PropType;
  name: string;
  group: THREE.Group;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  radius: number;
  height: number;
  mass: number;
  restitution: number;
  friction: number;
  baseColor: number;
}

interface DrivableRover {
  group: THREE.Group;
  body: THREE.Mesh;
  frontWheels: THREE.Group[];
  rearWheels: THREE.Mesh[];
  headlights: THREE.SpotLight[];
  thrusterLight: THREE.PointLight;
  shadow: THREE.Mesh;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  steerAngle: number;
  speed: number;
}

interface BoostPad {
  mesh: THREE.Group;
  pos: THREE.Vector3;
  direction: THREE.Vector3;
  cooldown: number;
}

interface TrailParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

export class ThreeEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;

  // Three.js Core
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Player / Cyber Explorer Character
  public playerGroup: THREE.Group;
  private characterRoot: THREE.Group;
  private torsoGroup: THREE.Group;
  private headGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;
  private thrusterGlow: THREE.PointLight;
  private contactShadow: THREE.Mesh;
  private playerVelocity = new THREE.Vector3();
  private playerRotation = 0;
  private isBoosting = false;
  private isOverdrive = false;
  private isJumping = false;
  private verticalVelocity = 0;
  private gravity = 22;
  private walkCycle = 0;
  private prevStepSin = 0;
  private gestureTimer = 0;

  // Click to move target
  private targetDestination: THREE.Vector3 | null = null;
  private destinationMarker: THREE.Group | null = null;

  // Controls state
  private keysPressed: Record<string, boolean> = {};
  private joystickVector = { x: 0, y: 0 };

  // World objects
  private stationMeshes: { data: StationData; group: THREE.Group; beacon: THREE.Mesh; light: THREE.PointLight; platformRing: THREE.Mesh }[] = [];
  private coreMeshes: { id: number; mesh: THREE.Group; collected: boolean }[] = [];
  private collectedCoreIds = new Set<number>();
  private particles!: THREE.Points;
  private gridHelper!: THREE.GridHelper;

  // Realistic Diverse Interactive Elements & Carrying System
  private interactiveProps: InteractiveProp[] = [];
  public heldProp: InteractiveProp | null = null;
  private currentActionPrompt: ActionPrompt | null = null;

  // Drivable Cyber Rover Vehicle
  public isDrivingRover = false;
  private rover!: DrivableRover;
  private roverDockPad!: THREE.Group;
  private boostPads: BoostPad[] = [];
  private trailParticles: TrailParticle[] = [];
  private trailPoints!: THREE.Points;
  private trailPositions!: Float32Array;

  // Shockwave ring
  private shockwaveRing: THREE.Mesh | null = null;
  private shockwaveActive = false;
  private shockwaveRadius = 0;

  // Quantum Teleportation System
  public isTeleporting = false;
  private teleportProgress = 0;
  private teleportTarget: { x: number; z: number; rotation: number } | null = null;
  private teleportGroup!: THREE.Group;
  private teleportBeam!: THREE.Mesh;
  private teleportRings: THREE.Mesh[] = [];
  private teleportLight!: THREE.PointLight;
  private hasTriggeredWarpAudio = false;
  private hasTriggeredLandAudio = false;

  // Proximity tracking
  private currentNearbyStation: StationData | null = null;

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private groundPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070605);
    this.scene.fog = new THREE.FogExp2(0x070605, 0.016);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 250);
    this.camera.position.set(0, 6.5, 14.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.7);
    dirLight.position.set(25, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);

    // 5. Build Environment (Terrain, pathways, boundary)
    this.buildEnvironment();

    // 6. Build Player Character (Cyber Explorer)
    const {
      group,
      characterRoot,
      torsoGroup,
      headGroup,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      thrusterLight,
      shadow,
    } = this.buildHumanCharacter();
    this.playerGroup = group;
    this.characterRoot = characterRoot;
    this.torsoGroup = torsoGroup;
    this.headGroup = headGroup;
    this.leftArmGroup = leftArmGroup;
    this.rightArmGroup = rightArmGroup;
    this.leftLegGroup = leftLegGroup;
    this.rightLegGroup = rightLegGroup;
    this.thrusterGlow = thrusterLight;
    this.contactShadow = shadow;
    this.scene.add(this.playerGroup);

    // 7. Build Stations & Gateway Portals
    this.buildStations();

    // 8. Build Collectible Cores
    this.buildDataCores();

    // 9. Build Drivable Rover & Charging Pad
    this.buildDrivableRover();

    // 10. Build Diverse Interactive Props & Launch Pads
    this.buildDiverseInteractiveProps();
    this.buildLaunchPads();

    // 10. Particle Exhaust & Skid Trail System
    this.buildParticleTrails();

    // 11. Shockwave Effect Mesh
    this.buildShockwaveMesh();

    // 12. Destination Click Marker
    this.destinationMarker = this.buildDestinationMarker();
    if (this.destinationMarker) {
      this.scene.add(this.destinationMarker);
    }

    // 13. Floating Atmospheric Embers
    this.particles = this.buildAtmosphericParticles();
    this.scene.add(this.particles);

    // 14. Quantum Teleportation Portal Beam & Rings
    this.buildTeleportFX();

    // 15. Event listeners & Audio startup
    this.bindEvents();

    // 16. Start animation loop
    this.animate();
  }

  // --- Environment Construction ---
  private buildEnvironment() {
    // Large Main Ground Disc
    const floorGeo = new THREE.CircleGeometry(58, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a08,
      roughness: 0.82,
      metalness: 0.25,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Primary Cyber Grid
    this.gridHelper = new THREE.GridHelper(116, 58, 0xf97316, 0x24170d);
    this.gridHelper.position.y = 0.01;
    this.scene.add(this.gridHelper);

    // 4 Architectural Runway Highways connecting Center to Sectors
    const runwayWidth = 4.2;
    const runwayLength = 54;
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x140f0b,
      roughness: 0.5,
      metalness: 0.6,
    });

    // North-South Highway
    const nsHighway = new THREE.Mesh(new THREE.PlaneGeometry(runwayWidth, runwayLength), runwayMat);
    nsHighway.rotation.x = -Math.PI / 2;
    nsHighway.position.set(0, 0.02, 0);
    nsHighway.receiveShadow = true;
    this.scene.add(nsHighway);

    // East-West Highway
    const ewHighway = new THREE.Mesh(new THREE.PlaneGeometry(runwayLength, runwayWidth), runwayMat);
    ewHighway.rotation.x = -Math.PI / 2;
    ewHighway.position.set(0, 0.02, 0);
    ewHighway.receiveShadow = true;
    this.scene.add(ewHighway);

    // Neon Highway Guide Lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf97316, opacity: 0.6, transparent: true });
    [-1.8, 1.8].forEach((offset) => {
      // NS lines
      const nsLine = new THREE.Mesh(new THREE.PlaneGeometry(0.08, runwayLength), lineMat);
      nsLine.rotation.x = -Math.PI / 2;
      nsLine.position.set(offset, 0.025, 0);
      this.scene.add(nsLine);

      // EW lines
      const ewLine = new THREE.Mesh(new THREE.PlaneGeometry(runwayLength, 0.08), lineMat);
      ewLine.rotation.x = -Math.PI / 2;
      ewLine.position.set(0, 0.025, offset);
      this.scene.add(ewLine);
    });

    // Outer Boundary Glow Ring
    const ringGeo = new THREE.RingGeometry(57.5, 58.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const boundaryRing = new THREE.Mesh(ringGeo, ringMat);
    boundaryRing.rotation.x = -Math.PI / 2;
    boundaryRing.position.y = 0.05;
    this.scene.add(boundaryRing);

    // Perimeter boundary pillars & beacons
    const pillarCount = 28;
    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.8, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x221810,
      emissive: 0xea580c,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });

    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const x = Math.cos(angle) * 57.5;
      const z = Math.sin(angle) * 57.5;
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 1.4, z);
      this.scene.add(pillar);

      // Tip beacon sphere
      const tipGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0xfb923c });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(x, 2.9, z);
      this.scene.add(tip);
    }
  }

  // --- Cyber Explorer Humanoid Character Construction ---
  private buildHumanCharacter() {
    const group = new THREE.Group();
    group.position.set(0, 0, 6);

    // Contact shadow underneath feet
    const shadowGeo = new THREE.CircleGeometry(0.7, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    // Root node for character kinematics (bobbing, banking, stance)
    const characterRoot = new THREE.Group();
    group.add(characterRoot);

    // High-tech suit materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x14100d,
      roughness: 0.45,
      metalness: 0.65,
    });
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x221812,
      roughness: 0.25,
      metalness: 0.85,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xf97316,
      emissiveIntensity: 0.4,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x070503,
      emissive: 0xf97316,
      emissiveIntensity: 0.95,
      roughness: 0.1,
      metalness: 0.95,
    });

    // 1. Pelvis / Utility Belt (at hip height ~0.88)
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.32), armorMat);
    pelvis.position.y = 0.88;
    pelvis.castShadow = true;
    characterRoot.add(pelvis);

    const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.04), glowMat);
    beltBuckle.position.set(0, 0.88, -0.17);
    characterRoot.add(beltBuckle);

    // 2. Torso Group (Pivoting at waist)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.96, 0);
    characterRoot.add(torsoGroup);

    // Main Chest Armor
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.54, 0.36), armorMat);
    chest.position.set(0, 0.27, 0);
    chest.castShadow = true;
    torsoGroup.add(chest);

    // Inner Tech Body Suit
    const underSuit = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.5, 0.32), suitMat);
    underSuit.position.set(0, 0.25, 0);
    torsoGroup.add(underSuit);

    // Arc Reactor / Power Core (Chest Emblem)
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16), glowMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.32, -0.185);
    torsoGroup.add(core);

    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 16), accentMat);
    coreRing.position.set(0, 0.32, -0.18);
    torsoGroup.add(coreRing);

    // Jetpack Unit on back
    const jetpackBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.18), armorMat);
    jetpackBody.position.set(0, 0.28, 0.23);
    jetpackBody.castShadow = true;
    torsoGroup.add(jetpackBody);

    // Dual Micro-Thruster Nozzles
    [-0.12, 0.12].forEach((offset) => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.16, 12), accentMat);
      nozzle.position.set(offset, 0.08, 0.26);
      torsoGroup.add(nozzle);

      const nozzleGlow = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), glowMat);
      nozzleGlow.rotation.x = Math.PI / 2;
      nozzleGlow.position.set(offset, 0.0, 0.26);
      torsoGroup.add(nozzleGlow);
    });

    const thrusterLight = new THREE.PointLight(0xf97316, 2.2, 5.5);
    thrusterLight.position.set(0, 0.06, 0.32);
    torsoGroup.add(thrusterLight);

    // Forward Spotlight / Headlamp from shoulder
    const headlampTarget = new THREE.Object3D();
    headlampTarget.position.set(0, 0.2, -8);
    torsoGroup.add(headlampTarget);

    const shoulderLight = new THREE.SpotLight(0xffedd5, 3.2, 20, Math.PI / 5, 0.4);
    shoulderLight.position.set(0.24, 0.54, -0.12);
    shoulderLight.target = headlampTarget;
    torsoGroup.add(shoulderLight);

    // 3. Head Group (Pivoting at neck)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.56, 0);
    torsoGroup.add(headGroup);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.12, 12), suitMat);
    neck.position.set(0, 0.05, 0);
    headGroup.add(neck);

    // Cyber Helmet
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.38), armorMat);
    helmet.position.set(0, 0.23, -0.02);
    helmet.castShadow = true;
    headGroup.add(helmet);

    // Curved Panoramic Cyber Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.16), visorMat);
    visor.position.set(0, 0.24, -0.18);
    headGroup.add(visor);

    // Helmet Crest Stripe
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.32), accentMat);
    crest.position.set(0, 0.42, -0.02);
    headGroup.add(crest);

    // Side Earpiece Sensors
    [-0.19, 0.19].forEach((offset) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), accentMat);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(offset, 0.23, -0.02);
      headGroup.add(ear);
    });

    // 4. Arms (Pivoting at shoulders)
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 0.5, 0);
    torsoGroup.add(leftArmGroup);

    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), armorMat);
    leftArmGroup.add(leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.26, 0.13), suitMat);
    leftUpperArm.position.set(-0.02, -0.13, 0);
    leftArmGroup.add(leftUpperArm);

    const leftGauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.24, 0.15), armorMat);
    leftGauntlet.position.set(-0.02, -0.36, 0);
    leftGauntlet.castShadow = true;
    leftArmGroup.add(leftGauntlet);

    const leftFist = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), suitMat);
    leftFist.position.set(-0.02, -0.5, 0);
    leftArmGroup.add(leftFist);

    // Right Arm (Equipped with Kinetic Repulsor Gauntlet)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 0.5, 0);
    torsoGroup.add(rightArmGroup);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), armorMat);
    rightArmGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.26, 0.13), suitMat);
    rightUpperArm.position.set(0.02, -0.13, 0);
    rightArmGroup.add(rightUpperArm);

    const rightGauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.16), armorMat);
    rightGauntlet.position.set(0.02, -0.36, 0);
    rightGauntlet.castShadow = true;
    rightArmGroup.add(rightGauntlet);

    const repulsorCore = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), glowMat);
    repulsorCore.position.set(0.02, -0.36, -0.085);
    rightArmGroup.add(repulsorCore);

    const rightFist = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), suitMat);
    rightFist.position.set(0.02, -0.5, 0);
    rightArmGroup.add(rightFist);

    // 5. Legs (Pivoting at hips)
    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.17, 0.88, 0);
    characterRoot.add(leftLegGroup);

    const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.38, 0.18), suitMat);
    leftThigh.position.set(0, -0.19, 0);
    leftThigh.castShadow = true;
    leftLegGroup.add(leftThigh);

    const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.08), armorMat);
    leftKnee.position.set(0, -0.38, -0.09);
    leftLegGroup.add(leftKnee);

    const leftShin = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), suitMat);
    leftShin.position.set(0, -0.56, 0);
    leftShin.castShadow = true;
    leftLegGroup.add(leftShin);

    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.28), armorMat);
    leftBoot.position.set(0, -0.8, -0.04);
    leftBoot.castShadow = true;
    leftLegGroup.add(leftBoot);

    const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.28), glowMat);
    leftSole.position.set(0, -0.87, -0.04);
    leftLegGroup.add(leftSole);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.17, 0.88, 0);
    characterRoot.add(rightLegGroup);

    const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.38, 0.18), suitMat);
    rightThigh.position.set(0, -0.19, 0);
    rightThigh.castShadow = true;
    rightLegGroup.add(rightThigh);

    const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.08), armorMat);
    rightKnee.position.set(0, -0.38, -0.09);
    rightLegGroup.add(rightKnee);

    const rightShin = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.17), suitMat);
    rightShin.position.set(0, -0.56, 0);
    rightShin.castShadow = true;
    rightLegGroup.add(rightShin);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.28), armorMat);
    rightBoot.position.set(0, -0.8, -0.04);
    rightBoot.castShadow = true;
    rightLegGroup.add(rightBoot);

    const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.28), glowMat);
    rightSole.position.set(0, -0.87, -0.04);
    rightLegGroup.add(rightSole);

    return {
      group,
      characterRoot,
      torsoGroup,
      headGroup,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      thrusterLight,
      shadow,
    };
  }

  // --- Drivable Cyber Rover & Charging Pad Construction ---
  private buildDrivableRover() {
    // 1. Futuristic Charging Platform / Docking Pad at [8, 0, 8]
    const padGroup = new THREE.Group();
    padGroup.position.set(8, 0, 8);
    padGroup.rotation.y = Math.PI * 0.75;
    this.scene.add(padGroup);
    this.roverDockPad = padGroup;

    // Heavy hexagonal charging deck
    const deckGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.12, 6);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x16110d,
      roughness: 0.6,
      metalness: 0.7,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.05;
    deck.receiveShadow = true;
    padGroup.add(deck);

    // Glowing neon amber boundary ring
    const borderGeo = new THREE.RingGeometry(3.2, 3.45, 6);
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.12;
    padGroup.add(border);

    // Energy conduits on charging pad
    [-1.2, 1.2].forEach((offset) => {
      const conduit = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.02, 3.8),
        new THREE.MeshBasicMaterial({ color: 0xfba754 })
      );
      conduit.position.set(offset, 0.12, 0);
      padGroup.add(conduit);
    });

    // Charging Console / Hologram Pylon at rear of pad
    const pylonGeo = new THREE.BoxGeometry(0.4, 2.0, 0.4);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x221a14, metalness: 0.85, roughness: 0.25 });
    const pylon = new THREE.Mesh(pylonGeo, pylonMat);
    pylon.position.set(0, 1.0, 2.8);
    pylon.castShadow = true;
    padGroup.add(pylon);

    const pylonLight = new THREE.PointLight(0xf97316, 1.8, 6.0);
    pylonLight.position.set(0, 2.1, 2.8);
    padGroup.add(pylonLight);

    const pylonBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    pylonBeacon.position.set(0, 2.1, 2.8);
    padGroup.add(pylonBeacon);

    // 2. Cyber Rover Vehicle Model
    const roverGroup = new THREE.Group();
    roverGroup.position.set(8, 0, 8);
    roverGroup.rotation.y = Math.PI * 0.75;
    this.scene.add(roverGroup);

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x17120e,
      roughness: 0.28,
      metalness: 0.85,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x251a12,
      roughness: 0.35,
      metalness: 0.8,
    });

    const glowOrangeMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Lower Main Hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.42, 3.4), hullMat);
    hull.position.y = 0.52;
    hull.castShadow = true;
    hull.receiveShadow = true;
    roverGroup.add(hull);

    // Upper Deck Wedge
    const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 2.4), accentMat);
    upperDeck.position.set(0, 0.82, -0.1);
    upperDeck.castShadow = true;
    roverGroup.add(upperDeck);

    // Cockpit Tinted Canopy
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x090705,
      metalness: 0.95,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82,
      emissive: 0xf97316,
      emissiveIntensity: 0.2,
    });
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.48, 1.4), cockpitMat);
    cockpit.position.set(0, 1.15, -0.2);
    cockpit.castShadow = true;
    roverGroup.add(cockpit);

    // Exo Roll-Cage Bars
    [-0.72, 0.72].forEach((x) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 1.5), hullMat);
      bar.position.set(x, 1.15, -0.2);
      roverGroup.add(bar);
    });

    // Front Bumper & Aggressive Cyber Splitter
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 0.5), hullMat);
    bumper.position.set(0, 0.38, -1.8);
    bumper.castShadow = true;
    roverGroup.add(bumper);

    // Glowing Neon Side Skirts
    [-0.98, 0.98].forEach((x) => {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 2.6), glowOrangeMat);
      skirt.position.set(x, 0.45, 0);
      roverGroup.add(skirt);
    });

    // Rear High Aero Wing / Spoiler
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.5), hullMat);
    wing.position.set(0, 1.35, 1.6);
    wing.castShadow = true;
    roverGroup.add(wing);

    [-0.8, 0.8].forEach((x) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.2), hullMat);
      strut.position.set(x, 1.08, 1.55);
      roverGroup.add(strut);
    });

    // Rear Twin Ion Thruster Nozzles
    [-0.6, 0.6].forEach((x) => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.5, 16), accentMat);
      nozzle.rotation.x = Math.PI / 2;
      nozzle.position.set(x, 0.55, 1.8);
      roverGroup.add(nozzle);

      const thrusterCore = new THREE.Mesh(new THREE.CircleGeometry(0.18, 14), glowOrangeMat);
      thrusterCore.position.set(x, 0.55, 2.06);
      roverGroup.add(thrusterCore);
    });

    // Rear Thruster Point Light
    const thrusterLight = new THREE.PointLight(0xf97316, 2.2, 7);
    thrusterLight.position.set(0, 0.55, 2.2);
    roverGroup.add(thrusterLight);

    // Headlight Lens Meshes
    const headlights: THREE.SpotLight[] = [];
    [-0.75, 0.75].forEach((x) => {
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.08), headlightMat);
      lens.position.set(x, 0.42, -1.95);
      roverGroup.add(lens);

      // Functional SpotLight illuminating terrain
      const spot = new THREE.SpotLight(0xffedd5, 3.2, 30, 0.52, 0.4, 1.5);
      spot.position.set(x, 0.45, -1.9);
      spot.target.position.set(x * 0.3, 0, -22);
      roverGroup.add(spot.target);
      roverGroup.add(spot);
      headlights.push(spot);
    });

    // Wheels (4 All-Terrain Cyber Wheels with high-traction treads)
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x12100f,
      roughness: 0.9,
      metalness: 0.3,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x2b1e16,
      metalness: 0.92,
      roughness: 0.2,
    });

    const createWheelMesh = () => {
      const wheel = new THREE.Group();
      // Outer rubber tire
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.38, 20), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheel.add(tire);

      // Metallic Rim Hub
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 8), rimMat);
      rim.rotation.z = Math.PI / 2;
      wheel.add(rim);

      // Glowing Neon Hub Center
      [-0.205, 0.205].forEach((offset) => {
        const hubCap = new THREE.Mesh(new THREE.CircleGeometry(0.12, 8), glowOrangeMat);
        hubCap.rotation.y = offset > 0 ? Math.PI / 2 : -Math.PI / 2;
        hubCap.position.x = offset;
        wheel.add(hubCap);
      });

      return wheel;
    };

    // Front Left & Right (Steerable Pivots)
    const frontWheels: THREE.Group[] = [];
    [-1.25, 1.25].forEach((x) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.48, -1.15);
      roverGroup.add(pivot);

      const wheelMesh = createWheelMesh();
      pivot.add(wheelMesh);
      frontWheels.push(pivot);
    });

    // Rear Left & Right (Fixed Struts)
    const rearWheels: THREE.Mesh[] = [];
    [-1.25, 1.25].forEach((x) => {
      const wheelMesh = createWheelMesh();
      wheelMesh.position.set(x, 0.48, 1.15);
      roverGroup.add(wheelMesh);
      rearWheels.push(wheelMesh as unknown as THREE.Mesh);
    });

    // Underside Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.8, 4.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    roverGroup.add(shadow);

    this.rover = {
      group: roverGroup,
      body: hull,
      frontWheels,
      rearWheels,
      headlights,
      thrusterLight,
      shadow,
      pos: roverGroup.position,
      velocity: new THREE.Vector3(),
      rotation: roverGroup.rotation.y,
      steerAngle: 0,
      speed: 0,
    };
  }

  // --- Diverse Interactive Props (Cubes, Plasma Orbs, Pyramids, Cylinders) ---
  private buildDiverseInteractiveProps() {
    let propId = 0;

    // 1. Kinetic Data Cubes (4 items)
    const cubePositions: [number, number, number][] = [
      [6, 0.6, -10],
      [-6, 0.6, -10],
      [10, 0.6, 6],
      [-10, 0.6, 6],
    ];
    cubePositions.forEach(([x, y, z], idx) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const cubeGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0x1f1712,
        emissive: 0xf97316,
        emissiveIntensity: 0.35 + (idx % 2) * 0.2,
        metalness: 0.85,
        roughness: 0.25,
      });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Inner wireframe glow
      const wire = new THREE.Mesh(
        new THREE.BoxGeometry(1.24, 1.24, 1.24),
        new THREE.MeshBasicMaterial({ color: 0xfdba74, wireframe: true, transparent: true, opacity: 0.45 })
      );
      group.add(wire);

      this.scene.add(group);

      this.interactiveProps.push({
        id: propId++,
        type: 'cube',
        name: `Data Cube ${String.fromCharCode(65 + idx)}`,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6),
        radius: 0.85,
        height: 0.6,
        mass: 1.0,
        restitution: 0.38,
        friction: 0.88,
        baseColor: 0xf97316,
      });
    });

    // 2. Hyper-Bounce Plasma Orbs (4 items)
    const spherePositions: [number, number, number][] = [
      [14, 0.7, -16],
      [-14, 0.7, -16],
      [18, 0.7, 10],
      [-18, 0.7, 10],
    ];
    spherePositions.forEach(([x, y, z], idx) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const sphereGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x2b1507,
        emissive: 0xf97316,
        emissiveIntensity: 0.75,
        metalness: 0.9,
        roughness: 0.15,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      group.add(mesh);

      // Orbiting energy torus
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.035, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      const light = new THREE.PointLight(0xf97316, 1.2, 4.5);
      group.add(light);

      this.scene.add(group);

      this.interactiveProps.push({
        id: propId++,
        type: 'sphere',
        name: `Plasma Orb ${idx + 1}`,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5),
        radius: 0.7,
        height: 0.7,
        mass: 0.6,
        restitution: 0.86, // High-bounce!
        friction: 0.94,
        baseColor: 0xfb923c,
      });
    });

    // 3. Heavy Monolith Pyramids (4 items)
    const pyramidPositions: [number, number, number][] = [
      [16, 0.7, -6],
      [-16, 0.7, -6],
      [6, 0.7, 22],
      [-6, 0.7, 22],
    ];
    pyramidPositions.forEach(([x, y, z], idx) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const coneGeo = new THREE.ConeGeometry(0.85, 1.4, 4);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x140e0a,
        emissive: 0xd97706,
        emissiveIntensity: 0.28,
        metalness: 0.85,
        roughness: 0.35,
      });
      const mesh = new THREE.Mesh(coneGeo, coneMat);
      mesh.castShadow = true;
      group.add(mesh);

      // Glowing Runic Core Ring at base
      const runic = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.03, 4, 16),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      runic.rotation.x = Math.PI / 2;
      runic.position.y = -0.55;
      group.add(runic);

      this.scene.add(group);

      this.interactiveProps.push({
        id: propId++,
        type: 'pyramid',
        name: `Obsidian Pyramid ${idx + 1}`,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4),
        radius: 0.85,
        height: 0.7,
        mass: 2.6, // Heavy mass
        restitution: 0.16, // Low bounce
        friction: 0.82,
        baseColor: 0xd97706,
      });
    });

    // 4. Rolling Cyber Fuel Cylinders (4 items)
    const cylinderPositions: [number, number, number][] = [
      [22, 0.65, 4],
      [-22, 0.65, 4],
      [0, 0.65, -24],
      [0, 0.65, 24],
    ];
    cylinderPositions.forEach(([x, y, z], idx) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const cylGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.3, 16);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x1a130e,
        metalness: 0.88,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(cylGeo, cylMat);
      mesh.rotation.z = Math.PI / 2; // Laid down horizontally for rolling
      mesh.castShadow = true;
      group.add(mesh);

      // Neon warning rings around cylinder rims
      [-0.55, 0.55].forEach((offset) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.56, 0.03, 8, 18),
          new THREE.MeshBasicMaterial({ color: 0xf97316 })
        );
        ring.rotation.y = Math.PI / 2;
        ring.position.x = offset;
        group.add(ring);
      });

      this.scene.add(group);

      this.interactiveProps.push({
        id: propId++,
        type: 'cylinder',
        name: `Fuel Cell ${idx + 1}`,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3((Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8),
        radius: 0.7,
        height: 0.65,
        mass: 1.1,
        restitution: 0.45,
        friction: 0.91,
        baseColor: 0xea580c,
      });
    });
  }

  // --- Energy Launch / Jump Boost Pads ---
  private buildLaunchPads() {
    const padPositions: { pos: [number, number, number]; dir: [number, number, number] }[] = [
      { pos: [0, 0.05, -16], dir: [0, 0, -1] },
      { pos: [0, 0.05, 16], dir: [0, 0, 1] },
      { pos: [16, 0.05, 0], dir: [1, 0, 0] },
      { pos: [-16, 0.05, 0], dir: [-1, 0, 0] },
    ];

    padPositions.forEach(({ pos, dir }) => {
      const group = new THREE.Group();
      group.position.set(...pos);

      // Base pad
      const baseGeo = new THREE.BoxGeometry(3.2, 0.1, 3.2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x24180e, metalness: 0.8, roughness: 0.3 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      group.add(base);

      // Glowing pulsing chevron field
      const fieldGeo = new THREE.PlaneGeometry(2.8, 2.8);
      const fieldMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
      const field = new THREE.Mesh(fieldGeo, fieldMat);
      field.rotation.x = -Math.PI / 2;
      field.position.y = 0.06;
      group.add(field);

      // Point light
      const light = new THREE.PointLight(0xf97316, 1.8, 6);
      light.position.y = 0.5;
      group.add(light);

      this.scene.add(group);

      this.boostPads.push({
        mesh: group,
        pos: new THREE.Vector3(...pos),
        direction: new THREE.Vector3(...dir),
        cooldown: 0,
      });
    });
  }

  // --- Particle Exhaust & Skid Trail System ---
  private buildParticleTrails() {
    const maxParticles = 120;
    const geometry = new THREE.BufferGeometry();
    this.trailPositions = new Float32Array(maxParticles * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.trailPoints = new THREE.Points(geometry, material);
    this.scene.add(this.trailPoints);
  }

  // --- Shockwave Mesh (Triggered on 'F' or action button) ---
  private buildShockwaveMesh() {
    const ringGeo = new THREE.RingGeometry(0.5, 0.9, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    this.shockwaveRing.rotation.x = -Math.PI / 2;
    this.shockwaveRing.position.y = 0.1;
    this.shockwaveRing.visible = false;
    this.scene.add(this.shockwaveRing);
  }

  public triggerShockwave() {
    this.shockwaveActive = true;
    this.shockwaveRadius = 1;
    this.gestureTimer = 0.55; // Gauntlet blast pose
    const blastOrigin = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;

    if (this.shockwaveRing) {
      this.shockwaveRing.position.set(blastOrigin.x, 0.1, blastOrigin.z);
      this.shockwaveRing.visible = true;
      this.shockwaveRing.scale.set(1, 1, 1);
    }
    sfx.playShockwave();

    // If holding an object, blast-launch it!
    if (this.heldProp) {
      this.throwHeldProp(28);
    }

    // Push all nearby interactive props outward with radial force
    this.interactiveProps.forEach((prop) => {
      if (prop === this.heldProp) return;

      const dx = prop.pos.x - blastOrigin.x;
      const dz = prop.pos.z - blastOrigin.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 14) {
        const force = (Math.max(0, 1 - dist / 14) * 28) / prop.mass;
        const dir = new THREE.Vector3(dx, 0.35, dz).normalize();
        prop.velocity.addScaledVector(dir, force);
        prop.angularVelocity.add(
          new THREE.Vector3((Math.random() - 0.5) * 12, 3, (Math.random() - 0.5) * 12)
        );
      }
    });
  }

  // --- Quantum Teleportation Portal Beam & Rings Mesh ---
  private buildTeleportFX() {
    this.teleportGroup = new THREE.Group();
    this.teleportGroup.position.set(0, 5, 0);
    this.teleportGroup.visible = false;

    // Translucent Energy Beam Cylinder
    const beamGeo = new THREE.CylinderGeometry(1.4, 1.4, 10, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.teleportBeam = new THREE.Mesh(beamGeo, beamMat);
    this.teleportGroup.add(this.teleportBeam);

    // Inner Core Plasma Pillar
    const innerCoreGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16, 1, true);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    this.teleportGroup.add(innerCore);

    // 3 Quantum Torus Rings
    this.teleportRings = [];
    [-3.8, -1.8, 0.2].forEach((yOffset) => {
      const ringGeo = new THREE.TorusGeometry(1.4, 0.05, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfdba74,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yOffset;
      this.teleportGroup.add(ring);
      this.teleportRings.push(ring);
    });

    // Intense Point Light
    this.teleportLight = new THREE.PointLight(0xf97316, 0, 22);
    this.teleportLight.position.set(0, -3.5, 0);
    this.teleportGroup.add(this.teleportLight);

    this.scene.add(this.teleportGroup);
  }

  // --- Destination Marker for Click-to-Move ---
  private buildDestinationMarker() {
    const group = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.8, 0.95, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);

    const innerDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xffedd5, side: THREE.DoubleSide })
    );
    innerDot.rotation.x = -Math.PI / 2;
    innerDot.position.y = 0.01;
    group.add(innerDot);

    group.position.set(0, 0.05, 0);
    group.visible = false;
    return group;
  }

  // --- Atmospheric Dust Particles ---
  private buildAtmosphericParticles(): THREE.Points {
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 110;
      positions[i + 1] = Math.random() * 22 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 110;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfdba74,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }

  // --- Build Interactive Stations ---
  private buildStations() {
    STATIONS.forEach((station) => {
      const group = new THREE.Group();
      group.position.set(...station.position);

      const colorHex = new THREE.Color(station.color);

      // Elevated Podium Base
      const padGeo = new THREE.CylinderGeometry(4.4, 4.8, 0.45, 32);
      const padMat = new THREE.MeshStandardMaterial({
        color: 0x140f0c,
        roughness: 0.35,
        metalness: 0.85,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.y = 0.22;
      pad.receiveShadow = true;
      group.add(pad);

      // Glowing Pulse Ring around platform
      const ringGeo = new THREE.RingGeometry(4.4, 4.65, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.46;
      group.add(ring);

      // Central Monument Sculpture
      let monument: THREE.Mesh;
      if (station.category === 'spawn') {
        monument = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.6, 0),
          new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xf97316,
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.9,
          })
        );
        monument.position.y = 3.2;

        const innerRing = new THREE.Mesh(
          new THREE.TorusGeometry(2.4, 0.08, 16, 48),
          new THREE.MeshBasicMaterial({ color: 0xffedd5 })
        );
        innerRing.position.y = 3.2;
        innerRing.rotation.x = Math.PI / 3;
        group.add(innerRing);
      } else if (station.category === 'projects') {
        monument = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2.8, 2),
          new THREE.MeshStandardMaterial({
            color: 0x1c120c,
            emissive: 0xea580c,
            emissiveIntensity: 0.65,
            roughness: 0.2,
            metalness: 0.9,
          })
        );
        monument.position.y = 3.4;

        const wireframe = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 3.2, 2.4),
          new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true })
        );
        wireframe.position.y = 3.4;
        group.add(wireframe);
      } else if (station.category === 'tech') {
        monument = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.8, 0),
          new THREE.MeshStandardMaterial({
            color: 0x2e1065,
            emissive: 0xa855f7,
            emissiveIntensity: 0.7,
            roughness: 0.2,
            metalness: 0.8,
          })
        );
        monument.position.y = 3.2;

        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
        [[-2, 2.8, 0], [2, 3.6, 0], [0, 4.2, 2]].forEach(([nx, ny, nz]) => {
          const miniNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), nodeMat);
          miniNode.position.set(nx, ny, nz);
          group.add(miniNode);
        });
      } else if (station.category === 'experience') {
        monument = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 1.4, 4.2, 6),
          new THREE.MeshStandardMaterial({
            color: 0x064e3b,
            emissive: 0x10b981,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.9,
          })
        );
        monument.position.y = 2.4;
      } else {
        monument = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.4, 4.8, 8),
          new THREE.MeshStandardMaterial({
            color: 0x451a03,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.6,
            roughness: 0.3,
            metalness: 0.8,
          })
        );
        monument.position.y = 2.6;

        const dish = new THREE.Mesh(
          new THREE.ConeGeometry(1.4, 0.6, 16, 1, true),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, side: THREE.DoubleSide })
        );
        dish.position.set(0, 4.6, 0);
        dish.rotation.x = Math.PI / 4;
        group.add(dish);
      }

      monument.castShadow = true;
      group.add(monument);

      // Station Point Light
      const stationLight = new THREE.PointLight(colorHex, 2.4, 16);
      stationLight.position.set(0, 3.5, 0);
      group.add(stationLight);

      // Text Billboard Banner
      const billboard = this.createStationBillboard(station.name.toUpperCase(), station.color);
      billboard.position.set(0, 5.8, 0);
      group.add(billboard);

      this.scene.add(group);
      this.stationMeshes.push({ data: station, group, beacon: monument, light: stationLight, platformRing: ring });
    });
  }

  // --- Dynamic Station Billboard Texture ---
  private createStationBillboard(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background pill
    ctx.fillStyle = 'rgba(7, 6, 5, 0.88)';
    ctx.roundRect(16, 16, 480, 96, 24);
    ctx.fill();

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.roundRect(16, 16, 480, 96, 24);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(6, 1.5, 1);
    return sprite;
  }

  // --- Collectible Data Cores ---
  private buildDataCores() {
    DATA_CORES.forEach((core) => {
      const group = new THREE.Group();
      group.position.set(...core.position);

      const coreMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.65, 0),
        new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xf97316,
          emissiveIntensity: 0.95,
          roughness: 0.1,
          metalness: 0.9,
        })
      );
      coreMesh.castShadow = true;
      group.add(coreMesh);

      // Orbiting energy ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.04, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      const light = new THREE.PointLight(0xf97316, 1.4, 5.5);
      group.add(light);

      this.scene.add(group);
      this.coreMeshes.push({ id: core.id, mesh: group, collected: false });
    });
  }

  // --- Event Listeners ---
  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.handlePointerDown);
  }

  private unbindEvents() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.handlePointerDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Crucial: prevent spacebar default so browser never triggers click on focused DOM buttons!
    if (e.code === 'Space') {
      e.preventDefault();
      if (!this.isJumping && !this.isTeleporting) {
        this.isJumping = true;
        this.verticalVelocity = 8.5;
        sfx.playBoost();
      }
      this.isBoosting = true;
      return;
    }

    this.keysPressed[e.code] = true;

    if (e.code === 'KeyF' || e.code === 'KeyH') {
      this.triggerShockwave();
    }

    if (e.code === 'KeyG') {
      this.togglePickThrow();
    }

    if (e.code === 'KeyR') {
      this.toggleRoverDrive();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.isBoosting = false;
      return;
    }
    this.keysPressed[e.code] = false;
  };

  private handleResize = () => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (this.isTeleporting) return;

    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target !== this.renderer.domElement) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const target = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, target);

    if (hit) {
      // Check if player clicked directly on or near the Cyber Rover
      const dxRover = target.x - this.rover.pos.x;
      const dzRover = target.z - this.rover.pos.z;
      const clickDistToRover = Math.sqrt(dxRover * dxRover + dzRover * dzRover);

      if (clickDistToRover < 4.2 && !this.isDrivingRover) {
        const pDx = this.playerGroup.position.x - this.rover.pos.x;
        const pDz = this.playerGroup.position.z - this.rover.pos.z;
        const pDistToRover = Math.sqrt(pDx * pDx + pDz * pDz);

        if (pDistToRover < 6.8) {
          this.enterRover();
          return;
        } else {
          // Walk to the rover and board it
          const approachPos = this.rover.pos.clone().add(new THREE.Vector3(-2.0, 0, 0));
          this.targetDestination = approachPos;
          if (this.destinationMarker) {
            this.destinationMarker.position.set(approachPos.x, 0.05, approachPos.z);
            this.destinationMarker.visible = true;
          }
          return;
        }
      }

      // Check if player clicked on or near an interactive prop
      let clickedProp: InteractiveProp | null = null;
      for (const prop of this.interactiveProps) {
        const dx = target.x - prop.pos.x;
        const dz = target.z - prop.pos.z;
        if (Math.sqrt(dx * dx + dz * dz) < 2.2) {
          clickedProp = prop;
          break;
        }
      }

      if (clickedProp && !this.isDrivingRover) {
        const pDx = this.playerGroup.position.x - clickedProp.pos.x;
        const pDz = this.playerGroup.position.z - clickedProp.pos.z;
        const pDistToProp = Math.sqrt(pDx * pDx + pDz * pDz);

        if (pDistToProp < 4.8) {
          if (this.heldProp) {
            this.throwHeldProp();
          } else {
            this.heldProp = clickedProp;
            clickedProp.velocity.set(0, 0, 0);
            clickedProp.angularVelocity.set(0, 0, 0);
            sfx.playPickup();
            this.checkActionPrompts();
          }
          return;
        } else {
          // Walk towards the prop
          this.targetDestination = clickedProp.pos.clone();
          if (this.destinationMarker) {
            this.destinationMarker.position.set(target.x, 0.05, target.z);
            this.destinationMarker.visible = true;
          }
          return;
        }
      }

      const distFromCenter = Math.sqrt(target.x * target.x + target.z * target.z);
      if (distFromCenter < 55) {
        this.targetDestination = target;
        if (this.destinationMarker) {
          this.destinationMarker.position.set(target.x, 0.05, target.z);
          this.destinationMarker.visible = true;
        }
      }
    }
  };

  // --- Public Controls for Mobile / React UI ---
  public setJoystickVector(x: number, y: number) {
    if (this.isTeleporting) return;
    this.joystickVector = { x, y };
    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
      this.targetDestination = null;
      if (this.destinationMarker) this.destinationMarker.visible = false;
    }
  }

  public setBoost(active: boolean) {
    if (this.isTeleporting) return;
    this.isBoosting = active;
    if (active) {
      if (!this.isDrivingRover && !this.isJumping) {
        this.isJumping = true;
        this.verticalVelocity = 8.5;
      }
      sfx.playBoost();
    }
  }

  public setOverdrive(active: boolean) {
    this.isOverdrive = active;
    if (active) {
      this.thrusterGlow.color.setHex(0xfb923c);
      this.thrusterGlow.intensity = 4.5;
    }
  }

  public teleportToStation(stationId: string) {
    if (this.isTeleporting) return;
    const targetStation = STATIONS.find((s) => s.id === stationId);
    if (!targetStation) return;

    if (this.isDrivingRover) {
      this.exitRover();
    }

    const [tx, , tz] = targetStation.position;
    const targetX = tx;
    const targetZ = tz + 5.5;
    const targetRotation = Math.atan2(tx - targetX, tz - targetZ);

    this.isTeleporting = true;
    this.teleportProgress = 0;
    this.hasTriggeredWarpAudio = false;
    this.hasTriggeredLandAudio = false;
    this.teleportTarget = { x: targetX, z: targetZ, rotation: targetRotation };

    this.playerVelocity.set(0, 0, 0);
    this.verticalVelocity = 0;
    this.isJumping = false;
    this.targetDestination = null;
    if (this.destinationMarker) this.destinationMarker.visible = false;

    // Position teleport FX at current player position
    this.teleportGroup.position.set(this.playerGroup.position.x, 5, this.playerGroup.position.z);
    this.teleportGroup.visible = true;

    // Reset ring scales
    this.teleportRings.forEach((ring) => ring.scale.set(1, 1, 1));

    // Audio & HUD Notification
    sfx.playTeleportCharge();
    this.callbacks.onTeleportState?.(true);
  }

  // --- Realistic Quantum Teleportation Sequence ---
  private updateTeleport(delta: number) {
    if (!this.isTeleporting || !this.teleportTarget) return;

    this.teleportProgress += delta;
    const t = this.teleportProgress;

    const beamMat = this.teleportBeam.material as THREE.MeshBasicMaterial;
    const coreMat = (this.teleportGroup.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;

    // Phase 1: Ionization & De-materialization (0.0s -> 0.38s)
    if (t < 0.38) {
      const p1 = t / 0.38;

      beamMat.opacity = p1 * 0.85;
      coreMat.opacity = p1 * 0.95;

      this.teleportRings.forEach((ring, idx) => {
        ring.rotation.z += delta * (12 + idx * 6);
        const rMat = ring.material as THREE.MeshBasicMaterial;
        rMat.opacity = p1 * 0.9;
      });

      this.teleportLight.intensity = p1 * 10;

      // Character vertically compresses and dissolves into the beam
      const charScale = Math.max(0.02, 1 - p1 * 0.98);
      this.characterRoot.scale.set(charScale, Math.max(0.01, 1 - p1 * 0.99), charScale);
      this.characterRoot.position.y = p1 * 0.5;

      // Subtle camera quantum jitter
      this.camera.position.x += (Math.random() - 0.5) * 0.08 * p1;
      this.camera.position.y += (Math.random() - 0.5) * 0.08 * p1;
    }
    // Phase 2: Quantum Displacement / Relocation (0.38s -> 0.52s)
    else if (t < 0.52) {
      if (!this.hasTriggeredWarpAudio) {
        this.hasTriggeredWarpAudio = true;
        sfx.playTeleportWarp();

        // Move player & portal beam to destination coordinates
        this.playerGroup.position.set(this.teleportTarget.x, 0, this.teleportTarget.z);
        this.playerRotation = this.teleportTarget.rotation;
        this.playerGroup.rotation.y = this.playerRotation;
        this.teleportGroup.position.set(this.teleportTarget.x, 5, this.teleportTarget.z);

        // Radial energy landing burst
        if (this.shockwaveRing) {
          this.shockwaveRing.position.set(this.teleportTarget.x, 0.08, this.teleportTarget.z);
          this.shockwaveRing.visible = true;
          this.shockwaveRadius = 0.5;
          this.shockwaveActive = true;
        }
      }

      beamMat.opacity = 0.95;
      coreMat.opacity = 1.0;
      this.characterRoot.scale.set(0.02, 0.02, 0.02);
    }
    // Phase 3: Re-materialization, Landing Impact & Camera Glide (0.52s -> 1.05s)
    else if (t < 1.05) {
      if (!this.hasTriggeredLandAudio) {
        this.hasTriggeredLandAudio = true;
        sfx.playTeleportLand();
      }

      const p3 = (t - 0.52) / 0.53; // 0 to 1
      const fade = Math.max(0, 1 - p3);

      beamMat.opacity = fade * 0.85;
      coreMat.opacity = fade * 0.95;

      this.teleportRings.forEach((ring, idx) => {
        ring.rotation.z += delta * (12 + idx * 6);
        const ringScale = 1 + p3 * 0.85;
        ring.scale.set(ringScale, ringScale, ringScale);
        const rMat = ring.material as THREE.MeshBasicMaterial;
        rMat.opacity = fade * 0.9;
      });

      this.teleportLight.intensity = fade * 8;

      // Character re-materializes with bounce and realistic knee flex landing
      const bounce = p3 < 0.55 ? (p3 / 0.55) * 1.15 : 1.15 - ((p3 - 0.55) / 0.45) * 0.15;
      this.characterRoot.scale.set(bounce, bounce, bounce);
      this.characterRoot.position.y = Math.max(0, (1 - p3) * 0.2);

      // Kinetic knee flexion on teleport impact
      const crouch = Math.sin(p3 * Math.PI) * 0.22;
      this.leftLegGroup.rotation.x = -crouch;
      this.rightLegGroup.rotation.x = -crouch;
      this.torsoGroup.rotation.x = crouch * 0.6;

      // Cinematic camera swoop directly behind destination
      const targetCamPos = this.playerGroup.position.clone().add(new THREE.Vector3(0, 5.2, 8.2));
      this.camera.position.lerp(targetCamPos, 0.12);
      const lookTarget = this.playerGroup.position.clone().add(new THREE.Vector3(0, 1.35, -1.2));
      this.camera.lookAt(lookTarget);
    }
    // Phase 4: Settle & Re-enable normal control (t >= 1.05s)
    else {
      this.isTeleporting = false;
      this.teleportProgress = 0;
      this.characterRoot.scale.set(1, 1, 1);
      this.characterRoot.position.y = 0;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.torsoGroup.rotation.x = 0;
      this.teleportGroup.visible = false;
      this.teleportRings.forEach((r) => r.scale.set(1, 1, 1));
      beamMat.opacity = 0;
      coreMat.opacity = 0;
      this.callbacks.onTeleportState?.(false);
    }
  }

  // --- Main Animation Loop ---
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    if (this.isDrivingRover) {
      this.updateRoverMovement(delta);
    } else {
      this.updatePlayerMovement(delta, time);
    }

    this.updateTeleport(delta);
    this.updateInteractiveProps(delta);
    this.updateLaunchPads(delta);
    this.updateParticles(delta);
    this.updateShockwave(delta);
    this.updateAnimations(time);
    this.checkProximity();
    this.checkCoreCollection();
    this.checkActionPrompts();
    this.updateCamera();

    // Report active player/vehicle position & heading for mini-radar
    if (this.callbacks.onPlayerState) {
      const activeX = this.isDrivingRover ? this.rover.pos.x : this.playerGroup.position.x;
      const activeZ = this.isDrivingRover ? this.rover.pos.z : this.playerGroup.position.z;
      const activeRot = this.isDrivingRover ? this.rover.rotation : this.playerRotation;
      this.callbacks.onPlayerState(activeX, activeZ, activeRot);
    }

    this.renderer.render(this.scene, this.camera);
  };

  // --- Drivable Cyber Rover Vehicle Kinematics ---
  private updateRoverMovement(delta: number) {
    if (this.isTeleporting) return;

    let forwardInput = 0;
    let turnInput = 0;

    // 1. Keyboard Inputs
    if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) forwardInput += 1;
    if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) forwardInput -= 1;
    if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) turnInput += 1;
    if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) turnInput -= 1;

    // 2. Mobile Joystick Inputs
    if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
      forwardInput = -this.joystickVector.y;
      turnInput = -this.joystickVector.x;
    }

    // 3. Click-to-Move Pathing
    if (this.targetDestination) {
      const dx = this.targetDestination.x - this.rover.pos.x;
      const dz = this.targetDestination.z - this.rover.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 1.5) {
        const desiredAngle = Math.atan2(dx, dz) + Math.PI;
        let angleDiff = desiredAngle - this.rover.rotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        turnInput = Math.max(-1, Math.min(1, -angleDiff * 2.2));
        forwardInput = Math.max(0.5, Math.min(1, dist * 0.4));
      } else {
        this.targetDestination = null;
        if (this.destinationMarker) this.destinationMarker.visible = false;
      }
    }

    // Rover performance specifications
    let maxForwardSpeed = 22.0;
    if (this.isBoosting) maxForwardSpeed = 36.0;
    if (this.isOverdrive) maxForwardSpeed *= 1.25;
    const maxReverseSpeed = -9.0;

    const acceleration = this.isBoosting ? 44.0 : 30.0;
    const brakeFriction = 0.93;

    // Forward / Reverse acceleration
    if (forwardInput > 0) {
      this.rover.speed += forwardInput * acceleration * delta;
      if (this.rover.speed > maxForwardSpeed) this.rover.speed = maxForwardSpeed;
    } else if (forwardInput < 0) {
      this.rover.speed += forwardInput * (acceleration * 0.75) * delta;
      if (this.rover.speed < maxReverseSpeed) this.rover.speed = maxReverseSpeed;
    } else {
      this.rover.speed *= Math.pow(brakeFriction, delta * 60);
      if (Math.abs(this.rover.speed) < 0.1) this.rover.speed = 0;
    }

    // Steering Angle
    const targetSteer = turnInput * 0.52;
    this.rover.steerAngle += (targetSteer - this.rover.steerAngle) * 0.22;

    // Apply steering to front wheel pivots
    this.rover.frontWheels[0].rotation.y = this.rover.steerAngle;
    this.rover.frontWheels[1].rotation.y = this.rover.steerAngle;

    // Vehicle turning (responsive at all speeds, allows pivot steering)
    if (Math.abs(this.rover.speed) > 0.05 || Math.abs(turnInput) > 0.05) {
      const turnDir = this.rover.speed < -0.1 ? -1 : 1;
      const steerFactor = Math.max(0.65, Math.min(1.0, Math.abs(this.rover.speed) / 2.0));
      this.rover.rotation += this.rover.steerAngle * turnDir * steerFactor * 2.8 * delta;
      this.rover.group.rotation.y = this.rover.rotation;
    }

    // Forward translation vector
    const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rover.rotation);
    this.rover.velocity.copy(forwardDir).multiplyScalar(this.rover.speed);
    this.rover.pos.addScaledVector(this.rover.velocity, delta);

    // Keep explorer playerGroup synced with rover
    this.playerGroup.position.copy(this.rover.pos);
    this.playerRotation = this.rover.rotation;
    this.playerGroup.rotation.y = this.playerRotation;

    // Wheel spin rotation (proportional to forward speed)
    const rollDelta = (this.rover.speed * delta) / 0.48;
    this.rover.frontWheels.forEach((pivot) => {
      const wheelGroup = pivot.children[0] as THREE.Group;
      if (wheelGroup) wheelGroup.rotation.x += rollDelta;
    });
    this.rover.rearWheels.forEach((wheelGroup) => {
      (wheelGroup as unknown as THREE.Group).rotation.x += rollDelta;
    });

    // Boundary clamping
    const distFromCenter = Math.sqrt(this.rover.pos.x * this.rover.pos.x + this.rover.pos.z * this.rover.pos.z);
    if (distFromCenter > 54) {
      const angle = Math.atan2(this.rover.pos.z, this.rover.pos.x);
      this.rover.pos.x = Math.cos(angle) * 54;
      this.rover.pos.z = Math.sin(angle) * 54;
      this.rover.speed *= -0.4;
      sfx.playBump();
    }

    // Dynamic Thruster Flare
    this.rover.thrusterLight.intensity =
      1.0 + (Math.abs(this.rover.speed) / maxForwardSpeed) * 3.5 + (this.isBoosting ? 4.0 : 0);

    // Spawn exhaust trails when speeding or boosting
    if (Math.abs(this.rover.speed) > 3.0) {
      this.spawnRoverExhaustParticle();
    }

    // Real-time electric motor audio update
    sfx.updateRoverEngine(Math.abs(this.rover.speed), this.isBoosting);

    // Speedometer report to UI
    this.callbacks.onSpeedChange(Math.round(Math.abs(this.rover.speed) * 3.6));
  }

  private spawnRoverExhaustParticle() {
    if (this.trailParticles.length >= 100) return;

    [-0.6, 0.6].forEach((xOffset) => {
      const rearOffset = new THREE.Vector3(xOffset, 0.55, 1.95).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.rover.rotation
      );
      const spawnPos = this.rover.pos.clone().add(rearOffset);

      this.trailParticles.push({
        pos: spawnPos,
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.8, Math.random() * 0.4, (Math.random() - 0.5) * 0.8),
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 0.35,
      });
    });
  }

  // --- Update Explorer Physics & Controls ---
  private updatePlayerMovement(delta: number, time: number) {
    if (this.isTeleporting) return;

    let forwardInput = 0;
    let turnInput = 0;

    // 1. Keyboard Inputs
    if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) forwardInput += 1;
    if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) forwardInput -= 1;
    if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) turnInput += 1;
    if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) turnInput -= 1;

    // 2. Mobile Joystick Inputs
    if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
      forwardInput = -this.joystickVector.y;
      turnInput = -this.joystickVector.x;
    }

    // 3. Click-to-Move Pathing
    if (this.targetDestination) {
      const dx = this.targetDestination.x - this.playerGroup.position.x;
      const dz = this.targetDestination.z - this.playerGroup.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 1.0) {
        const desiredAngle = Math.atan2(dx, dz) + Math.PI;
        let angleDiff = desiredAngle - this.playerRotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        turnInput = Math.max(-1, Math.min(1, -angleDiff * 2));
        forwardInput = Math.max(0.4, Math.min(1, dist * 0.4));
      } else {
        this.targetDestination = null;
        if (this.destinationMarker) this.destinationMarker.visible = false;

        // Auto-board if player navigated directly to the Rover
        const dxRover = this.playerGroup.position.x - this.rover.pos.x;
        const dzRover = this.playerGroup.position.z - this.rover.pos.z;
        if (Math.sqrt(dxRover * dxRover + dzRover * dzRover) < 4.5 && !this.isDrivingRover) {
          this.enterRover();
        }
      }
    }

    // Movement speed settings (Humanoid Explorer)
    let maxSpeed = 8.5;
    if (this.isBoosting) maxSpeed = 15.5;
    if (this.isOverdrive) maxSpeed *= 1.25;

    const acceleration = 32;
    const drag = 0.86;
    const turnSpeed = 3.6;

    // Apply rotation
    this.playerRotation += turnInput * turnSpeed * delta;
    this.playerGroup.rotation.y = this.playerRotation;

    // Apply forward/backward force along facing direction
    if (forwardInput !== 0) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);
      this.playerVelocity.addScaledVector(forwardDir, forwardInput * acceleration * delta);

      if (this.playerVelocity.length() > maxSpeed) {
        this.playerVelocity.setLength(maxSpeed);
      }
    }

    // Apply drag / friction
    this.playerVelocity.multiplyScalar(Math.pow(drag, delta * 60));

    // Update X/Z position
    this.playerGroup.position.addScaledVector(this.playerVelocity, delta);

    // Vertical Jump & Gravity Physics
    if (this.isJumping) {
      this.verticalVelocity -= this.gravity * delta;
      this.playerGroup.position.y += this.verticalVelocity * delta;

      if (this.playerGroup.position.y <= 0) {
        this.playerGroup.position.y = 0;
        this.isJumping = false;
        this.verticalVelocity = 0;
      }
    } else {
      this.playerGroup.position.y = 0;
    }

    // Contact Shadow follows and scales inversely with jump height
    const heightAboveGround = this.playerGroup.position.y;
    const shadowScale = Math.max(0.3, 1 - heightAboveGround * 0.12);
    this.contactShadow.scale.set(shadowScale, shadowScale, shadowScale);

    // Humanoid Locomotion Kinematics (Walking, Running, Carrying, Jumping & Gestures)
    const currentSpeed = this.playerVelocity.length();
    const isMoving = currentSpeed > 0.35;

    if (isMoving) {
      const walkFreq = (this.isBoosting ? 13.5 : 8.5) * Math.min(1.5, currentSpeed / 5);
      this.walkCycle += delta * walkFreq;

      // Leg swing (alternating strides)
      const legAngle = Math.sin(this.walkCycle) * (this.isBoosting ? 0.95 : 0.72);
      this.leftLegGroup.rotation.x = legAngle;
      this.rightLegGroup.rotation.x = -legAngle;

      // Arm swing / Carrying pose
      if (this.heldProp) {
        // Carrying pose: both arms hold the object firmly in front
        this.leftArmGroup.rotation.x = -1.25;
        this.leftArmGroup.rotation.y = 0.35;
        this.leftArmGroup.rotation.z = 0.15;
        this.rightArmGroup.rotation.x = -1.25;
        this.rightArmGroup.rotation.y = -0.35;
        this.rightArmGroup.rotation.z = -0.15;
      } else if (this.gestureTimer <= 0) {
        const armAngle = Math.sin(this.walkCycle) * (this.isBoosting ? 0.85 : 0.6);
        this.leftArmGroup.rotation.x = -armAngle;
        this.rightArmGroup.rotation.x = armAngle;
        this.leftArmGroup.rotation.y = 0;
        this.rightArmGroup.rotation.y = 0;
        this.leftArmGroup.rotation.z = 0.12;
        this.rightArmGroup.rotation.z = -0.12;
      }

      // Footstep audio trigger on gait cadence zero-crossing
      const currentStepSign = Math.sign(Math.sin(this.walkCycle));
      if (currentStepSign !== this.prevStepSin && currentStepSign !== 0) {
        this.prevStepSin = currentStepSign;
        if (!this.isJumping && !this.isTeleporting) {
          const isLeftFoot = currentStepSign > 0;
          sfx.playFootstep(this.isBoosting, isLeftFoot);
        }
      }

      // Hip bobbing during strides
      this.characterRoot.position.y = Math.abs(Math.sin(this.walkCycle)) * 0.08;

      // Dynamic forward torso pitch lean into run
      const targetTorsoPitch = forwardInput * (this.isBoosting ? 0.28 : 0.12);
      this.torsoGroup.rotation.x += (targetTorsoPitch - this.torsoGroup.rotation.x) * 0.15;
    } else {
      // Idle recovery & breathing stance
      this.leftLegGroup.rotation.x *= 0.85;
      this.rightLegGroup.rotation.x *= 0.85;

      if (this.heldProp) {
        this.leftArmGroup.rotation.x = -1.25;
        this.leftArmGroup.rotation.y = 0.35;
        this.leftArmGroup.rotation.z = 0.15;
        this.rightArmGroup.rotation.x = -1.25;
        this.rightArmGroup.rotation.y = -0.35;
        this.rightArmGroup.rotation.z = -0.15;
      } else if (this.gestureTimer <= 0) {
        this.leftArmGroup.rotation.x = Math.sin(time * 2) * 0.05;
        this.rightArmGroup.rotation.x = -Math.sin(time * 2) * 0.05;
        this.leftArmGroup.rotation.y = 0;
        this.rightArmGroup.rotation.y = 0;
      }
      this.characterRoot.position.y = Math.sin(time * 2.5) * 0.02;
      this.torsoGroup.rotation.x *= 0.88;
    }

    // Jump pose
    if (this.isJumping) {
      this.leftLegGroup.rotation.x = -0.4;
      this.rightLegGroup.rotation.x = -0.25;
      if (!this.heldProp && this.gestureTimer <= 0) {
        this.leftArmGroup.rotation.x = 0.45;
        this.rightArmGroup.rotation.x = 0.45;
      }
    }

    // Shockwave repulsor blast gesture (arm extended forward)
    if (this.gestureTimer > 0 && !this.heldProp) {
      this.gestureTimer -= delta;
      this.rightArmGroup.rotation.x = -1.55;
    }

    // Head turn & slight body banking into turns
    this.headGroup.rotation.y = -turnInput * 0.28;
    const targetRoll = -turnInput * 0.14;
    this.characterRoot.rotation.z += (targetRoll - this.characterRoot.rotation.z) * 0.15;

    // World boundary clamping
    const currentDist = Math.sqrt(
      this.playerGroup.position.x * this.playerGroup.position.x +
        this.playerGroup.position.z * this.playerGroup.position.z
    );
    if (currentDist > 55) {
      const angle = Math.atan2(this.playerGroup.position.z, this.playerGroup.position.x);
      this.playerGroup.position.x = Math.cos(angle) * 55;
      this.playerGroup.position.z = Math.sin(angle) * 55;
      this.playerVelocity.set(0, 0, 0);
    }

    // Spawn exhaust & thruster particles
    if (currentSpeed > 2) {
      this.spawnTrailParticle();
    }

    // Dynamic Jetpack Thruster Flare
    this.thrusterGlow.intensity = 1.2 + (currentSpeed / maxSpeed) * 1.5 + (this.isBoosting ? 3.0 : 0);

    // Update real-time synthesized jetpack thruster
    sfx.updateJetpack(this.isBoosting || this.isJumping, currentSpeed);

    // Report speed to React UI
    this.callbacks.onSpeedChange(Math.round(currentSpeed * 2));
  }

  // --- Diverse Interactive Props Physics, Collisions & Carrying ---
  private updateInteractiveProps(delta: number) {
    const playerPos = this.playerGroup.position;
    const playerRadius = 0.85;

    for (let i = 0; i < this.interactiveProps.length; i++) {
      const prop = this.interactiveProps[i];

      // 1. If currently held by player
      if (this.heldProp === prop) {
        const carryOffset = new THREE.Vector3(0, 1.25, -0.92).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          this.playerRotation
        );
        prop.pos.copy(playerPos).add(carryOffset);
        prop.group.position.copy(prop.pos);
        prop.group.rotation.y = this.playerRotation;
        continue;
      }

      // 2. Vertical Gravity and Ground Bounce
      prop.velocity.y -= this.gravity * delta;
      prop.pos.y += prop.velocity.y * delta;

      if (prop.pos.y <= prop.height) {
        prop.pos.y = prop.height;
        if (prop.velocity.y < -1.2) {
          if (prop.type === 'sphere') {
            sfx.playOrbBounce();
          } else {
            sfx.playBump();
          }
          prop.velocity.y = -prop.velocity.y * prop.restitution;
        } else {
          prop.velocity.y = 0;
        }
      }

      // 3. Horizontal movement & friction
      prop.pos.x += prop.velocity.x * delta;
      prop.pos.z += prop.velocity.z * delta;

      const horizFriction = Math.pow(prop.friction, delta * 60);
      prop.velocity.x *= horizFriction;
      prop.velocity.z *= horizFriction;

      // 4. Angular tumble
      prop.group.rotation.x += prop.angularVelocity.x * delta;
      prop.group.rotation.y += prop.angularVelocity.y * delta;
      prop.group.rotation.z += prop.angularVelocity.z * delta;
      prop.angularVelocity.multiplyScalar(Math.pow(0.9, delta * 60));

      // 5. Collision with Explorer Character (only if not driving)
      if (!this.isDrivingRover) {
        const dx = prop.pos.x - playerPos.x;
        const dz = prop.pos.z - playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = playerRadius + prop.radius;

        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          const pushDir = new THREE.Vector3(dx, 0, dz).normalize();
          prop.pos.addScaledVector(pushDir, overlap);

          const impactSpeed = this.playerVelocity.length();
          const force = Math.max(impactSpeed * 1.5, 4.0) / prop.mass;
          prop.velocity.addScaledVector(pushDir, force);
          prop.angularVelocity.add(
            new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6)
          );

          if (impactSpeed > 1.0) {
            if (prop.type === 'sphere') {
              sfx.playOrbBounce();
            } else {
              sfx.playBump();
            }
          }
        }
      }

      // 6. Collision with Drivable Cyber Rover (Heavy kinetic mass!)
      const rPos = this.rover.pos;
      const rDistX = prop.pos.x - rPos.x;
      const rDistZ = prop.pos.z - rPos.z;
      const rDist = Math.sqrt(rDistX * rDistX + rDistZ * rDistZ);
      const roverHitRadius = 2.4 + prop.radius;

      if (rDist < roverHitRadius && rDist > 0.001) {
        const overlap = roverHitRadius - rDist;
        const pushDir = new THREE.Vector3(rDistX, 0.25, rDistZ).normalize();
        prop.pos.addScaledVector(pushDir, overlap);

        const rSpeed = Math.abs(this.rover.speed);
        if (rSpeed > 0.8) {
          const impactForce = (rSpeed * 2.2 + 8.0) / prop.mass;
          prop.velocity.addScaledVector(pushDir, impactForce);
          prop.angularVelocity.add(
            new THREE.Vector3((Math.random() - 0.5) * 14, Math.random() * 8, (Math.random() - 0.5) * 14)
          );

          if (prop.type === 'sphere') {
            sfx.playOrbBounce();
          } else {
            sfx.playBump();
          }
          this.rover.speed *= 0.88;
        }
      }

      // 7. Prop-to-Prop Collisions
      for (let j = i + 1; j < this.interactiveProps.length; j++) {
        const otherProp = this.interactiveProps[j];
        if (otherProp === this.heldProp) continue;

        const pdx = otherProp.pos.x - prop.pos.x;
        const pdz = otherProp.pos.z - prop.pos.z;
        const pDist = Math.sqrt(pdx * pdx + pdz * pdz);
        const minPdist = prop.radius + otherProp.radius;

        if (pDist < minPdist && pDist > 0.001) {
          const overlap = 0.5 * (minPdist - pDist);
          const colNormal = new THREE.Vector3(pdx, 0, pdz).normalize();

          prop.pos.addScaledVector(colNormal, -overlap);
          otherProp.pos.addScaledVector(colNormal, overlap);

          // Elastic collision velocity exchange
          const totalMass = prop.mass + otherProp.mass;
          const vRel = prop.velocity.clone().sub(otherProp.velocity);
          const normalVel = vRel.dot(colNormal);

          if (normalVel > 0) {
            const restitution = (prop.restitution + otherProp.restitution) * 0.5;
            const impulse = (-(1 + restitution) * normalVel) / totalMass;

            prop.velocity.addScaledVector(colNormal, impulse * otherProp.mass);
            otherProp.velocity.addScaledVector(colNormal, -impulse * prop.mass);

            if (Math.abs(normalVel) > 1.5) {
              if (prop.type === 'sphere' || otherProp.type === 'sphere') {
                sfx.playOrbBounce();
              } else {
                sfx.playBump();
              }
            }
          }
        }
      }

      // 8. World boundary clamping
      const distFromCenter = Math.sqrt(prop.pos.x * prop.pos.x + prop.pos.z * prop.pos.z);
      if (distFromCenter > 54) {
        const angle = Math.atan2(prop.pos.z, prop.pos.x);
        prop.pos.x = Math.cos(angle) * 54;
        prop.pos.z = Math.sin(angle) * 54;
        prop.velocity.x *= -0.5;
        prop.velocity.z *= -0.5;
      }

      // Sync Three.js group position
      prop.group.position.copy(prop.pos);
    }
  }

  // --- Energy Launch Pads Trigger ---
  private updateLaunchPads(delta: number) {
    const activePos = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;

    this.boostPads.forEach((pad) => {
      if (pad.cooldown > 0) {
        pad.cooldown -= delta;
      }

      const dx = pad.pos.x - activePos.x;
      const dz = pad.pos.z - activePos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.2 && pad.cooldown <= 0) {
        pad.cooldown = 1.2;
        if (this.isDrivingRover) {
          // Launch rover forward with supersonic speed boost!
          this.rover.speed = Math.max(this.rover.speed, 32);
          sfx.playLaunchPad();
        } else {
          // Launch explorer forward and up!
          this.isJumping = true;
          this.verticalVelocity = 11;
          this.playerVelocity.addScaledVector(pad.direction, 22);
          sfx.playLaunchPad();
        }

        // Visual pad flash
        const padMesh = pad.mesh.children[1] as THREE.Mesh;
        if (padMesh) {
          padMesh.scale.set(1.4, 1.4, 1.4);
          setTimeout(() => padMesh.scale.set(1, 1, 1), 200);
        }
      }
    });
  }

  // --- Spawn & Update Skid / Particle Trails ---
  private spawnTrailParticle() {
    if (this.trailParticles.length >= 100) return;

    const pPos = this.playerGroup.position;
    // Spawn behind explorer boots / thrusters
    const rearOffset = new THREE.Vector3(0, 0.2, 0.35).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);
    const spawnPos = pPos.clone().add(rearOffset);

    this.trailParticles.push({
      pos: spawnPos,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.4, Math.random() * 0.3, (Math.random() - 0.5) * 0.4),
      life: 0,
      maxLife: 0.5 + Math.random() * 0.3,
      size: 0.25,
    });
  }

  private updateParticles(delta: number) {
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const p = this.trailParticles[i];
      p.life += delta;
      p.pos.addScaledVector(p.vel, delta);

      if (p.life >= p.maxLife) {
        this.trailParticles.splice(i, 1);
      }
    }

    // Update BufferGeometry positions
    const posAttr = this.trailPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < 120; i++) {
      if (i < this.trailParticles.length) {
        const p = this.trailParticles[i];
        array[i * 3] = p.pos.x;
        array[i * 3 + 1] = p.pos.y;
        array[i * 3 + 2] = p.pos.z;
      } else {
        array[i * 3] = 0;
        array[i * 3 + 1] = -100;
        array[i * 3 + 2] = 0;
      }
    }
    posAttr.needsUpdate = true;
  }

  // --- Shockwave Update ---
  private updateShockwave(delta: number) {
    if (!this.shockwaveActive || !this.shockwaveRing) return;

    this.shockwaveRadius += delta * 24;
    const scale = this.shockwaveRadius;
    this.shockwaveRing.scale.set(scale, scale, 1);

    const mat = this.shockwaveRing.material as THREE.MeshBasicMaterial;
    const opacity = Math.max(0, 1 - this.shockwaveRadius / 14);
    mat.opacity = opacity * 0.85;

    if (this.shockwaveRadius >= 14) {
      this.shockwaveActive = false;
      this.shockwaveRing.visible = false;
    }
  }

  // --- Dynamic Visual Animations ---
  private updateAnimations(time: number) {
    // Station sculptures bobbing & pulsing
    this.stationMeshes.forEach(({ group, beacon, data, platformRing }, idx) => {
      beacon.rotation.y = time * 0.55 + idx;
      if (data.category === 'spawn') {
        beacon.rotation.x = time * 0.35;
      }
      group.position.y = Math.sin(time * 2 + idx) * 0.1;

      // Platform ring subtle breathing pulse
      const ringScale = 1 + Math.sin(time * 3 + idx) * 0.03;
      platformRing.scale.set(ringScale, ringScale, 1);
    });

    // Collectible Data Cores bobbing & spinning
    this.coreMeshes.forEach(({ mesh, collected }, idx) => {
      if (!collected) {
        mesh.rotation.y = time * 1.8 + idx;
        mesh.rotation.x = time * 0.9;
        mesh.position.y = DATA_CORES[idx].position[1] + Math.sin(time * 3 + idx) * 0.25;
      }
    });

    // Destination marker pulse
    if (this.destinationMarker && this.destinationMarker.visible) {
      const scale = 1 + Math.sin(time * 8) * 0.18;
      this.destinationMarker.scale.set(scale, scale, scale);
    }

    // Atmospheric particles slow float
    if (this.particles) {
      this.particles.rotation.y = time * 0.015;
    }

    // Rover charging pad pylon pulse
    if (this.roverDockPad) {
      const pylonBeacon = this.roverDockPad.children[4];
      if (pylonBeacon) {
        const beaconScale = 1 + Math.sin(time * 4) * 0.2;
        pylonBeacon.scale.set(beaconScale, beaconScale, beaconScale);
      }
    }
  }

  // --- Check Proximity to Stations ---
  private checkProximity() {
    let closestStation: StationData | null = null;
    let closestDist = Infinity;
    const activePos = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;

    STATIONS.forEach((station) => {
      const dx = station.position[0] - activePos.x;
      const dz = station.position[2] - activePos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 6.8 && dist < closestDist) {
        closestDist = dist;
        closestStation = station;
      }
    });

    if (closestStation !== this.currentNearbyStation) {
      this.currentNearbyStation = closestStation;
      this.callbacks.onNearbyStation(closestStation);
    }
  }

  // --- Check Collectible Cores Proximity ---
  private checkCoreCollection() {
    const activePos = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;

    this.coreMeshes.forEach((core) => {
      if (!core.collected) {
        const dx = core.mesh.position.x - activePos.x;
        const dz = core.mesh.position.z - activePos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 2.5) {
          core.collected = true;
          this.collectedCoreIds.add(core.id);
          core.mesh.visible = false;
          this.callbacks.onCollectCore(core.id, this.collectedCoreIds.size);
        }
      }
    });
  }

  // --- Proximity & Interactive Action Prompts ---
  private checkActionPrompts() {
    if (this.isTeleporting) {
      if (this.currentActionPrompt !== null) {
        this.currentActionPrompt = null;
        this.callbacks.onActionPrompt?.(null);
      }
      return;
    }

    let nextPrompt: ActionPrompt | null = null;

    if (this.isDrivingRover) {
      nextPrompt = {
        type: 'exit_rover',
        label: 'EXIT CYBER ROVER',
        key: 'R',
      };
    } else if (this.heldProp) {
      nextPrompt = {
        type: 'throw',
        label: `THROW ${this.heldProp.name.toUpperCase()}`,
        key: 'G',
      };
    } else {
      const pPos = this.playerGroup.position;
      const dxRover = pPos.x - this.rover.pos.x;
      const dzRover = pPos.z - this.rover.pos.z;
      const roverDist = Math.sqrt(dxRover * dxRover + dzRover * dzRover);

      // Check proximity to Cyber Rover (generous 6.5m radius covering the charging pad)
      if (roverDist < 6.5) {
        nextPrompt = {
          type: 'enter_rover',
          label: 'DRIVE CYBER ROVER',
          key: 'R',
        };
      } else {
        // Check proximity to nearest interactive prop (horizontal distance < 4.8m)
        let closestProp: InteractiveProp | null = null;
        let minDist = 4.8;

        for (const prop of this.interactiveProps) {
          const dx = pPos.x - prop.pos.x;
          const dz = pPos.z - prop.pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < minDist) {
            minDist = dist;
            closestProp = prop;
          }
        }

        if (closestProp) {
          nextPrompt = {
            type: 'pickup',
            label: `PICK UP ${closestProp.name.toUpperCase()}`,
            key: 'G',
          };
        }
      }
    }

    // Notify React HUD only when prompt changes
    const isDifferent =
      (nextPrompt === null && this.currentActionPrompt !== null) ||
      (nextPrompt !== null && this.currentActionPrompt === null) ||
      (nextPrompt &&
        this.currentActionPrompt &&
        (nextPrompt.type !== this.currentActionPrompt.type || nextPrompt.label !== this.currentActionPrompt.label));

    if (isDifferent) {
      this.currentActionPrompt = nextPrompt;
      this.callbacks.onActionPrompt?.(nextPrompt);
    }
  }

  // --- Interactive Actions: Pick Up & Throw ---
  public togglePickThrow() {
    if (this.isTeleporting || this.isDrivingRover) return;

    if (this.heldProp) {
      this.throwHeldProp();
    } else {
      this.pickUpClosestProp();
    }
  }

  public pickUpClosestProp() {
    if (this.heldProp || this.isDrivingRover) return;

    const pPos = this.playerGroup.position;
    let closest: InteractiveProp | null = null;
    let minDist = 4.8;

    for (const prop of this.interactiveProps) {
      const dx = pPos.x - prop.pos.x;
      const dz = pPos.z - prop.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        closest = prop;
      }
    }

    if (closest) {
      this.heldProp = closest;
      closest.velocity.set(0, 0, 0);
      closest.angularVelocity.set(0, 0, 0);
      sfx.playPickup();
      this.checkActionPrompts();
    } else {
      // Guide player to nearest prop if clicked while further away
      let nearestAny: InteractiveProp | null = null;
      let nearestDist = Infinity;
      for (const prop of this.interactiveProps) {
        const dx = pPos.x - prop.pos.x;
        const dz = pPos.z - prop.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestAny = prop;
        }
      }
      if (nearestAny) {
        this.targetDestination = nearestAny.pos.clone();
        if (this.destinationMarker) {
          this.destinationMarker.position.set(nearestAny.pos.x, 0.05, nearestAny.pos.z);
          this.destinationMarker.visible = true;
        }
      }
    }
  }

  public throwHeldProp(customSpeed?: number) {
    if (!this.heldProp) return;

    const throwDir = new THREE.Vector3(0, 0.38, -1)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation)
      .normalize();

    const speed = customSpeed ?? 17.5 + this.playerVelocity.length() * 0.75;
    this.heldProp.velocity.copy(throwDir).multiplyScalar(speed);
    this.heldProp.angularVelocity.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 12
    );

    sfx.playThrow();
    this.heldProp = null;
    this.checkActionPrompts();
  }

  // --- Interactive Actions: Drive Cyber Rover ---
  public toggleRoverDrive() {
    if (this.isTeleporting) return;

    if (this.isDrivingRover) {
      this.exitRover();
    } else {
      const pPos = this.playerGroup.position;
      const dx = pPos.x - this.rover.pos.x;
      const dz = pPos.z - this.rover.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 6.8) {
        this.enterRover();
      } else {
        // Player clicked Rover button while further away: guide player straight to the rover!
        const approachPos = this.rover.pos
          .clone()
          .add(new THREE.Vector3(-2.0, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rover.rotation));
        this.targetDestination = approachPos;
        if (this.destinationMarker) {
          this.destinationMarker.position.set(approachPos.x, 0.05, approachPos.z);
          this.destinationMarker.visible = true;
        }
      }
    }
  }

  public enterRover() {
    if (this.isDrivingRover) return;

    // Release any held prop safely
    if (this.heldProp) {
      this.heldProp.velocity.set(0, 0, 0);
      this.heldProp = null;
    }

    this.isDrivingRover = true;
    this.characterRoot.visible = false;
    this.contactShadow.visible = false;
    this.rover.speed = 0;
    this.rover.velocity.set(0, 0, 0);
    this.playerVelocity.set(0, 0, 0);

    // Sync positions
    this.playerGroup.position.copy(this.rover.pos);
    this.playerRotation = this.rover.rotation;

    sfx.playVehicleEnter();
    sfx.startRoverEngine();
    this.callbacks.onDriveState?.(true);
    this.checkActionPrompts();
  }

  public exitRover() {
    if (!this.isDrivingRover) return;

    this.isDrivingRover = false;
    this.rover.speed = 0;
    this.rover.velocity.set(0, 0, 0);

    // Step out safely to the left / driver side of the rover
    const exitOffset = new THREE.Vector3(-2.2, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rover.rotation);
    this.playerGroup.position.copy(this.rover.pos).add(exitOffset);
    this.playerGroup.position.y = 0;
    this.playerVelocity.set(0, 0, 0);
    this.playerRotation = this.rover.rotation;
    this.playerGroup.rotation.y = this.playerRotation;
    this.characterRoot.visible = true;
    this.contactShadow.visible = true;

    sfx.stopRoverEngine();
    sfx.playVehicleExit();
    this.callbacks.onDriveState?.(false);
    this.checkActionPrompts();
  }

  // --- Camera Smooth Follow (Heroic 3rd-Person Cyber Explorer View & Chase Cam) ---
  private updateCamera() {
    if (this.isTeleporting) return;

    if (this.isDrivingRover) {
      // Dynamic vehicle chase cam
      const roverCamOffset = new THREE.Vector3(0, 4.8, 8.6).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.rover.rotation
      );
      const targetCamPos = this.rover.pos.clone().add(roverCamOffset);
      this.camera.position.lerp(targetCamPos, 0.12);

      const lookTarget = this.rover.pos
        .clone()
        .add(new THREE.Vector3(0, 1.2, -1.8).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rover.rotation));
      this.camera.lookAt(lookTarget);
      return;
    }

    const playerPos = this.playerGroup.position;
    const camOffset = new THREE.Vector3(0, 5.2, 8.2);
    const targetCamPos = playerPos.clone().add(camOffset);

    this.camera.position.lerp(targetCamPos, 0.08);

    const lookTarget = playerPos.clone().add(new THREE.Vector3(0, 1.35, -1.2));
    this.camera.lookAt(lookTarget);
  }

  // --- Destruction & Cleanup ---
  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.unbindEvents();
    sfx.stopJetpack();
    sfx.stopRoverEngine();

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
