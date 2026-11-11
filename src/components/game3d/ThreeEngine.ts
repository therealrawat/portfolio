import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STATIONS, type StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';
import { AvatarController, type AvatarEmoteName } from './AvatarController';
import officeRoomUrl from './model/objects/office-room-opt.glb?url';
import roverModelUrl from './model/objects/rover-opt.glb?url';
import officeChairOptUrl from './model/objects/office-chair-opt.glb?url';
import officeChairExecUrl from './model/objects/office_chair.glb?url';
import officeDeskUrl from './model/objects/office_desk_with_drawers.glb?url';
import bookcasesUrl from './model/objects/wooden_bookcases_with_books.glb?url';
import hrLadyUrl from './model/objects/hr-lady.glb?url';
import personNpcUrl from './model/objects/person-opt.glb?url';

export type ActionType = 'pickup' | 'throw' | 'enter_rover' | 'exit_rover';

export interface ActionPrompt {
  type: ActionType;
  label: string;
  key: string;
}

export interface LoadProgressState {
  progress: number;
  stage: string;
  ready: boolean;
}

export interface EngineCallbacks {
  onNearbyStation: (station: StationData | null) => void;
  onInspectStation?: (station: StationData) => void;
  onSpeedChange: (speed: number) => void;
  onPlayerState?: (x: number, z: number, rotation: number) => void;
  onTeleportState?: (isTeleporting: boolean) => void;
  onActionPrompt?: (prompt: ActionPrompt | null) => void;
  onDriveState?: (isDriving: boolean) => void;
  onAvatarLoaded?: () => void;
  onEmoteChange?: (emote: AvatarEmoteName | null) => void;
  onLoadProgress?: (state: LoadProgressState) => void;
}

export type PropType = 'chair' | 'exec_chair' | 'books';

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
  body: THREE.Group;
  headlights: THREE.SpotLight[];
  thrusterLight: THREE.PointLight;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  steerAngle: number;
  speed: number;
}

interface OfficeCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

interface OfficeNpc {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  baseRotY: number;
  stationId: string;
}

interface ClickableZoneTarget {
  root: THREE.Object3D;
  stationId: string;
  approachOffset: THREE.Vector3;
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
  private objectLoader = new GLTFLoader();
  private isReady = false;
  private disposed = false;

  // Player / 3D Character Avatar
  public playerGroup: THREE.Group;
  private characterRoot: THREE.Group;
  private avatarController!: AvatarController;
  private pmremTarget: THREE.WebGLRenderTarget | null = null;
  private thrusterGlow: THREE.PointLight;
  private contactShadow: THREE.Mesh;
  private playerVelocity = new THREE.Vector3();
  private playerRotation = 0;
  private lastTurnInput = 0;
  private isBoosting = false;
  private isJumping = false;
  private verticalVelocity = 0;
  private gravity = 22;

  // Click to move target
  private targetDestination: THREE.Vector3 | null = null;
  private destinationMarker: THREE.Group | null = null;

  // Controls state
  private keysPressed: Record<string, boolean> = {};
  private joystickVector = { x: 0, y: 0 };

  // World objects
  private stationMeshes: { data: StationData; group: THREE.Group; light: THREE.PointLight }[] = [];
  private officeColliders: OfficeCollider[] = [];
  private officeNpcs: OfficeNpc[] = [];
  private clickableTargets: ClickableZoneTarget[] = [];
  private pendingInspectStationId: string | null = null;
  private particles!: THREE.Points;

  // Realistic Diverse Interactive Elements & Carrying System
  private interactiveProps: InteractiveProp[] = [];
  private bookPropEntries: InteractiveProp[] = [];
  public heldProp: InteractiveProp | null = null;
  private currentActionPrompt: ActionPrompt | null = null;

  // Drivable Executive Rover Vehicle
  public isDrivingRover = false;
  private rover!: DrivableRover;
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

    // 1. Scene setup (Architectural Corporate Interior & Dusk Exterior Backdrop)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x232830);
    this.scene.fog = new THREE.FogExp2(0x232830, 0.0045);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 250);
    this.camera.position.set(0, 6.2, 14.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Lightweight Base Lights (deferred IBL, tile geometry, and GLB pipeline run asynchronously)
    const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0x8f857b, 1.55);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e4, 1.9);
    dirLight.position.set(22, 38, 24);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0004;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -42;
    dirLight.shadow.camera.right = 42;
    dirLight.shadow.camera.top = 42;
    dirLight.shadow.camera.bottom = -42;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xffe8cc, 0.72);
    rimLight.position.set(-20, 18, -22);
    this.scene.add(rimLight);

    // 5. Build Lightweight Player Rig Placeholder (GLB load deferred to staged preloader)
    const {
      group,
      characterRoot,
      thrusterLight,
      shadow,
      avatarController,
    } = this.buildCharacterRig();
    this.playerGroup = group;
    this.characterRoot = characterRoot;
    this.thrusterGlow = thrusterLight;
    this.contactShadow = shadow;
    this.avatarController = avatarController;
    this.scene.add(this.playerGroup);

    window.addEventListener('resize', this.handleResize);
    void this.initializeWorldAsync();
  }

  private yieldToMain(): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      requestAnimationFrame(done);
      setTimeout(done, 40);
    });
  }

  private async loadGltfTask(url: string, label: string, onLoaded: (gltf: GLTF) => void): Promise<void> {
    try {
      const gltf = await this.objectLoader.loadAsync(url);
      if (this.disposed) return;
      onLoaded(gltf);
    } catch (err) {
      console.warn(`[ThreeEngine] Failed to load ${label}:`, err);
    }
  }

  private async initializeWorldAsync() {
    const report = (progress: number, stage: string, ready = false) => {
      if (this.disposed) return;
      this.callbacks.onLoadProgress?.({ progress, stage, ready });
    };

    report(3, 'Preparing 3D workspace renderer...');
    // Yield two paint frames so the loader overlay renders cleanly & StrictMode unmount #1 aborts early
    await this.yieldToMain();
    if (this.disposed) return;
    await this.yieldToMain();
    if (this.disposed) return;

    // 1. Studio IBL Reflections (PMREM) & Tiled Corporate Environment
    report(9, 'Generating studio lighting & office floor tiles...');
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.pmremTarget.texture;
    this.scene.environmentIntensity = 0.55;
    pmremGenerator.dispose();

    await this.yieldToMain();
    if (this.disposed) return;

    this.buildEnvironment();
    this.buildStations();
    this.buildParticleTrails();
    this.buildShockwaveMesh();
    this.destinationMarker = this.buildDestinationMarker();
    if (this.destinationMarker) {
      this.scene.add(this.destinationMarker);
    }
    this.particles = this.buildAtmosphericParticles();
    this.scene.add(this.particles);
    this.buildTeleportFX();

    await this.yieldToMain();
    if (this.disposed) return;

    // 2. Build Layout Roots, Colliders & Gather Staged GLB Tasks
    report(16, 'Mapping office wings & interactive landmarks...');
    const assetTasks: { label: string; run: () => Promise<void> }[] = [
      {
        label: 'Loading 3D character & animations...',
        run: () => this.avatarController.loadAssets(),
      },
    ];

    this.buildOfficeBuilding(assetTasks);
    this.buildOfficeFurnitureAndNPCs(assetTasks);
    this.buildDrivableRover(assetTasks);
    this.buildDiverseInteractiveProps(assetTasks);

    await this.yieldToMain();
    if (this.disposed) return;

    // 3. Stream & parse all GLB models in a 2-worker pool with frame yields to avoid freezing the UI
    const total = assetTasks.length;
    let nextIdx = 0;
    let completed = 0;

    const runWorker = async () => {
      while (!this.disposed) {
        const idx = nextIdx++;
        if (idx >= total) break;
        const task = assetTasks[idx];
        report(18 + Math.round((completed / total) * 68), task.label);
        await task.run();
        if (this.disposed) break;
        completed++;
        report(18 + Math.round((completed / total) * 68), task.label);
        await this.yieldToMain();
      }
    };

    report(18, 'Loading 3D office models & character...');
    await Promise.all([runWorker(), runWorker()]);
    if (this.disposed) return;

    // 4. Pre-compile WebGL shaders & upload textures behind the curtain to eliminate first-frame stutter
    report(90, 'Pre-compiling WebGL shaders & shadows...');
    await this.yieldToMain();
    if (this.disposed) return;

    try {
      if (typeof this.renderer.compileAsync === 'function') {
        await this.renderer.compileAsync(this.scene, this.camera);
      } else {
        this.renderer.compile(this.scene, this.camera);
      }
    } catch (err) {
      console.warn('[ThreeEngine] Async shader compilation fallback:', err);
      this.renderer.compile(this.scene, this.camera);
    }
    if (this.disposed) return;

    report(97, 'Finalizing scene & lighting warmup...');
    this.camera.position.set(0, 5.2, 14.2);
    this.camera.lookAt(0, 1.35, 4.8);
    await this.yieldToMain();
    if (this.disposed) return;

    // Execute one hidden warm-up frame so GPU shadow maps & textures settle before reveal
    this.renderer.render(this.scene, this.camera);
    await this.yieldToMain();
    if (this.disposed) return;

    // 5. Reveal scene, enable input controls, start animation loop & play avatar entry landing
    this.clock.getDelta();
    this.isReady = true;
    this.bindEvents();
    report(100, 'Executive HQ ready', true);
    this.animate();
    this.avatarController.playLandingEntry();
  }

  // --- Procedural Porcelain Office Floor Tiles Texture ---
  private createOfficeTileTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Commercial stone grout base
    ctx.fillStyle = '#978f86';
    ctx.fillRect(0, 0, 1024, 1024);

    const tiles = 4;
    const tileSize = 1024 / tiles;
    const grout = 5;
    const shades = ['#d7d0c7', '#cfc8bf', '#d3ccc3', '#cbc3b9'];

    for (let gx = 0; gx < tiles; gx++) {
      for (let gy = 0; gy < tiles; gy++) {
        const x = gx * tileSize + grout;
        const y = gy * tileSize + grout;
        const w = tileSize - grout * 2;
        const h = tileSize - grout * 2;

        ctx.fillStyle = shades[(gx + gy) % shades.length];
        ctx.fillRect(x, y, w, h);

        // Subtle stone fleck grain for realism
        for (let s = 0; s < 28; s++) {
          const sx = x + ((s * 97 + gx * 53) % (w - 8));
          const sy = y + ((s * 61 + gy * 89) % (h - 8));
          ctx.fillStyle = s % 2 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(90,82,74,0.08)';
          ctx.fillRect(sx, sy, 3, 3);
        }

        // Crisp architectural bevel highlight along top & left of each tile
        ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.fillRect(x, y, w, 3);
        ctx.fillRect(x, y, 3, h);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 18);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  // --- Enclosed Corporate Office Room, Floor Tiles & Architecture ---
  private buildEnvironment() {
    // 1. Commercial Porcelain Tile Floor Slab (60m x 56m covering X ∈ [-28, 32], Z ∈ [-28, 28])
    const tileTexture = this.createOfficeTileTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: tileTexture,
      roughness: 0.52,
      metalness: 0.06,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 56), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(2, -0.005, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Formal Woven Executive Corridor Carpets & Department Trim
    const corridorMat = new THREE.MeshStandardMaterial({
      color: 0x3a342f,
      roughness: 0.92,
      metalness: 0.04,
    });
    const carpetBorderMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.7,
      metalness: 0.15,
    });

    const addCarpetStrip = (cx: number, cz: number, w: number, d: number) => {
      const matMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), corridorMat);
      matMesh.rotation.x = -Math.PI / 2;
      matMesh.position.set(cx, 0.006, cz);
      matMesh.receiveShadow = true;
      this.scene.add(matMesh);

      const trimMesh = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.16, d + 0.16), carpetBorderMat);
      trimMesh.rotation.x = -Math.PI / 2;
      trimMesh.position.set(cx, 0.003, cz);
      this.scene.add(trimMesh);
    };

    // North-South & East-West Hallway Runners
    addCarpetStrip(0, 0, 3.6, 36);
    addCarpetStrip(3.5, 0, 29, 3.6);

    // 3. Enclosed Architectural Room Perimeter Walls & Panoramic Window Bays
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe6dfd6, roughness: 0.78, metalness: 0.05 });
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x3b332d, roughness: 0.65, metalness: 0.2 });
    const oakTrimMat = new THREE.MeshStandardMaterial({ color: 0x7c5438, roughness: 0.62, metalness: 0.08 });
    const mullionMat = new THREE.MeshStandardMaterial({ color: 0x2a2521, metalness: 0.68, roughness: 0.35 });
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x8ea4b8,
      transparent: true,
      opacity: 0.22,
      roughness: 0.12,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const buildWindowedWall = (x: number, z: number, length: number, rotY: number) => {
      const wallGroup = new THREE.Group();
      wallGroup.position.set(x, 0, z);
      wallGroup.rotation.y = rotY;

      // Low wainscoting concrete sill (0.95m tall)
      const sill = new THREE.Mesh(new THREE.BoxGeometry(length, 0.95, 0.38), plinthMat);
      sill.position.y = 0.475;
      sill.castShadow = true;
      sill.receiveShadow = true;
      wallGroup.add(sill);

      // Oak window ledge
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.44), oakTrimMat);
      ledge.position.y = 0.98;
      wallGroup.add(ledge);

      // Panoramic window glazing
      const glass = new THREE.Mesh(new THREE.BoxGeometry(length - 0.8, 2.55, 0.06), windowGlassMat);
      glass.position.y = 2.28;
      wallGroup.add(glass);

      // Top soffit beam
      const header = new THREE.Mesh(new THREE.BoxGeometry(length, 0.35, 0.42), wallMat);
      header.position.y = 3.72;
      header.castShadow = true;
      wallGroup.add(header);

      // Vertical architectural mullions every 4m
      const bays = Math.max(2, Math.floor(length / 4));
      for (let i = 0; i <= bays; i++) {
        const mx = -length / 2 + (i / bays) * length;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.88, 0.44), mullionMat);
        post.position.set(mx, 1.94, 0);
        post.castShadow = true;
        wallGroup.add(post);
      }

      this.scene.add(wallGroup);
    };

    // North Wall (Z = -27.6, X = -28..+32 -> center X=2, len=60)
    buildWindowedWall(2, -27.6, 60, 0);
    // East Wall (X = +31.6, Z = -27.6..+27.6 -> center Z=0, len=55.2)
    buildWindowedWall(31.6, 0, 55.2, Math.PI / 2);

    // West corner closure walls flanking the existing office-room-opt.glb suite (Z ∈ [-27.6..-23.7] & [+24.0..+27.6])
    [
      [-27.5, -25.6, 4.2],
      [-27.5, 25.8, 4.0],
    ].forEach(([wx, wz, wl]) => {
      const endWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.85, wl), wallMat);
      endWall.position.set(wx, 1.925, wz);
      endWall.castShadow = true;
      endWall.receiveShadow = true;
      this.scene.add(endWall);
    });

    // South Waist-High Glass Partition (Z = +27.6) — keeps camera views 100% clear!
    const southSill = new THREE.Mesh(new THREE.BoxGeometry(60, 0.72, 0.36), plinthMat);
    southSill.position.set(2, 0.36, 27.6);
    southSill.receiveShadow = true;
    this.scene.add(southSill);
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(59.6, 0.42, 0.06), windowGlassMat);
    southGlass.position.set(2, 0.93, 27.6);
    this.scene.add(southGlass);

    // 4. Four Architectural Interior Support Columns Framing Central Atrium
    const colPositions: [number, number][] = [
      [-10.5, -10.5],
      [10.5, -10.5],
      [-10.5, 10.5],
      [10.5, 10.5],
    ];
    colPositions.forEach(([cx, cz]) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(cx, 0, cz);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.28, 0.86), plinthMat);
      base.position.y = 0.14;
      colGroup.add(base);

      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.68, 3.7, 0.68), wallMat);
      shaft.position.y = 2.05;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      colGroup.add(shaft);

      const woodBelt = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.25, 0.74), oakTrimMat);
      woodBelt.position.y = 3.55;
      colGroup.add(woodBelt);

      this.scene.add(colGroup);
    });

    // 5. Metropolitan City Skyline Outside the Office Windows
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.75, metalness: 0.3 });
    const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.28 });
    const towerCount = 24;
    for (let i = 0; i < towerCount; i++) {
      const angle = (i / towerCount) * Math.PI * 2 + (i % 2) * 0.08;
      const radius = 66 + (i % 3) * 12;
      const w = 6 + (i % 4) * 2.2;
      const d = 6 + ((i + 1) % 3) * 2.5;
      const h = 20 + (i % 5) * 7;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), towerMat);
      tower.position.set(Math.cos(angle) * radius, h * 0.5 - 6, Math.sin(angle) * radius);
      tower.rotation.y = -angle;
      this.scene.add(tower);

      for (let f = 1; f <= 3; f++) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.35, d * 1.02), windowGlowMat);
        band.position.y = f * 4.0 - h * 0.15;
        tower.add(band);
      }
    }

    // 6. Indoor Office Planters Flanking Main Corridors & Reception
    const planterPositions: [number, number, number][] = [
      [-4.2, 0, -4.0],
      [4.2, 0, -4.0],
      [-14.5, 0, 5.4],
      [-14.5, 0, -5.8],
      [4.8, 0, -23.4],
      [-4.8, 0, -23.4],
      [-4.6, 0, 23.4],
      [4.8, 0, 23.4],
    ];
    const potMat = new THREE.MeshStandardMaterial({ color: 0x2b2520, roughness: 0.55, metalness: 0.2 });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x1b130d, roughness: 0.95 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.72 });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.85 });

    planterPositions.forEach(([x, y, z]) => {
      const planter = new THREE.Group();
      planter.position.set(x, y, z);

      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.38, 0.65, 16), potMat);
      pot.position.y = 0.325;
      pot.castShadow = true;
      pot.receiveShadow = true;
      planter.add(pot);

      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 16), soilMat);
      soil.position.y = 0.64;
      planter.add(soil);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.85, 8), stemMat);
      stem.position.y = 1.0;
      planter.add(stem);

      [
        [0, 1.48, 0, 0.42],
        [0.2, 1.32, 0.16, 0.28],
        [-0.2, 1.35, -0.14, 0.3],
      ].forEach(([lx, ly, lz, r]) => {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), leafMat);
        crown.position.set(lx, ly, lz);
        crown.castShadow = true;
        planter.add(crown);
      });

      this.scene.add(planter);
    });
  }

  // --- Imported Real 3D Corporate Office Building Wing ---
  private buildOfficeBuilding(assetTasks: { label: string; run: () => Promise<void> }[]) {
    // Colliders for West Glass Suite (X = -25.5.. -16.8, Z = -23.7.. +24.0) & Atrium Pillars
    this.officeColliders = [
      // West glass facade outer wall
      { minX: -26.2, maxX: -25.0, minZ: -24.2, maxZ: 24.6 },
      // Conference table bay 1 (South Wing)
      { minX: -23.2, maxX: -20.5, minZ: 17.5, maxZ: 22.8 },
      // Conference table bay 2 (North Wing)
      { minX: -23.2, maxX: -20.5, minZ: -7.5, maxZ: -2.2 },
      // Workstation cluster 1
      { minX: -23.8, maxX: -20.3, minZ: 5.0, maxZ: 13.8 },
      // Workstation cluster 2
      { minX: -23.8, maxX: -20.3, minZ: -19.2, maxZ: -10.8 },
      // 4 Structural Interior Columns framing central atrium
      { minX: -11.0, maxX: -10.0, minZ: -11.0, maxZ: -10.0 },
      { minX: 10.0, maxX: 11.0, minZ: -11.0, maxZ: -10.0 },
      { minX: -11.0, maxX: -10.0, minZ: 10.0, maxZ: 11.0 },
      { minX: 10.0, maxX: 11.0, minZ: 10.0, maxZ: 11.0 },
    ];

    const officeRoot = new THREE.Group();
    officeRoot.position.set(-25.5, -0.055, 24.0);
    this.scene.add(officeRoot);

    // Warm interior ceiling-wash lighting so desks, chairs, and partitions glow clearly
    [-12, 0, 12].forEach((zOff) => {
      const wash = new THREE.PointLight(0xffedd5, 2.2, 18);
      wash.position.set(-21.2, 2.85, zOff);
      this.scene.add(wash);
    });

    assetTasks.push({
      label: 'Building West Glass Executive Suite...',
      run: () =>
        this.loadGltfTask(officeRoomUrl, 'office-room-opt.glb', (gltf) => {
          const officeScene = gltf.scene;
          officeScene.scale.setScalar(0.0254);
          officeScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
              const isGlass = Boolean(mat?.transparent || (mat?.opacity !== undefined && mat.opacity < 0.99));
              mesh.castShadow = !isGlass;
              mesh.receiveShadow = true;
              if (mat && 'envMapIntensity' in mat) {
                (mat as THREE.MeshStandardMaterial).envMapIntensity = 0.65;
              }
            }
          });
          officeRoot.add(officeScene);
        }),
    });
  }

  // --- Organized Corporate Department Desks, Bookcases & Interactive NPCs ---
  private buildOfficeFurnitureAndNPCs(assetTasks: { label: string; run: () => Promise<void> }[]) {
    const normalizeMeshShadows = (obj: THREE.Object3D) => {
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    };

    // 1. Ordered Office Desks with Drawers (office_desk_with_drawers.glb — front drawer pulls +Z)
    const deskSpecs: { pos: [number, number, number]; rotY: number; halfX: number; halfZ: number }[] = [
      { pos: [0, 0, -3.2], rotY: 0, halfX: 1.0, halfZ: 0.5 }, // Executive Brief Reception
      { pos: [0, 0, -20.5], rotY: 0, halfX: 1.0, halfZ: 0.5 }, // Case Studies Briefing
      { pos: [21.8, 0, -2.3], rotY: -Math.PI / 2, halfX: 0.5, halfZ: 1.0 }, // Capabilities Pod N
      { pos: [21.8, 0, 2.3], rotY: -Math.PI / 2, halfX: 0.5, halfZ: 1.0 }, // Capabilities Pod S
      { pos: [-15.0, 0, -3.6], rotY: Math.PI / 2, halfX: 0.5, halfZ: 1.0 }, // Track Record Check-In
      { pos: [0, 0, 21.5], rotY: Math.PI, halfX: 1.0, halfZ: 0.5 }, // Hire-Me HR Desk
    ];

    const deskRoots: THREE.Group[] = [];
    deskSpecs.forEach((spec) => {
      const root = new THREE.Group();
      root.position.set(...spec.pos);
      root.rotation.y = spec.rotY;
      this.scene.add(root);
      deskRoots.push(root);

      this.officeColliders.push({
        minX: spec.pos[0] - spec.halfX,
        maxX: spec.pos[0] + spec.halfX,
        minZ: spec.pos[2] - spec.halfZ,
        maxZ: spec.pos[2] + spec.halfZ,
      });
    });

    assetTasks.push({
      label: 'Installing department executive desks...',
      run: () =>
        this.loadGltfTask(officeDeskUrl, 'office_desk_with_drawers.glb', (gltf) => {
          const template = new THREE.Group();
          const inner = gltf.scene;
          // Center raw desk [-1.233..0.413] -> center X=+0.410, Z=+0.002, flush at y=0
          inner.position.set(0.41, 0, 0.002);
          normalizeMeshShadows(inner);
          template.add(inner);
          template.scale.setScalar(1.08);

          deskRoots.forEach((root) => {
            root.add(template.clone());
          });
        }),
    });

    // 2. Ordered Wooden Bookcases & Interactive Book Stacks (parsed once from wooden_bookcases_with_books.glb)
    const tallPlacements: { pos: [number, number, number]; rotY: number; halfX: number; halfZ: number }[] = [
      { pos: [-1.5, 0, -23.6], rotY: Math.PI, halfX: 0.65, halfZ: 0.32 },
      { pos: [0, 0, -23.6], rotY: Math.PI, halfX: 0.65, halfZ: 0.32 },
      { pos: [1.5, 0, -23.6], rotY: Math.PI, halfX: 0.65, halfZ: 0.32 },
      { pos: [24.2, 0, 0], rotY: Math.PI / 2, halfX: 0.32, halfZ: 0.65 },
      { pos: [3.0, 0, 23.2], rotY: 0, halfX: 0.65, halfZ: 0.32 },
    ];
    const tallRoots: THREE.Group[] = [];
    tallPlacements.forEach((spec) => {
      const root = new THREE.Group();
      root.position.set(...spec.pos);
      root.rotation.y = spec.rotY;
      this.scene.add(root);
      tallRoots.push(root);
      this.officeColliders.push({
        minX: spec.pos[0] - spec.halfX,
        maxX: spec.pos[0] + spec.halfX,
        minZ: spec.pos[2] - spec.halfZ,
        maxZ: spec.pos[2] + spec.halfZ,
      });
    });

    const smallPlacements: { pos: [number, number, number]; rotY: number; radius: number }[] = [
      { pos: [-3.2, 0, -22.2], rotY: Math.PI * 0.85, radius: 0.65 },
      { pos: [3.2, 0, -22.2], rotY: -Math.PI * 0.85, radius: 0.65 },
      { pos: [-15.2, 0, 3.6], rotY: Math.PI * 0.5, radius: 0.65 },
    ];
    const smallRoots: THREE.Group[] = [];
    smallPlacements.forEach((spec) => {
      const root = new THREE.Group();
      root.position.set(...spec.pos);
      root.rotation.y = spec.rotY;
      this.scene.add(root);
      smallRoots.push(root);
      this.officeColliders.push({
        minX: spec.pos[0] - spec.radius,
        maxX: spec.pos[0] + spec.radius,
        minZ: spec.pos[2] - spec.radius,
        maxZ: spec.pos[2] + spec.radius,
      });
    });

    assetTasks.push({
      label: 'Organizing library bookcases & volumes...',
      run: () =>
        this.loadGltfTask(bookcasesUrl, 'wooden_bookcases_with_books.glb', (gltf) => {
          gltf.scene.updateMatrixWorld(true);
          const tallTemplate = new THREE.Group();
          const smallTemplate = new THREE.Group();
          const bookStackTemplate = new THREE.Group();

          gltf.scene.traverse((child) => {
            if (!(child as THREE.Mesh).isMesh) return;
            const mesh = child as THREE.Mesh;

            // Clone baked world-space geometry cleanly so Sketchfab parent scales/rotations never misalign
            const bakedGeom = mesh.geometry.clone();
            bakedGeom.applyMatrix4(mesh.matrixWorld);

            if (mesh.name.startsWith('Victorian_Bookcase_Tall')) {
              bakedGeom.translate(0, 0, -0.01);
              const m = new THREE.Mesh(bakedGeom, mesh.material);
              m.castShadow = true;
              m.receiveShadow = true;
              tallTemplate.add(m);

              // Also build an interactive tabletop/floor Book Stack from Books_1 & Books_4
              if (mesh.name.includes('_Books_1_') || mesh.name.includes('_Books_4_')) {
                const stackGeom = mesh.geometry.clone();
                stackGeom.applyMatrix4(mesh.matrixWorld);
                stackGeom.computeBoundingBox();
                const b = stackGeom.boundingBox!;
                const cx = (b.min.x + b.max.x) * 0.5;
                const cz = (b.min.z + b.max.z) * 0.5;
                const targetMinY = mesh.name.includes('_Books_1_') ? 0 : 0.24;
                stackGeom.translate(-cx, -b.min.y + targetMinY, -cz);
                const bm = new THREE.Mesh(stackGeom, mesh.material);
                bm.castShadow = true;
                bm.receiveShadow = true;
                bookStackTemplate.add(bm);
              }
            } else if (mesh.name.startsWith('Victorian_Bookcase_Small')) {
              bakedGeom.translate(-1.01, 0, -0.35);
              const m = new THREE.Mesh(bakedGeom, mesh.material);
              m.castShadow = true;
              m.receiveShadow = true;
              smallTemplate.add(m);
            }
          });

          tallTemplate.scale.setScalar(1.15);
          tallRoots.forEach((root) => root.add(tallTemplate.clone()));

          smallTemplate.scale.setScalar(1.12);
          smallRoots.forEach((root) => root.add(smallTemplate.clone()));

          bookStackTemplate.scale.setScalar(1.3);
          this.bookPropEntries.forEach((entry) => {
            const ph = entry.group.children[0] as THREE.Mesh | undefined;
            if (ph) {
              entry.group.remove(ph);
              ph.geometry?.dispose();
              if (ph.material) (ph.material as THREE.Material).dispose();
            }
            entry.group.add(bookStackTemplate.clone());
          });
        }),
    });

    // 3. Interactive HR Representative (hr-lady.glb) in the "Hire-Me Zone" (South [0, 0, +20])
    const spawnNpcLabel = (text: string, accent: string): THREE.Sprite => {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 84;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(20, 17, 15, 0.9)';
      ctx.roundRect(8, 8, 464, 68, 18);
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.roundRect(8, 8, 464, 68, 18);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 240, 42);
      const tex = new THREE.CanvasTexture(canvas);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sp.scale.set(2.4, 0.42, 1);
      return sp;
    };

    const hrRoot = new THREE.Group();
    hrRoot.position.set(-1.75, 0, 20.2);
    hrRoot.rotation.y = Math.PI; // Faces -Z North toward incoming visitors
    this.scene.add(hrRoot);

    const hrPivot = new THREE.Group();
    hrRoot.add(hrPivot);

    const hrShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.58, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })
    );
    hrShadow.rotation.x = -Math.PI / 2;
    hrShadow.position.y = 0.015;
    hrRoot.add(hrShadow);

    // Subtle green hiring spotlight ring around HR Representative
    const hrRing = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.8, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    hrRing.rotation.x = -Math.PI / 2;
    hrRing.position.y = 0.02;
    hrRoot.add(hrRing);

    const hrBadge = spawnNpcLabel('HR PARTNER • CLICK OR [E]', '#10b981');
    hrBadge.position.set(0, 2.18, 0);
    hrRoot.add(hrBadge);

    assetTasks.push({
      label: 'Welcoming HR Partner to Hire-Me zone...',
      run: () =>
        this.loadGltfTask(hrLadyUrl, 'hr-lady.glb', (gltf) => {
          const model = gltf.scene;
          // Raw cm unit -> 0.01m = 1.73m tall; center [0.254, 86.5, 4.2]
          model.scale.setScalar(0.01);
          model.position.set(-0.0025, 0.001, -0.042);
          normalizeMeshShadows(model);
          hrPivot.add(model);
        }),
    });

    this.officeColliders.push({ minX: -2.25, maxX: -1.25, minZ: 19.7, maxZ: 20.7 });
    this.officeNpcs.push({ root: hrRoot, bodyPivot: hrPivot, baseRotY: Math.PI, stationId: 'contact' });
    this.clickableTargets.push({ root: hrRoot, stationId: 'contact', approachOffset: new THREE.Vector3(0.4, 0, -2.2) });

    // 4. Interactive Client & Advisory Lead (person-opt.glb) beside Reception Lobby ([0, 0, 0])
    const partnerRoot = new THREE.Group();
    partnerRoot.position.set(2.35, 0, -2.6);
    partnerRoot.rotation.y = -0.25;
    this.scene.add(partnerRoot);

    const partnerPivot = new THREE.Group();
    partnerRoot.add(partnerPivot);

    const partnerShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })
    );
    partnerShadow.rotation.x = -Math.PI / 2;
    partnerShadow.position.y = 0.015;
    partnerRoot.add(partnerShadow);

    const partnerBadge = spawnNpcLabel('CLIENT ADVISOR • [E]', '#f97316');
    partnerBadge.position.set(0, 2.18, 0);
    partnerRoot.add(partnerBadge);

    assetTasks.push({
      label: 'Welcoming Client Advisor to reception...',
      run: () =>
        this.loadGltfTask(personNpcUrl, 'person-opt.glb', (gltf) => {
          const model = gltf.scene;
          normalizeMeshShadows(model);
          partnerPivot.add(model);
        }),
    });

    this.officeColliders.push({ minX: 1.9, maxX: 2.8, minZ: -3.05, maxZ: -2.15 });
    this.officeNpcs.push({ root: partnerRoot, bodyPivot: partnerPivot, baseRotY: -0.25, stationId: 'spawn' });
    this.clickableTargets.push({
      root: partnerRoot,
      stationId: 'spawn',
      approachOffset: new THREE.Vector3(-0.35, 0, 2.1),
    });
  }

  private clampToOfficeRoom(pos: THREE.Vector3, radius: number, bounceVel?: { x: number; z: number }, extraMinX?: number) {
    const minX = extraMinX !== undefined ? Math.max(extraMinX, -26.8 + radius) : -26.8 + radius;
    const maxX = 30.8 - radius;
    const minZ = -26.8 + radius;
    const maxZ = 26.8 - radius;

    let bumped = false;
    if (pos.x < minX) {
      pos.x = minX;
      if (bounceVel) bounceVel.x = Math.abs(bounceVel.x) * 0.45;
      bumped = true;
    } else if (pos.x > maxX) {
      pos.x = maxX;
      if (bounceVel) bounceVel.x = -Math.abs(bounceVel.x) * 0.45;
      bumped = true;
    }
    if (pos.z < minZ) {
      pos.z = minZ;
      if (bounceVel) bounceVel.z = Math.abs(bounceVel.z) * 0.45;
      bumped = true;
    } else if (pos.z > maxZ) {
      pos.z = maxZ;
      if (bounceVel) bounceVel.z = -Math.abs(bounceVel.z) * 0.45;
      bumped = true;
    }
    return bumped;
  }

  private applyOfficeCollisions(pos: THREE.Vector3, radius: number, extraMinX?: number) {
    if (extraMinX !== undefined && pos.x < extraMinX) {
      pos.x = extraMinX;
    }

    for (const box of this.officeColliders) {
      const closestX = Math.max(box.minX, Math.min(pos.x, box.maxX));
      const closestZ = Math.max(box.minZ, Math.min(pos.z, box.maxZ));
      const dx = pos.x - closestX;
      const dz = pos.z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        if (distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const push = radius - dist;
          pos.x += (dx / dist) * push;
          pos.z += (dz / dist) * push;
        } else {
          // Inside box: push out toward nearest face
          const dLeft = Math.abs(pos.x - box.minX);
          const dRight = Math.abs(box.maxX - pos.x);
          const dBack = Math.abs(pos.z - box.minZ);
          const dFront = Math.abs(box.maxZ - pos.z);
          const minEdge = Math.min(dLeft, dRight, dBack, dFront);
          if (minEdge === dLeft) pos.x = box.minX - radius;
          else if (minEdge === dRight) pos.x = box.maxX + radius;
          else if (minEdge === dBack) pos.z = box.minZ - radius;
          else pos.z = box.maxZ + radius;
        }
      }
    }
  }

  // --- Real 3D Character Rig + Animation Controller ---
  private buildCharacterRig() {
    const group = new THREE.Group();
    group.position.set(0, 0, 6);

    // Contact shadow underneath feet
    const shadowGeo = new THREE.CircleGeometry(0.68, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    // Root node for loaded GLB character, teleport scale, and lean
    const characterRoot = new THREE.Group();
    group.add(characterRoot);

    // Warm cybernetic aura / boost glow at feet
    const thrusterLight = new THREE.PointLight(0xf97316, 1.4, 5.5);
    thrusterLight.position.set(0, 0.35, 0.25);
    characterRoot.add(thrusterLight);

    const avatarController = new AvatarController(
      characterRoot,
      {
        onLoaded: () => {
          this.callbacks.onAvatarLoaded?.();
        },
        onEntryLand: () => {
          // Trigger subtle orange impact shockwave ring when hero drops onto spawn pad
          if (this.shockwaveRing) {
            this.shockwaveRing.position.set(this.playerGroup.position.x, 0.08, this.playerGroup.position.z);
            this.shockwaveRing.visible = true;
            this.shockwaveRadius = 0.4;
            this.shockwaveActive = true;
          }
        },
        onStrikeImpact: (kind) => {
          this.applyStrikeImpulse(kind);
        },
        onEmoteChange: (emote) => {
          this.callbacks.onEmoteChange?.(emote);
        },
      },
      { deferLoad: true, deferEntry: true }
    );

    return {
      group,
      characterRoot,
      thrusterLight,
      shadow,
      avatarController,
    };
  }

  public triggerAvatarEmote(emote: AvatarEmoteName) {
    if (!this.isReady || this.isTeleporting || this.isDrivingRover) return;
    // Cancel ground destination when performing stationary/combat action
    this.targetDestination = null;
    if (this.destinationMarker) this.destinationMarker.visible = false;
    this.playerVelocity.multiplyScalar(0.25);

    this.avatarController.triggerEmote(emote);
  }

  private applyStrikeImpulse(kind: 'punch' | 'kick') {
    const pPos = this.playerGroup.position;
    const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);

    // If holding an object, punch/kick launches it forward with kinetic force!
    if (this.heldProp) {
      this.throwHeldProp(kind === 'kick' ? 24 : 20);
      return;
    }

    // Check props in strike cone in front of player (range 3.2m)
    let hitAny = false;
    for (const prop of this.interactiveProps) {
      const toProp = new THREE.Vector3(prop.pos.x - pPos.x, 0, prop.pos.z - pPos.z);
      const dist = toProp.length();
      if (dist > 3.2) continue;

      const dot = dist > 0.01 ? toProp.clone().normalize().dot(forwardDir) : 1;
      if (dot > 0.25 || dist < 1.3) {
        hitAny = true;
        const launchPower = (kind === 'kick' ? 22 : 17) / Math.max(0.7, prop.mass);
        const launchVec = forwardDir.clone().multiplyScalar(launchPower);
        launchVec.y = kind === 'kick' ? 8.5 / Math.sqrt(prop.mass) : 4.2 / Math.sqrt(prop.mass);

        prop.velocity.add(launchVec);
        prop.angularVelocity.add(
          new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 14)
        );
        sfx.playBump();
      }
    }

    if (hitAny && this.shockwaveRing) {
      const impactPt = pPos.clone().addScaledVector(forwardDir, 1.1);
      this.shockwaveRing.position.set(impactPt.x, 0.08, impactPt.z);
      this.shockwaveRing.visible = true;
      this.shockwaveRadius = 0.25;
      this.shockwaveActive = true;
    }
  }

  // --- Drivable Imported 3D Rover & Executive Parking Bay ---
  private buildDrivableRover(assetTasks: { label: string; run: () => Promise<void> }[]) {
    // 1. Marked Indoor EV Parking Bay on tiled South-East floor [17, 0, 16]
    const padGroup = new THREE.Group();
    padGroup.position.set(17, 0, 16);
    padGroup.rotation.y = Math.PI * 0.78;
    this.scene.add(padGroup);

    // Charcoal rubberized floor mat flush on tiles
    const matMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 5.4),
      new THREE.MeshStandardMaterial({ color: 0x262320, roughness: 0.85, metalness: 0.1 })
    );
    matMesh.rotation.x = -Math.PI / 2;
    matMesh.position.y = 0.012;
    matMesh.receiveShadow = true;
    padGroup.add(matMesh);

    // Painted architectural bay stripe border
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.75 });
    const makeStripe = (w: number, d: number, x: number, z: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lineMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.018, z);
      padGroup.add(m);
    };
    makeStripe(4.3, 0.12, 0, 2.7);
    makeStripe(4.3, 0.12, 0, -2.7);
    makeStripe(0.12, 5.4, 2.1, 0);
    makeStripe(0.12, 5.4, -2.1, 0);

    // Subtle EV Charger Bollard beside parking bay
    const bollard = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 1.32, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x1c1714, metalness: 0.75, roughness: 0.25 })
    );
    bollard.position.set(0, 0.66, 3.05);
    bollard.castShadow = true;
    padGroup.add(bollard);

    const bollardLight = new THREE.PointLight(0xf97316, 1.2, 4.5);
    bollardLight.position.set(0, 1.4, 3.05);
    padGroup.add(bollardLight);

    // 2. Imported 3D Rover Root
    const roverGroup = new THREE.Group();
    roverGroup.position.set(17, 0, 16);
    roverGroup.rotation.y = Math.PI * 0.78;
    this.scene.add(roverGroup);

    const roverBody = new THREE.Group();
    roverGroup.add(roverBody);

    // Sleek wireframe placeholder while rover-opt.glb streams
    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.4, 3.4),
      new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true, transparent: true, opacity: 0.55 })
    );
    placeholder.position.y = 0.75;
    roverBody.add(placeholder);

    assetTasks.push({
      label: 'Parking Executive Rover in mobility bay...',
      run: () =>
        this.loadGltfTask(roverModelUrl, 'rover-opt.glb', (gltf) => {
          roverBody.remove(placeholder);
          placeholder.geometry.dispose();
          (placeholder.material as THREE.Material).dispose();

          const model = gltf.scene;
          // Raw model front is -X: rotate -PI/2 around Y so front points -Z forward
          model.rotation.y = -Math.PI / 2;
          model.scale.setScalar(0.00265);
          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          const ctr = box.getCenter(new THREE.Vector3());
          model.position.x -= ctr.x;
          model.position.z -= ctr.z;
          model.position.y -= box.min.y;

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
              if (mat && 'envMapIntensity' in mat) {
                (mat as THREE.MeshStandardMaterial).envMapIntensity = 0.85;
              }
            }
          });

          roverBody.add(model);
        }),
    });

    // Warm Amber Rear Taillight Glow
    const thrusterLight = new THREE.PointLight(0xf97316, 1.6, 6);
    thrusterLight.position.set(0, 0.7, 2.0);
    roverGroup.add(thrusterLight);

    // Dual Functional Front Headlights
    const headlights: THREE.SpotLight[] = [];
    [-0.68, 0.68].forEach((x) => {
      const spot = new THREE.SpotLight(0xffedd5, 2.8, 28, 0.52, 0.4, 1.5);
      spot.position.set(x, 0.72, -1.7);
      spot.target.position.set(x * 0.3, 0, -20);
      roverGroup.add(spot.target);
      roverGroup.add(spot);
      headlights.push(spot);
    });

    this.rover = {
      group: roverGroup,
      body: roverBody,
      headlights,
      thrusterLight,
      pos: roverGroup.position,
      velocity: new THREE.Vector3(),
      rotation: roverGroup.rotation.y,
      steerAngle: 0,
      speed: 0,
    };
  }

  // --- Interactive Office Objects ONLY from src/components/game3d/model/objects ---
  private buildDiverseInteractiveProps(assetTasks: { label: string; run: () => Promise<void> }[]) {
    let propId = 0;

    // 1. 4 Executive Swivel Chairs (office_chair.glb — faces +Z) placed behind department desks
    const execChairConfigs: { pos: [number, number, number]; rotY: number; name: string }[] = [
      { pos: [0, 0, -4.15], rotY: 0, name: 'Reception Exec Chair' },
      { pos: [0, 0, -21.45], rotY: 0, name: 'Briefing Exec Chair' },
      { pos: [-15.9, 0, -3.6], rotY: Math.PI / 2, name: 'Suite Exec Chair' },
      { pos: [0, 0, 22.45], rotY: Math.PI, name: 'HR Desk Chair' },
    ];
    const execChairEntries: InteractiveProp[] = [];

    execChairConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(...cfg.pos);
      group.rotation.y = cfg.rotY;

      const ph = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.0, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x3b3530, roughness: 0.75 })
      );
      ph.position.y = 0.5;
      ph.castShadow = true;
      group.add(ph);

      this.scene.add(group);
      const entry: InteractiveProp = {
        id: propId++,
        type: 'exec_chair',
        name: cfg.name,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        radius: 0.62,
        height: 0,
        mass: 1.2,
        restitution: 0.22,
        friction: 0.89,
        baseColor: 0x3b3530,
      };
      this.interactiveProps.push(entry);
      execChairEntries.push(entry);
    });

    assetTasks.push({
      label: 'Setting executive leather seating...',
      run: () =>
        this.loadGltfTask(officeChairExecUrl, 'office_chair.glb', (gltf) => {
          const template = new THREE.Group();
          const inner = gltf.scene;
          inner.scale.setScalar(0.01);
          inner.position.set(0.065, 0.001, -0.103);
          inner.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });
          template.add(inner);

          execChairEntries.forEach((entry) => {
            const ph = entry.group.children[0] as THREE.Mesh | undefined;
            if (ph) {
              entry.group.remove(ph);
              ph.geometry?.dispose();
              if (ph.material) (ph.material as THREE.Material).dispose();
            }
            entry.group.add(template.clone());
          });
        }),
    });

    // 2. 6 Ergonomic Mesh Task Chairs (office-chair-opt.glb — faces +X) arranged neatly at desks & lounges
    const taskChairConfigs: { pos: [number, number, number]; rotY: number; name: string }[] = [
      { pos: [-1.1, 0, -1.6], rotY: Math.PI * 0.58, name: 'Lobby Guest Chair L' },
      { pos: [1.1, 0, -1.6], rotY: Math.PI * 0.42, name: 'Lobby Guest Chair R' },
      { pos: [-1.8, 0, -19.2], rotY: Math.PI * 0.35, name: 'Library Reading Chair' },
      { pos: [20.4, 0, -2.3], rotY: 0, name: 'Workstation Chair N' },
      { pos: [20.4, 0, 2.3], rotY: 0, name: 'Workstation Chair S' },
      { pos: [0.2, 0, 19.7], rotY: -Math.PI / 2, name: 'Interview Guest Chair' },
    ];
    const taskChairEntries: InteractiveProp[] = [];

    taskChairConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(...cfg.pos);
      group.rotation.y = cfg.rotY;

      const ph = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 1.0, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.7 })
      );
      ph.position.y = 0.5;
      ph.castShadow = true;
      group.add(ph);

      this.scene.add(group);
      const entry: InteractiveProp = {
        id: propId++,
        type: 'chair',
        name: cfg.name,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        radius: 0.64,
        height: 0,
        mass: 1.15,
        restitution: 0.22,
        friction: 0.89,
        baseColor: 0x57534e,
      };
      this.interactiveProps.push(entry);
      taskChairEntries.push(entry);
    });

    assetTasks.push({
      label: 'Placing ergonomic workstation & visitor chairs...',
      run: () =>
        this.loadGltfTask(officeChairOptUrl, 'office-chair-opt.glb', (gltf) => {
          const template = gltf.scene;
          template.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });
          taskChairEntries.forEach((entry) => {
            const ph = entry.group.children[0] as THREE.Mesh | undefined;
            if (ph) {
              entry.group.remove(ph);
              ph.geometry?.dispose();
              if (ph.material) (ph.material as THREE.Material).dispose();
            }
            entry.group.add(template.clone());
          });
        }),
    });

    // 3. 4 Reference Book Stacks (extracted from wooden_bookcases_with_books.glb in buildOfficeFurnitureAndNPCs)
    const bookConfigs: { pos: [number, number, number]; rotY: number; name: string }[] = [
      { pos: [-2.6, 0, -19.8], rotY: 0.25, name: 'Architecture Book Stack' },
      { pos: [2.4, 0, -21.0], rotY: -0.4, name: 'Product Strategy Books' },
      { pos: [23.0, 0, 4.2], rotY: 0.9, name: 'Systems Engineering Books' },
      { pos: [1.8, 0, 21.8], rotY: -0.2, name: 'Portfolio Reference Stack' },
    ];

    bookConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(...cfg.pos);
      group.rotation.y = cfg.rotY;

      const ph = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.35, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 })
      );
      ph.position.y = 0.175;
      ph.castShadow = true;
      group.add(ph);

      this.scene.add(group);
      const entry: InteractiveProp = {
        id: propId++,
        type: 'books',
        name: cfg.name,
        group,
        pos: group.position,
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        radius: 0.5,
        height: 0,
        mass: 0.7,
        restitution: 0.25,
        friction: 0.88,
        baseColor: 0x92400e,
      };
      this.interactiveProps.push(entry);
      this.bookPropEntries.push(entry);
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
    if (!this.isReady) return;
    this.shockwaveActive = true;
    this.shockwaveRadius = 1;
    const blastOrigin = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;

    if (!this.isDrivingRover && !this.heldProp && this.playerVelocity.length() < 1.2) {
      this.avatarController.triggerEmote('punch');
    }

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

  // --- Build Executive Department Rugs & Architectural Directory Signage ---
  private buildStations() {
    const zoneLayouts: Record<
      string,
      {
        rugOffset: [number, number];
        rugSize: [number, number];
        totemOffset: [number, number];
        totemRotY: number;
        approachOffset: [number, number, number];
      }
    > = {
      spawn: { rugOffset: [0, -1.6], rugSize: [8.4, 7.2], totemOffset: [-2.7, -3.2], totemRotY: 0.15, approachOffset: [0, 0, 2.5] },
      projects: { rugOffset: [0, -0.5], rugSize: [9.8, 8.8], totemOffset: [2.7, -0.5], totemRotY: -0.15, approachOffset: [0, 0, 3.0] },
      tech: { rugOffset: [1.5, 0], rugSize: [9.5, 10.6], totemOffset: [3.2, -4.4], totemRotY: -Math.PI * 0.42, approachOffset: [-3.2, 0, 0] },
      experience: { rugOffset: [-1.0, 0], rugSize: [7.6, 9.2], totemOffset: [-2.3, -5.3], totemRotY: Math.PI * 0.45, approachOffset: [1.5, 0, 1.5] },
      contact: { rugOffset: [0, 0.8], rugSize: [9.8, 8.6], totemOffset: [2.7, 0.5], totemRotY: Math.PI - 0.15, approachOffset: [0, 0, -2.8] },
    };

    STATIONS.forEach((station) => {
      const group = new THREE.Group();
      group.position.set(...station.position);
      const layout = zoneLayouts[station.id] ?? zoneLayouts.spawn;
      const colorHex = new THREE.Color(station.color);

      // 1. Woven Department Area Rug on floor tiles (zero glowing UFO cylinders!)
      const rugTrim = new THREE.Mesh(
        new THREE.PlaneGeometry(layout.rugSize[0] + 0.18, layout.rugSize[1] + 0.18),
        new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.48 })
      );
      rugTrim.rotation.x = -Math.PI / 2;
      rugTrim.position.set(layout.rugOffset[0], 0.004, layout.rugOffset[1]);
      group.add(rugTrim);

      const rug = new THREE.Mesh(
        new THREE.PlaneGeometry(layout.rugSize[0], layout.rugSize[1]),
        new THREE.MeshStandardMaterial({ color: 0x2f2a26, roughness: 0.94, metalness: 0.04 })
      );
      rug.rotation.x = -Math.PI / 2;
      rug.position.set(layout.rugOffset[0], 0.008, layout.rugOffset[1]);
      rug.receiveShadow = true;
      group.add(rug);

      // 2. Stationary Architectural Oak & Bronze Zone Directory Totem (no floating cones/orbs)
      const totemGroup = new THREE.Group();
      totemGroup.position.set(layout.totemOffset[0], 0, layout.totemOffset[1]);
      totemGroup.rotation.y = layout.totemRotY;

      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.12, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x241f1b, roughness: 0.55, metalness: 0.4 })
      );
      plinth.position.y = 0.06;
      plinth.castShadow = true;
      totemGroup.add(plinth);

      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, 1.85, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.62, metalness: 0.12 })
      );
      pillar.position.y = 1.04;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      totemGroup.add(pillar);

      const accentBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.08, 0.16),
        new THREE.MeshBasicMaterial({ color: colorHex })
      );
      accentBar.position.y = 1.98;
      totemGroup.add(accentBar);

      const billboard = this.createStationBillboard(station.name.toUpperCase(), station.tagline, station.color);
      billboard.position.set(0, 2.75, 0);
      totemGroup.add(billboard);

      group.add(totemGroup);

      // Allow visitors to click any Zone Totem directly to navigate & open that zone
      this.clickableTargets.push({
        root: totemGroup,
        stationId: station.id,
        approachOffset: new THREE.Vector3(...layout.approachOffset),
      });

      const stationLight = new THREE.PointLight(0xfff1dc, 1.35, 13);
      stationLight.position.set(layout.rugOffset[0], 3.4, layout.rugOffset[1]);
      group.add(stationLight);

      this.scene.add(group);
      this.stationMeshes.push({ data: station, group, light: stationLight });
    });
  }

  // --- Dynamic Corporate Kiosk Signboard Texture ---
  private createStationBillboard(title: string, subtitle: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(18, 14, 11, 0.92)';
    ctx.roundRect(14, 14, 612, 132, 24);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.roundRect(14, 14, 612, 132, 24);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 320, 62);

    ctx.fillStyle = '#d6d3d1';
    ctx.font = '600 20px "Outfit", sans-serif';
    ctx.fillText(subtitle.slice(0, 52), 320, 108);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(5.4, 1.35, 1);
    return sprite;
  }

  // --- Event Listeners ---
  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

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
    if (!this.isReady) return;
    const active = document.activeElement as HTMLElement | null;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }

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

    if (
      e.code === 'KeyW' ||
      e.code === 'KeyS' ||
      e.code === 'KeyA' ||
      e.code === 'KeyD' ||
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight'
    ) {
      this.targetDestination = null;
      this.pendingInspectStationId = null;
      if (this.destinationMarker) this.destinationMarker.visible = false;
    }

    if (e.code === 'KeyF' || e.code === 'KeyH') {
      this.triggerShockwave();
    }

    if (e.code === 'KeyG') {
      this.togglePickThrow();
    }

    if (e.code === 'KeyR') {
      this.toggleRoverDrive();
    }

    // Character Martial-Arts & Workout Emote Controls (when on foot)
    if (!this.isDrivingRover && !this.isTeleporting) {
      if (e.code === 'KeyQ' || e.code === 'Digit1') {
        this.triggerAvatarEmote('punch');
      } else if (e.code === 'KeyX' || e.code === 'Digit2') {
        this.triggerAvatarEmote('kick');
      } else if (e.code === 'KeyC' || e.code === 'Digit3') {
        this.triggerAvatarEmote('kick_punch');
      } else if (e.code === 'KeyV' || e.code === 'Digit4') {
        this.triggerAvatarEmote('pushups');
      }
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
    if (!this.isReady || this.isTeleporting) return;

    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target !== this.renderer.domElement) return;

    this.pendingInspectStationId = null;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Direct click on Interactive Office NPCs (HR Partner / Client Advisor) or Zone Totems
    if (!this.isDrivingRover && this.clickableTargets.length > 0) {
      const clickedZone = this.raycaster.intersectObjects(
        this.clickableTargets.map((t) => t.root),
        true
      );
      if (clickedZone.length > 0) {
        const hitObj = clickedZone[0].object;
        const entry = this.clickableTargets.find((t) => {
          let cur: THREE.Object3D | null = hitObj;
          while (cur) {
            if (cur === t.root) return true;
            cur = cur.parent;
          }
          return false;
        });
        if (entry) {
          const station = STATIONS.find((s) => s.id === entry.stationId);
          if (station) {
            const targetPos = new THREE.Vector3();
            entry.root.getWorldPosition(targetPos);
            const dx = targetPos.x - this.playerGroup.position.x;
            const dz = targetPos.z - this.playerGroup.position.z;
            if (Math.sqrt(dx * dx + dz * dz) < 5.5) {
              sfx.playInteract();
              this.callbacks.onInspectStation?.(station);
            } else {
              const dest = targetPos.clone().add(entry.approachOffset);
              this.clampToOfficeRoom(dest, 0.7);
              this.applyOfficeCollisions(dest, 0.7);
              this.clampToOfficeRoom(dest, 0.7);
              this.pendingInspectStationId = station.id;
              this.targetDestination = dest;
              if (this.destinationMarker) {
                this.destinationMarker.position.set(dest.x, 0.05, dest.z);
                this.destinationMarker.visible = true;
              }
            }
            return;
          }
        }
      }
    }

    const target = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, target);

    if (hit) {
      // Check if player clicked directly on or near the Executive Rover
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
          const approachPos = this.rover.pos.clone().add(new THREE.Vector3(-2.2, 0, 0));
          this.clampToOfficeRoom(approachPos, 0.65);
          this.applyOfficeCollisions(approachPos, 0.65);
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
          const propDest = clickedProp.pos.clone();
          this.clampToOfficeRoom(propDest, 0.65);
          this.targetDestination = propDest;
          if (this.destinationMarker) {
            this.destinationMarker.position.set(propDest.x, 0.05, propDest.z);
            this.destinationMarker.visible = true;
          }
          return;
        }
      }

      if (target.x >= -36 && target.x <= 40 && Math.abs(target.z) <= 36) {
        this.clampToOfficeRoom(target, 0.65);
        this.applyOfficeCollisions(target, 0.65);
        this.clampToOfficeRoom(target, 0.65);
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
    if (!this.isReady || this.isTeleporting) return;
    this.joystickVector = { x, y };
    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
      this.targetDestination = null;
      this.pendingInspectStationId = null;
      if (this.destinationMarker) this.destinationMarker.visible = false;
    }
  }

  public setBoost(active: boolean) {
    if (!this.isReady || this.isTeleporting) return;
    this.isBoosting = active;
    if (active) {
      if (!this.isDrivingRover && !this.isJumping) {
        this.isJumping = true;
        this.verticalVelocity = 8.5;
      }
      sfx.playBoost();
    }
  }

  public teleportToStation(stationId: string) {
    if (!this.isReady || this.isTeleporting) return;
    const targetStation = STATIONS.find((s) => s.id === stationId);
    if (!targetStation) return;

    if (this.isDrivingRover) {
      this.exitRover();
    }
    this.pendingInspectStationId = null;

    const landByZone: Record<string, { pos: [number, number, number]; lookAt: [number, number] }> = {
      spawn: { pos: [0, 0, 2.2], lookAt: [0, -2.5] },
      projects: { pos: [0, 0, -16.8], lookAt: [0, -21.0] },
      tech: { pos: [16.5, 0, 0], lookAt: [21.8, 0] },
      experience: { pos: [-10.5, 0, 1.5], lookAt: [-15.0, -2.0] },
      contact: { pos: [0, 0, 17.0], lookAt: [-0.5, 21.0] },
    };
    const [tx, , tz] = targetStation.position;
    const preset = landByZone[stationId];
    const landPos = new THREE.Vector3(...(preset ? preset.pos : [tx, 0, tz + 3.2]));
    this.clampToOfficeRoom(landPos, 0.65);
    this.applyOfficeCollisions(landPos, 0.65);
    this.clampToOfficeRoom(landPos, 0.65);

    const targetX = landPos.x;
    const targetZ = landPos.z;
    const [lookX, lookZ] = preset ? preset.lookAt : [tx, tz];
    const targetRotation = Math.atan2(lookX - targetX, lookZ - targetZ) + Math.PI;

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

      // Character re-materializes with bounce
      const bounce = p3 < 0.55 ? (p3 / 0.55) * 1.12 : 1.12 - ((p3 - 0.55) / 0.45) * 0.12;
      this.characterRoot.scale.set(bounce, bounce, bounce);
      this.characterRoot.position.y = Math.max(0, (1 - p3) * 0.16);

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
      this.teleportGroup.visible = false;
      this.teleportRings.forEach((r) => r.scale.set(1, 1, 1));
      beamMat.opacity = 0;
      coreMat.opacity = 0;
      this.callbacks.onTeleportState?.(false);
    }
  }

  // --- Main Animation Loop ---
  private animate = () => {
    if (this.disposed) return;
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    if (this.isDrivingRover) {
      this.updateRoverMovement(delta);
    } else {
      this.updatePlayerMovement(delta);
    }

    this.updateTeleport(delta);
    this.updateInteractiveProps(delta);
    if (!this.isDrivingRover) {
      this.avatarController.update({
        delta,
        speed: this.playerVelocity.length(),
        turnInput: this.lastTurnInput,
        isBoosting: this.isBoosting,
        isJumping: this.isJumping,
        isTeleporting: this.isTeleporting,
        isDriving: this.isDrivingRover,
        heldPropPos: this.heldProp ? this.heldProp.pos : null,
      });
    }
    this.updateParticles(delta);
    this.updateShockwave(delta);
    this.updateAnimations(time);
    this.checkProximity();
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

    // Keep Rover in open concourse & collision-free around office bays
    this.applyOfficeCollisions(this.rover.pos, 2.0, -15.2);

    // Dynamic chassis suspension pitch & cornering roll
    const speedRatio = Math.min(1, Math.abs(this.rover.speed) / 14);
    const targetPitch = forwardInput * 0.035;
    const targetRoll = -this.rover.steerAngle * speedRatio * 0.09;
    this.rover.body.rotation.x += (targetPitch - this.rover.body.rotation.x) * 0.15;
    this.rover.body.rotation.z += (targetRoll - this.rover.body.rotation.z) * 0.15;

    // Keep explorer playerGroup synced with rover
    this.playerGroup.position.copy(this.rover.pos);
    this.playerRotation = this.rover.rotation;
    this.playerGroup.rotation.y = this.playerRotation;

    // Enclosed architectural room perimeter clamping
    if (this.clampToOfficeRoom(this.rover.pos, 2.0, undefined, -15.2)) {
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
  private updatePlayerMovement(delta: number) {
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

        if (this.pendingInspectStationId) {
          const targetStation = STATIONS.find((s) => s.id === this.pendingInspectStationId);
          this.pendingInspectStationId = null;
          if (targetStation) {
            sfx.playInteract();
            this.callbacks.onInspectStation?.(targetStation);
          }
        } else {
          // Auto-board if player navigated directly to the Rover
          const dxRover = this.playerGroup.position.x - this.rover.pos.x;
          const dzRover = this.playerGroup.position.z - this.rover.pos.z;
          if (Math.sqrt(dxRover * dxRover + dzRover * dzRover) < 4.5 && !this.isDrivingRover) {
            this.enterRover();
          }
        }
      }
    }

    this.lastTurnInput = turnInput;

    // Movement speed settings (3D Character Avatar)
    let maxSpeed = 8.5;
    if (this.isBoosting) maxSpeed = 15.5;

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

    const currentSpeed = this.playerVelocity.length();

    // Subtle agile body banking into high-speed turns
    const targetRoll = currentSpeed > 1.2 ? -turnInput * 0.08 : 0;
    this.characterRoot.rotation.z += (targetRoll - this.characterRoot.rotation.z) * 0.15;

    // Office furniture & enclosed room perimeter clamping
    this.applyOfficeCollisions(this.playerGroup.position, 0.55);

    if (this.clampToOfficeRoom(this.playerGroup.position, 0.55)) {
      this.playerVelocity.set(0, 0, 0);
    }

    // Spawn exhaust & thruster particles
    if (currentSpeed > 2) {
      this.spawnTrailParticle();
    }

    // Dynamic Thruster / Boost Flare
    this.thrusterGlow.intensity = 1.0 + (currentSpeed / maxSpeed) * 1.4 + (this.isBoosting ? 2.8 : 0);

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
        const isChair = prop.type === 'chair' || prop.type === 'exec_chair';
        const carryDistance = isChair ? -(0.65 + prop.radius * 0.28) : -(0.52 + prop.radius * 0.35);
        const carryY = isChair ? 0.68 : 1.08;
        const carryOffset = new THREE.Vector3(0, carryY, carryDistance).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          this.playerRotation
        );
        prop.pos.copy(playerPos).add(carryOffset);
        prop.group.position.copy(prop.pos);
        prop.group.rotation.x *= 0.8;
        prop.group.rotation.z *= 0.8;
        prop.group.rotation.y = this.playerRotation;
        continue;
      }

      // 2. Vertical Gravity and Ground Bounce
      prop.velocity.y -= this.gravity * delta;
      prop.pos.y += prop.velocity.y * delta;

      if (prop.pos.y <= prop.height) {
        prop.pos.y = prop.height;
        if (prop.velocity.y < -1.2) {
          sfx.playBump();
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

      // 4. Angular tumble (keep swivel chairs & book stacks settling upright on floor)
      prop.group.rotation.x += prop.angularVelocity.x * delta;
      prop.group.rotation.y += prop.angularVelocity.y * delta;
      prop.group.rotation.z += prop.angularVelocity.z * delta;
      prop.angularVelocity.multiplyScalar(Math.pow(0.9, delta * 60));
      if (prop.pos.y <= prop.height + 0.05) {
        prop.group.rotation.x *= 0.85;
        prop.group.rotation.z *= 0.85;
      }

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
            sfx.playBump();
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

          sfx.playBump();
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
              sfx.playBump();
            }
          }
        }
      }

      // 8. Office furniture & enclosed room perimeter clamping
      this.applyOfficeCollisions(prop.pos, prop.radius);
      this.clampToOfficeRoom(prop.pos, prop.radius, prop.velocity);

      // Sync Three.js group position
      prop.group.position.copy(prop.pos);
    }
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
    // Subtle overhead warm accent breathing per department
    this.stationMeshes.forEach(({ light }, idx) => {
      light.intensity = 1.25 + Math.sin(time * 2.2 + idx) * 0.14;
    });

    // Office NPCs (HR Partner & Client Advisor) idle breathing + friendly gaze tracking
    const playerPos = this.isDrivingRover ? this.rover.pos : this.playerGroup.position;
    this.officeNpcs.forEach((npc, idx) => {
      npc.bodyPivot.scale.y = 1 + Math.sin(time * 2.1 + idx * 1.4) * 0.008;
      npc.bodyPivot.rotation.z = Math.sin(time * 1.1 + idx) * 0.015;

      const dx = playerPos.x - npc.root.position.x;
      const dz = playerPos.z - npc.root.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const targetRot = dist < 8.0 ? Math.atan2(dx, dz) : npc.baseRotY;

      let diff = targetRot - npc.root.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      npc.root.rotation.y += diff * 0.08;
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
        label: 'EXIT EXECUTIVE ROVER',
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

      // Check proximity to Executive Rover (generous 6.5m radius covering the bay)
      if (roverDist < 6.5) {
        nextPrompt = {
          type: 'enter_rover',
          label: 'DRIVE EXECUTIVE ROVER',
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
    if (!this.isReady || this.isTeleporting || this.isDrivingRover) return;

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
        const dest = nearestAny.pos.clone();
        this.clampToOfficeRoom(dest, 0.65);
        this.pendingInspectStationId = null;
        this.targetDestination = dest;
        if (this.destinationMarker) {
          this.destinationMarker.position.set(dest.x, 0.05, dest.z);
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
    if (!this.isReady || this.isTeleporting) return;

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
        this.clampToOfficeRoom(approachPos, 0.65);
        this.applyOfficeCollisions(approachPos, 0.65);
        this.clampToOfficeRoom(approachPos, 0.65);
        this.pendingInspectStationId = null;
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

    this.avatarController.cancelEmote();

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
    this.applyOfficeCollisions(this.playerGroup.position, 0.55);
    this.clampToOfficeRoom(this.playerGroup.position, 0.55);
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
    this.disposed = true;
    this.isReady = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.unbindEvents();
    this.avatarController.dispose();
    this.pmremTarget?.dispose();
    sfx.stopJetpack();
    sfx.stopRoverEngine();

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry?.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of materials) {
          if (!mat) continue;
          const record = mat as unknown as Record<string, unknown>;
          for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap']) {
            const tex = record[key];
            if (tex instanceof THREE.Texture) {
              tex.dispose();
            }
          }
          mat.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
