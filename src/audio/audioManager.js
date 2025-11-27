import * as Tone from 'tone';
import { ZONE_MUSIC_CONFIG } from '../constants/gameConstants';

class AudioManager {
  constructor() {
    this.initialized = false;
    this.synths = {};
    this.effects = {};
    this.currentZone = -1;
    this.musicPlaying = false;
    this.volume = 0.3;
    this.sfxPool = [];
    this.sfxPoolSize = 8;
    this.sfxIndex = 0;
    this.noisePool = [];
    this.noisePoolSize = 4;
    this.noiseIndex = 0;
    
    // Define scales
    this.scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      diminished: [0, 2, 3, 5, 6, 8, 9, 11]
    };
    
    // Note frequencies
    this.noteFreqs = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
      'G': 392.00, 'A': 440.00, 'B': 493.88
    };
  }
  
  async initialize() {
    if (this.initialized) return;
    
    try {
      await Tone.start();
      
      // Create master effects
      this.effects.reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
      this.effects.compressor = new Tone.Compressor(-20, 3).connect(this.effects.reverb);
      
      // Create synths for different layers
      this.synths.bass = new Tone.MonoSynth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
      }).connect(this.effects.compressor);
      this.synths.bass.volume.value = -8;
      
      this.synths.arp = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.4 }
      }).connect(this.effects.compressor);
      this.synths.arp.volume.value = -12;
      
      this.synths.lead = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.5 }
      }).connect(this.effects.compressor);
      this.synths.lead.volume.value = -15;
      
      this.synths.pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.5, decay: 1, sustain: 0.8, release: 2 }
      }).connect(this.effects.compressor);
      this.synths.pad.volume.value = -18;
      
      // Create pool of SFX synths to avoid timing conflicts
      for (let i = 0; i < this.sfxPoolSize; i++) {
        const sfx = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        sfx.volume.value = -6;
        this.sfxPool.push(sfx);
      }
      
      // Create pool of noise synths
      for (let i = 0; i < this.noisePoolSize; i++) {
        const noise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
        }).toDestination();
        noise.volume.value = -12;
        this.noisePool.push(noise);
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }
  
  // Get next available synth from pool
  getNextSfx() {
    const synth = this.sfxPool[this.sfxIndex];
    this.sfxIndex = (this.sfxIndex + 1) % this.sfxPoolSize;
    return synth;
  }
  
  getNextNoise() {
    const synth = this.noisePool[this.noiseIndex];
    this.noiseIndex = (this.noiseIndex + 1) % this.noisePoolSize;
    return synth;
  }
  
  // Safe sound trigger
  playSfx(frequency, duration = '32n') {
    if (!this.initialized) return;
    try {
      const synth = this.getNextSfx();
      synth.triggerAttackRelease(frequency, duration, Tone.now());
    } catch (e) {
      // Silently ignore audio errors to prevent crashes
    }
  }
  
  playNoiseSfx(duration = '32n') {
    if (!this.initialized) return;
    try {
      const synth = this.getNextNoise();
      synth.triggerAttackRelease(duration, Tone.now());
    } catch (e) {
      // Silently ignore audio errors
    }
  }
  
  getScaleNotes(key, scale, octave = 4) {
    const baseFreq = this.noteFreqs[key] * Math.pow(2, octave - 4);
    return this.scales[scale].map(semitone => 
      baseFreq * Math.pow(2, semitone / 12)
    );
  }
  
  setZone(zoneIndex) {
    if (zoneIndex === this.currentZone) return;
    this.currentZone = zoneIndex;
    
    if (this.musicPlaying) {
      this.stopMusic();
      this.startMusic(zoneIndex);
    }
  }
  
  startMusic(zoneIndex = 0) {
    if (!this.initialized || this.musicPlaying) return;
    
    try {
      const config = ZONE_MUSIC_CONFIG[zoneIndex] || ZONE_MUSIC_CONFIG[0];
      this.currentZone = zoneIndex;
      this.musicPlaying = true;
      
      const notes = this.getScaleNotes(config.key, config.scale);
      const bpm = config.bpm;
      
      Tone.Transport.bpm.value = bpm;
      
      // Bass pattern
      this.patterns = this.patterns || {};
      this.patterns.bass = new Tone.Pattern((time, note) => {
        try { this.synths.bass.triggerAttackRelease(note, '4n', time); } catch(e) {}
      }, [notes[0], notes[0], notes[4], notes[3]], 'upDown');
      this.patterns.bass.interval = '2n';
      this.patterns.bass.start(0);
      
      // Arpeggio pattern
      this.patterns.arp = new Tone.Pattern((time, note) => {
        try { this.synths.arp.triggerAttackRelease(note * 2, '16n', time); } catch(e) {}
      }, [notes[0], notes[2], notes[4], notes[6] || notes[5]], 'up');
      this.patterns.arp.interval = '16n';
      this.patterns.arp.start(0);
      
      // Occasional lead melody
      this.patterns.lead = new Tone.Loop((time) => {
        try {
          if (Math.random() > 0.7) {
            const note = notes[Math.floor(Math.random() * notes.length)] * 2;
            this.synths.lead.triggerAttackRelease(note, '8n', time);
          }
        } catch(e) {}
      }, '4n');
      this.patterns.lead.start(0);
      
      // Pad chords
      this.patterns.pad = new Tone.Loop((time) => {
        try {
          const chord = [notes[0], notes[2], notes[4]];
          this.synths.pad.triggerAttackRelease(chord, '2n', time);
        } catch(e) {}
      }, '1m');
      this.patterns.pad.start(0);
      
      Tone.Transport.start();
    } catch (error) {
      console.error('Music start failed:', error);
    }
  }
  
  stopMusic() {
    if (!this.initialized || !this.musicPlaying) return;
    
    try {
      Tone.Transport.stop();
      
      if (this.patterns) {
        Object.values(this.patterns).forEach(pattern => {
          try {
            if (pattern.stop) pattern.stop();
            if (pattern.dispose) pattern.dispose();
          } catch(e) {}
        });
        this.patterns = {};
      }
    } catch(e) {}
    
    this.musicPlaying = false;
  }
  
  // Sound effects - using pool system
  playJump() {
    this.playSfx(400, '32n');
  }
  
  playThrow() {
    this.playSfx(300, '16n');
    this.playNoiseSfx('32n');
  }
  
  playCatch() {
    this.playSfx(800, '32n');
  }
  
  playHit() {
    this.playNoiseSfx('16n');
    this.playSfx(200, '32n');
  }
  
  playEnemyDeath() {
    this.playNoiseSfx('8n');
    this.playSfx(100, '16n');
  }
  
  playPlayerHit() {
    this.playSfx(150, '8n');
    this.playNoiseSfx('8n');
  }
  
  playDash() {
    this.playNoiseSfx('16n');
    this.playSfx(250, '32n');
  }
  
  playPowerup() {
    this.playSfx(600, '16n');
  }
  
  playBossHit() {
    this.playNoiseSfx('8n');
    this.playSfx(120, '16n');
  }
  
  playBossDeath() {
    this.playNoiseSfx('4n');
    this.playSfx(80, '4n');
  }
  
  playVictory() {
    this.playSfx(523, '4n');
  }
  
  setVolume(value) {
    this.volume = value;
    if (this.initialized) {
      try {
        Tone.Destination.volume.value = Tone.gainToDb(value);
      } catch(e) {}
    }
  }
}

export const audioManager = new AudioManager();
