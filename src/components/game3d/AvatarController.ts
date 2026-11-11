import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import avatarModelUrl from './model/priyanshu/priyanshu-avatar.glb?url';
import avatarAnimsUrl from './model/priyanshu/priyanshu-anims.glb?url';
import { sfx } from '../../utils/audio';

export type AvatarAnimName = 'entry' | 'idle' | 'run' | 'punch' | 'kick' | 'kick_punch' | 'pushups';
export type AvatarEmoteName = 'punch' | 'kick' | 'kick_punch' | 'pushups';

export interface AvatarControllerCallbacks {
  onLoaded?: () => void;
  onEntryLand?: () => void;
  onStrikeImpact?: (kind: 'punch' | 'kick') => void;
  onEmoteChange?: (emote: AvatarEmoteName | null) => void;
}

const STRIKE_SCHEDULE: Record<'punch' | 'kick' | 'kick_punch', { time: number; kind: 'punch' | 'kick' }[]> = {
  punch: [{ time: 0.48, kind: 'punch' }],
  kick: [{ time: 0.68, kind: 'kick' }],
  kick_punch: [
    { time: 1.2, kind: 'punch' },
    { time: 2.75, kind: 'kick' },
    { time: 4.9, kind: 'kick' },
  ],
};

export class AvatarController {
  private root: THREE.Group;
  private callbacks: AvatarControllerCallbacks;

  private loadingGroup: THREE.Group | null = null;
  private avatarScene: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private actions = new Map<AvatarAnimName, THREE.AnimationAction>();

  private currentAnim: AvatarAnimName = 'idle';
  private activeEmote: AvatarEmoteName | null = null;
  private isLoaded = false;
  private disposed = false;

  // Procedural bones for carry arm posing & head look
  private bones: {
    head?: THREE.Object3D;
    leftArm?: THREE.Object3D;
    leftForeArm?: THREE.Object3D;
    leftHand?: THREE.Object3D;
    rightArm?: THREE.Object3D;
    rightForeArm?: THREE.Object3D;
    rightHand?: THREE.Object3D;
  } = {};

  // Timing & sync state
  private entryElapsed = 0;
  private entryLanded = false;
  private emoteElapsed = 0;
  private firedStrikes = new Set<number>();
  private lastRunPhase = 0;
  private carryBlend = 0;
  private headLookAngle = 0;

  // Reusable math objects (zero GC per frame)
  private readonly tmpVecA = new THREE.Vector3();
  private readonly tmpVecB = new THREE.Vector3();
  private readonly tmpVecC = new THREE.Vector3();
  private readonly tmpDirCur = new THREE.Vector3();
  private readonly tmpDirDes = new THREE.Vector3();
  private readonly tmpQuatA = new THREE.Quaternion();
  private readonly tmpQuatB = new THREE.Quaternion();
  private readonly tmpQuatDelta = new THREE.Quaternion();

  constructor(root: THREE.Group, callbacks: AvatarControllerCallbacks = {}) {
    this.root = root;
    this.callbacks = callbacks;

    this.buildLoadingPlaceholder();
    void this.loadAssets();
  }

  public get loaded(): boolean {
    return this.isLoaded;
  }

  public get emote(): AvatarEmoteName | null {
    return this.activeEmote;
  }

  private buildLoadingPlaceholder() {
    const group = new THREE.Group();

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.6, 12, 3), wireMat);
    pillar.position.y = 0.85;
    group.add(pillar);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.025, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0xfdba74, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    group.add(ring);

    this.root.add(group);
    this.loadingGroup = group;
  }

  private disposeLoadingPlaceholder() {
    if (!this.loadingGroup) return;
    this.root.remove(this.loadingGroup);
    this.loadingGroup.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
    this.loadingGroup = null;
  }

  private async loadAssets() {
    const loader = new GLTFLoader();
    try {
      const [avatarGltf, animsGltf] = await Promise.all([
        loader.loadAsync(avatarModelUrl),
        loader.loadAsync(avatarAnimsUrl),
      ]);

      if (this.disposed) {
        this.disposeObjectTree(avatarGltf.scene);
        return;
      }

      const scene = avatarGltf.scene;
      // Avaturn / Mixamo rigs face +Z locally; rotate 180deg to match engine forward (-Z)
      scene.rotation.y = Math.PI;

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // Skinned bounding spheres stay near bind origin; disable culling so animations never flicker out
          if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) {
            mesh.frustumCulled = false;
          }
          const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
          const mats = Array.isArray(mat) ? mat : [mat];
          mats.forEach((m) => {
            if (m && 'envMapIntensity' in m) {
              m.envMapIntensity = 0.75;
            }
          });
        }
      });

      this.bones = {
        head: scene.getObjectByName('Head'),
        leftArm: scene.getObjectByName('LeftArm'),
        leftForeArm: scene.getObjectByName('LeftForeArm'),
        leftHand: scene.getObjectByName('LeftHand'),
        rightArm: scene.getObjectByName('RightArm'),
        rightForeArm: scene.getObjectByName('RightForeArm'),
        rightHand: scene.getObjectByName('RightHand'),
      };

      const mixer = new THREE.AnimationMixer(scene);
      for (const clip of animsGltf.animations) {
        const name = clip.name as AvatarAnimName;
        const action = mixer.clipAction(clip);
        if (name === 'entry' || name === 'punch' || name === 'kick' || name === 'kick_punch') {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
        } else {
          action.setLoop(THREE.LoopRepeat, Infinity);
        }
        this.actions.set(name, action);
      }

      this.avatarScene = scene;
      this.mixer = mixer;
      this.disposeLoadingPlaceholder();
      this.root.add(scene);
      this.isLoaded = true;

      // Start with superhero entry drop-in!
      if (this.actions.has('entry')) {
        this.playClipImmediate('entry');
        this.entryElapsed = 0;
        this.entryLanded = false;
      } else if (this.actions.has('idle')) {
        this.playClipImmediate('idle');
      }

      this.callbacks.onLoaded?.();
    } catch (err) {
      console.error('[AvatarController] Failed to load 3D character assets:', err);
    }
  }

  private playClipImmediate(name: AvatarAnimName) {
    const action = this.actions.get(name);
    if (!action) return;
    action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    this.currentAnim = name;
  }

  private fadeTo(name: AvatarAnimName, duration = 0.22, timeScale = 1) {
    if (this.currentAnim === name) return;
    const next = this.actions.get(name);
    if (!next) return;

    const prev = this.actions.get(this.currentAnim);
    next.reset().setEffectiveTimeScale(timeScale).setEffectiveWeight(1).play();
    if (prev) {
      next.crossFadeFrom(prev, duration, true);
    }
    this.currentAnim = name;
  }

  public triggerEmote(name: AvatarEmoteName) {
    if (!this.isLoaded || !this.actions.has(name)) return;

    // Toggle off pushups if already doing pushups
    if (name === 'pushups' && this.activeEmote === 'pushups') {
      this.cancelEmote();
      return;
    }

    this.activeEmote = name;
    this.emoteElapsed = 0;
    this.firedStrikes.clear();
    this.callbacks.onEmoteChange?.(name);

    const prev = this.actions.get(this.currentAnim);
    const next = this.actions.get(name)!;
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    if (prev && prev !== next) {
      next.crossFadeFrom(prev, 0.16, true);
    }
    this.currentAnim = name;

    if (name === 'punch' || name === 'kick') {
      sfx.playInteract();
    }
  }

  public cancelEmote() {
    if (!this.activeEmote) return;
    this.activeEmote = null;
    this.emoteElapsed = 0;
    this.firedStrikes.clear();
    this.callbacks.onEmoteChange?.(null);
  }

  public playLandingEntry() {
    if (!this.isLoaded || !this.actions.has('entry')) return;
    this.cancelEmote();
    this.entryElapsed = 0;
    this.entryLanded = false;
    this.fadeTo('entry', 0.12, 1);
  }

  public update(params: {
    delta: number;
    speed: number;
    turnInput: number;
    isBoosting: boolean;
    isJumping: boolean;
    isTeleporting: boolean;
    isDriving: boolean;
    heldPropPos: THREE.Vector3 | null;
  }) {
    const { delta, speed, turnInput, isBoosting, isJumping, isTeleporting, isDriving, heldPropPos } = params;

    // Spin placeholder holo while downloading
    if (!this.isLoaded && this.loadingGroup) {
      this.loadingGroup.rotation.y += delta * 2.5;
      const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.08;
      this.loadingGroup.scale.set(pulse, 1, pulse);
      return;
    }

    if (!this.mixer || !this.avatarScene) return;
    if (isDriving) return;

    const isMoving = speed > 0.35;

    // Cancel looping/recovery emotes immediately if player starts running or jumping
    if (this.activeEmote) {
      const canInterrupt =
        this.activeEmote === 'pushups' ||
        (this.activeEmote === 'kick_punch' && (isMoving || isJumping)) ||
        (this.emoteElapsed > 0.85 && (isMoving || isJumping));

      if (canInterrupt && (isMoving || isJumping)) {
        this.cancelEmote();
      }
    }

    // State machine selection
    if (this.currentAnim === 'entry') {
      this.entryElapsed += delta;
      if (!this.entryLanded && this.entryElapsed >= 0.45) {
        this.entryLanded = true;
        sfx.playActionStrike('land');
        this.callbacks.onEntryLand?.();
      }

      if (isMoving && this.entryElapsed > 0.52) {
        this.fadeTo('run', 0.2);
      } else if (this.entryElapsed >= 1.25) {
        this.fadeTo('idle', 0.42);
      }
    } else if (this.activeEmote) {
      this.emoteElapsed += delta;
      const emote = this.activeEmote;

      if (emote !== 'pushups') {
        const schedule = STRIKE_SCHEDULE[emote];
        schedule.forEach((step, idx) => {
          if (!this.firedStrikes.has(idx) && this.emoteElapsed >= step.time) {
            this.firedStrikes.add(idx);
            sfx.playActionStrike(step.kind);
            this.callbacks.onStrikeImpact?.(step.kind);
          }
        });

        const clipDur = this.actions.get(emote)?.getClip().duration ?? 1.5;
        if (this.emoteElapsed >= clipDur - 0.24) {
          this.cancelEmote();
          this.fadeTo(isMoving ? 'run' : 'idle', 0.24);
        }
      }
    } else if (isMoving) {
      if (this.currentAnim !== 'run') {
        this.lastRunPhase = 0;
        this.fadeTo('run', 0.16);
      }
      const runAct = this.actions.get('run');
      if (runAct) {
        const targetRate = isJumping ? 0.28 : Math.min(1.42, Math.max(0.55, speed / 9.0));
        runAct.setEffectiveTimeScale(targetRate);

        // Exact sneaker plant footstep triggers synced to Mixamo run clip frames
        const clipDur = runAct.getClip().duration || 0.667;
        const phase = (runAct.time % clipDur) / clipDur;

        if (!isJumping && !isTeleporting) {
          if (this.crossedPhase(this.lastRunPhase, phase, 0.36)) {
            sfx.playFootstep(isBoosting, true);
          }
          if (this.crossedPhase(this.lastRunPhase, phase, 0.84)) {
            sfx.playFootstep(isBoosting, false);
          }
        }
        this.lastRunPhase = phase;
      }
    } else {
      if (this.currentAnim !== 'idle') {
        this.fadeTo('idle', 0.26);
      }
    }

    // Advance baked animation mixer
    this.mixer.update(delta);

    // Subtle procedural bone layering on top of baked skeleton
    this.applyProceduralBoneLayers(delta, turnInput, heldPropPos);
  }

  private crossedPhase(prev: number, next: number, target: number): boolean {
    if (next >= prev) {
      return prev < target && next >= target;
    }
    // Wrapped around 1.0 -> 0.0
    return prev < target || next >= target;
  }

  private applyProceduralBoneLayers(delta: number, turnInput: number, heldPropPos: THREE.Vector3 | null) {
    if (!this.avatarScene) return;

    // 1. Subtle Head look yaw into turns (when not in pushups or floor entry)
    if (this.bones.head && !this.activeEmote && this.currentAnim !== 'entry') {
      const targetYaw = -turnInput * 0.22;
      this.headLookAngle += (targetYaw - this.headLookAngle) * Math.min(1, delta * 8);
      if (Math.abs(this.headLookAngle) > 0.005) {
        this.bones.head.rotation.y += this.headLookAngle;
      }
    }

    // 2. Dynamic dual-arm carry reaching towards held object
    const wantCarry = heldPropPos !== null && !this.activeEmote && this.currentAnim !== 'entry';
    const targetBlend = wantCarry ? 1 : 0;
    this.carryBlend += (targetBlend - this.carryBlend) * Math.min(1, delta * 12);

    if (this.carryBlend > 0.01 && heldPropPos) {
      this.avatarScene.updateMatrixWorld(true);
      const { leftArm, leftForeArm, leftHand, rightArm, rightForeArm, rightHand } = this.bones;

      this.aimCarryArm(leftArm, leftForeArm, leftHand, heldPropPos, this.carryBlend);
      this.aimCarryArm(rightArm, rightForeArm, rightHand, heldPropPos, this.carryBlend);
    }
  }

  private aimCarryArm(
    arm: THREE.Object3D | undefined,
    foreArm: THREE.Object3D | undefined,
    hand: THREE.Object3D | undefined,
    heldPropPos: THREE.Vector3,
    weight: number
  ) {
    if (!arm || !foreArm || !this.avatarScene) return;

    arm.getWorldPosition(this.tmpVecA);
    // Offset elbow slightly wide and downward for a natural cradling arc
    this.tmpVecC.copy(this.tmpVecA).lerp(heldPropPos, 0.52);
    this.tmpVecC.y -= 0.12;
    this.aimBoneTowards(arm, foreArm, this.tmpVecC, weight);
    this.avatarScene.updateMatrixWorld(true);

    if (hand) {
      // Aim forearm near the side edge of the carried prop nearest this shoulder
      this.tmpVecC.copy(heldPropPos).lerp(this.tmpVecA, 0.22);
      this.tmpVecC.y -= 0.04;
      this.aimBoneTowards(foreArm, hand, this.tmpVecC, weight);
    }
  }

  private aimBoneTowards(bone: THREE.Object3D, childBone: THREE.Object3D, worldTarget: THREE.Vector3, weight: number) {
    if (!bone.parent) return;
    bone.getWorldPosition(this.tmpVecA);
    childBone.getWorldPosition(this.tmpVecB);

    this.tmpDirCur.subVectors(this.tmpVecB, this.tmpVecA);
    this.tmpDirDes.subVectors(worldTarget, this.tmpVecA);
    if (this.tmpDirCur.lengthSq() < 1e-6 || this.tmpDirDes.lengthSq() < 1e-6) return;

    this.tmpDirCur.normalize();
    this.tmpDirDes.normalize();

    this.tmpQuatDelta.setFromUnitVectors(this.tmpDirCur, this.tmpDirDes);
    bone.getWorldQuaternion(this.tmpQuatA);
    this.tmpQuatA.premultiply(this.tmpQuatDelta);

    bone.parent.getWorldQuaternion(this.tmpQuatB);
    this.tmpQuatB.invert().multiply(this.tmpQuatA);

    bone.quaternion.slerp(this.tmpQuatB, weight);
  }

  private disposeObjectTree(tree: THREE.Object3D) {
    tree.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (!m) return;
          const std = m as THREE.MeshStandardMaterial;
          std.map?.dispose();
          std.normalMap?.dispose();
          std.roughnessMap?.dispose();
          std.metalnessMap?.dispose();
          std.aoMap?.dispose();
          m.dispose();
        });
      }
    });
  }

  public dispose() {
    this.disposed = true;
    this.mixer?.stopAllAction();
    this.disposeLoadingPlaceholder();
    if (this.avatarScene) {
      this.root.remove(this.avatarScene);
      this.disposeObjectTree(this.avatarScene);
      this.avatarScene = null;
    }
  }
}
