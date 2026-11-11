// Synthesized Web Audio sound effects & dynamic engine audio (zero external asset loading)
class SoundEffects {
  private ctx: AudioContext | null = null;
  private muted = false;

  // Jetpack Thruster Plasma Synthesizer Nodes
  private thrusterNode: AudioBufferSourceNode | null = null;
  private thrusterGain: GainNode | null = null;
  private thrusterFilter: BiquadFilterNode | null = null;
  private isThrusterActive = false;

  // Drivable Rover Electric Motor Synthesizer Nodes
  private roverOsc: OscillatorNode | null = null;
  private roverSubOsc: OscillatorNode | null = null;
  private roverGain: GainNode | null = null;
  private roverFilter: BiquadFilterNode | null = null;
  private isRoverRunning = false;

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopJetpack();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // --- Jetpack Micro-Thruster Plasma Audio (ONLY fires during jump/sprint) ---
  public updateJetpack(active: boolean, speed = 0) {
    if (this.muted) {
      this.stopJetpack();
      return;
    }
    const ctx = this.getContext();
    if (!ctx) return;

    if (active) {
      if (!this.isThrusterActive) {
        try {
          const now = ctx.currentTime;
          // Generate 1.0 second seamless looped pink/white noise for plasma thruster hiss
          const bufferSize = Math.floor(ctx.sampleRate * 1.0);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.12;
          }

          this.thrusterNode = ctx.createBufferSource();
          this.thrusterNode.buffer = noiseBuffer;
          this.thrusterNode.loop = true;

          // Resonant bandpass filter for pressurized rocket hiss
          this.thrusterFilter = ctx.createBiquadFilter();
          this.thrusterFilter.type = 'bandpass';
          this.thrusterFilter.frequency.setValueAtTime(1200, now);
          this.thrusterFilter.Q.value = 2.0;

          this.thrusterGain = ctx.createGain();
          this.thrusterGain.gain.setValueAtTime(0.001, now);
          this.thrusterGain.gain.linearRampToValueAtTime(0.045, now + 0.1);

          this.thrusterNode.connect(this.thrusterFilter);
          this.thrusterFilter.connect(this.thrusterGain);
          this.thrusterGain.connect(ctx.destination);

          this.thrusterNode.start(now);
          this.isThrusterActive = true;
        } catch {
          // Audio handled
        }
      } else if (this.thrusterGain && this.thrusterFilter) {
        const now = ctx.currentTime;
        const targetFreq = 1100 + Math.min(speed * 30, 800);
        this.thrusterFilter.frequency.setTargetAtTime(targetFreq, now, 0.08);
      }
    } else {
      if (this.isThrusterActive) {
        this.stopJetpack();
      }
    }
  }

  public stopJetpack() {
    if (!this.isThrusterActive) return;
    try {
      if (this.ctx && this.thrusterGain) {
        const now = this.ctx.currentTime;
        this.thrusterGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
        setTimeout(() => {
          this.thrusterNode?.stop();
          this.thrusterNode?.disconnect();
          this.thrusterFilter?.disconnect();
          this.thrusterGain?.disconnect();
          this.thrusterNode = null;
          this.thrusterFilter = null;
          this.thrusterGain = null;
          this.isThrusterActive = false;
        }, 160);
      } else {
        this.thrusterNode?.stop();
        this.thrusterNode = null;
        this.isThrusterActive = false;
      }
    } catch {
      this.isThrusterActive = false;
    }
  }

  // Backward compatibility aliases (no-ops for car engine)
  public startEngine() {
    // Car engine obsolete: now using humanoid footsteps & jetpack thruster
  }

  public updateEngine(speed: number, isBoosting: boolean) {
    this.updateJetpack(isBoosting, speed);
  }

  public stopEngine() {
    this.stopJetpack();
    this.stopRoverEngine();
  }

  // --- Dedicated Drivable Rover Electric Motor Audio ---
  public startRoverEngine() {
    if (this.muted || this.isRoverRunning) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.roverOsc = ctx.createOscillator();
      this.roverOsc.type = 'sawtooth';
      this.roverOsc.frequency.setValueAtTime(55, now);

      this.roverSubOsc = ctx.createOscillator();
      this.roverSubOsc.type = 'triangle';
      this.roverSubOsc.frequency.setValueAtTime(28, now);

      this.roverFilter = ctx.createBiquadFilter();
      this.roverFilter.type = 'lowpass';
      this.roverFilter.frequency.setValueAtTime(260, now);

      this.roverGain = ctx.createGain();
      this.roverGain.gain.setValueAtTime(0.02, now);

      this.roverOsc.connect(this.roverFilter);
      this.roverSubOsc.connect(this.roverFilter);
      this.roverFilter.connect(this.roverGain);
      this.roverGain.connect(ctx.destination);

      this.roverOsc.start(now);
      this.roverSubOsc.start(now);
      this.isRoverRunning = true;
    } catch {
      // Handled
    }
  }

  public updateRoverEngine(speed: number, isBoosting: boolean) {
    if (!this.isRoverRunning || this.muted || !this.roverOsc || !this.roverFilter || !this.roverGain || !this.ctx) {
      return;
    }
    try {
      const now = this.ctx.currentTime;
      const speedRatio = Math.min(speed / 35, 1);
      const targetFreq = 55 + speedRatio * 160 + (isBoosting ? 65 : 0);
      this.roverOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);
      if (this.roverSubOsc) {
        this.roverSubOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.05);
      }
      const filterCutoff = 260 + speedRatio * 520 + (isBoosting ? 300 : 0);
      this.roverFilter.frequency.setTargetAtTime(filterCutoff, now, 0.05);

      const volume = speed > 0.5 ? 0.035 + speedRatio * 0.035 : 0.018;
      this.roverGain.gain.setTargetAtTime(volume, now, 0.05);
    } catch {
      // Handled
    }
  }

  public stopRoverEngine() {
    if (!this.isRoverRunning) return;
    try {
      this.roverOsc?.stop();
      this.roverSubOsc?.stop();
      this.roverOsc?.disconnect();
      this.roverSubOsc?.disconnect();
      this.roverFilter?.disconnect();
      this.roverGain?.disconnect();
    } catch {
      // Ignore
    }
    this.roverOsc = null;
    this.roverSubOsc = null;
    this.roverFilter = null;
    this.roverGain = null;
    this.isRoverRunning = false;
  }

  // --- Vehicle Enter / Exit Hydraulic Audio ---
  public playVehicleEnter() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Hydraulic canopy depressurization hiss
      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1800);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // Startup electrical ascending hum
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.35);
      oscGain.gain.setValueAtTime(0.08, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + 0.1);
      osc.stop(now + 0.38);
    } catch {
      // Handled
    }
  }

  public playVehicleExit() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Handled
    }
  }

  // --- Prop Pick Up & Throw Audio ---
  public playPickup() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High-tech magnetic latch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Handled
    }
  }

  public playThrow() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Aerodynamic whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Handled
    }
  }

  // --- Melee / Athletic Action Swoosh & Impact ---
  public playActionStrike(kind: 'punch' | 'kick' | 'land' = 'punch') {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Air whoosh via filtered noise
      const dur = kind === 'land' ? 0.16 : 0.14;
      const bufSize = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.45));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(kind === 'kick' ? 620 : kind === 'land' ? 220 : 880, now);
      filter.frequency.exponentialRampToValueAtTime(kind === 'land' ? 80 : 280, now + dur);
      filter.Q.value = 1.6;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(kind === 'land' ? 0.1 : 0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Sub punchy impact body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(kind === 'kick' ? 135 : kind === 'land' ? 110 : 175, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      oscGain.gain.setValueAtTime(kind === 'land' ? 0.14 : 0.09, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Handled
    }
  }

  public playOrbBounce() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Crystalline plasma chime
      [659.25, 880.0, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.025;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {
      // Handled
    }
  }

  // --- Crisp, Multi-Layered Cybernetic Humanoid Footstep Audio ---
  public playFootstep(isSprinting = false, isLeftFoot = true) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Realistic pitch variation between left and right foot strikes
      const baseFreq = isLeftFoot ? 145 : 175;
      const sprintFactor = isSprinting ? 1.25 : 1.0;

      // Layer 1: Solid carbon-fiber sole impact with cyber grid
      const heelOsc = ctx.createOscillator();
      const heelGain = ctx.createGain();
      const heelFilter = ctx.createBiquadFilter();

      heelOsc.type = 'triangle';
      heelOsc.frequency.setValueAtTime(baseFreq * 2.2 * sprintFactor, now);
      heelOsc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

      heelFilter.type = 'lowpass';
      heelFilter.frequency.setValueAtTime(isLeftFoot ? 750 : 950, now);

      const heelVol = isSprinting ? 0.07 : 0.045;
      heelGain.gain.setValueAtTime(heelVol, now);
      heelGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      heelOsc.connect(heelFilter);
      heelFilter.connect(heelGain);
      heelGain.connect(ctx.destination);
      heelOsc.start(now);
      heelOsc.stop(now + 0.055);

      // Layer 2: High-frequency tech boot mechanical tap
      const tapBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.015), ctx.sampleRate);
      const tapData = tapBuffer.getChannelData(0);
      for (let i = 0; i < tapData.length; i++) {
        tapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 60);
      }
      const tapSource = ctx.createBufferSource();
      tapSource.buffer = tapBuffer;

      const tapFilter = ctx.createBiquadFilter();
      tapFilter.type = 'bandpass';
      tapFilter.frequency.setValueAtTime(isLeftFoot ? 1600 : 2100, now);
      tapFilter.Q.value = 2.5;

      const tapGain = ctx.createGain();
      tapGain.gain.setValueAtTime(isSprinting ? 0.035 : 0.02, now);

      tapSource.connect(tapFilter);
      tapFilter.connect(tapGain);
      tapGain.connect(ctx.destination);
      tapSource.start(now);
    } catch {
      // Audio handled
    }
  }

  // --- Realistic Human Jump Takeoff & Two-Foot Sneaker Landing Audio ---
  public playJumpTakeoff() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Rubber sole push-off against tile floor
      const pushOsc = ctx.createOscillator();
      const pushGain = ctx.createGain();
      pushOsc.type = 'triangle';
      pushOsc.frequency.setValueAtTime(165, now);
      pushOsc.frequency.exponentialRampToValueAtTime(75, now + 0.055);
      pushGain.gain.setValueAtTime(0.04, now);
      pushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      pushOsc.connect(pushGain);
      pushGain.connect(ctx.destination);
      pushOsc.start(now);
      pushOsc.stop(now + 0.065);

      // Subtle sneaker / clothing air brush
      const brushBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.065), ctx.sampleRate);
      const brushData = brushBuf.getChannelData(0);
      for (let i = 0; i < brushData.length; i++) {
        brushData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (brushData.length * 0.45));
      }
      const brushSrc = ctx.createBufferSource();
      brushSrc.buffer = brushBuf;
      const brushFilter = ctx.createBiquadFilter();
      brushFilter.type = 'bandpass';
      brushFilter.frequency.setValueAtTime(900, now);
      brushFilter.Q.value = 1.2;
      const brushGain = ctx.createGain();
      brushGain.gain.setValueAtTime(0.025, now);
      brushSrc.connect(brushFilter);
      brushFilter.connect(brushGain);
      brushGain.connect(ctx.destination);
      brushSrc.start(now);
    } catch {
      // Audio handled
    }
  }

  public playJumpLand() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary heel + sole weight absorption thud on tile floor
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(125, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(42, now + 0.09);
      bodyGain.gain.setValueAtTime(0.065, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.105);

      // Slight staggered second-foot tap 28ms later
      const secondOsc = ctx.createOscillator();
      const secondGain = ctx.createGain();
      secondOsc.type = 'sine';
      secondOsc.frequency.setValueAtTime(145, now + 0.028);
      secondOsc.frequency.exponentialRampToValueAtTime(52, now + 0.085);
      secondGain.gain.setValueAtTime(0.04, now + 0.028);
      secondGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      secondOsc.connect(secondGain);
      secondGain.connect(ctx.destination);
      secondOsc.start(now + 0.028);
      secondOsc.stop(now + 0.095);
    } catch {
      // Audio handled
    }
  }

  // --- Jump Pad Launch Whoosh ---
  public playLaunchPad() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Handled
    }
  }

  // --- Sonic Shockwave / Horn ---
  public playShockwave() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Handled
    }
  }

  // --- Bump / Kinetic Collision Sound ---
  public playBump() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Handled
    }
  }

  // Soft sci-fi blip for opening stations / modals
  public playInteract() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Handled
    }
  }

  // Nitro boost sound effect
  public playBoost() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Handled
    }
  }

  // Harmonic chord for collecting a data core
  public playCollect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.04;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch {
      // Handled
    }
  }

  // Mode switcher click sound
  public playSwitch() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Handled
    }
  }

  // Warp / Overdrive sound
  public playOverdrive() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Handled
    }
  }

  // --- Quantum Teleportation Sound System ---
  public playTeleportCharge() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High-tech rising ionization sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
      filter.Q.value = 4.0;

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Handled
    }
  }

  public playTeleportWarp() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Quantum spatial displacement whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Handled
    }
  }

  public playTeleportLand() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sub-bass landing impact
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.3);

      subGain.gain.setValueAtTime(0.14, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.35);

      // Re-materialization harmonic chime
      [587.33, 739.99, 880.0, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + 0.05 + idx * 0.035;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {
      // Handled
    }
  }
}

export const sfx = new SoundEffects();
