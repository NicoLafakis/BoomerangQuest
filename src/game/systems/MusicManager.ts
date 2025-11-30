/**
 * Procedural Music Generator
 * Creates 8-bit style background music using Web Audio API
 */

type MusicTrack = 'menu' | 'gameplay' | 'boss' | 'victory' | 'gameover'

interface NoteSequence {
  notes: number[] // MIDI note numbers (60 = middle C)
  durations: number[] // Note durations in beats
  loop: boolean
}

interface TrackConfig {
  bpm: number
  bassLine: NoteSequence
  melody: NoteSequence
  drums: boolean
  bassVolume: number
  melodyVolume: number
  drumVolume: number
}

// MIDI note to frequency conversion
function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Note definitions (MIDI numbers)
const NOTE = {
  C3: 48, D3: 50, E3: 52, F3: 53, G3: 55, A3: 57, B3: 59,
  C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71,
  C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, B5: 83,
  REST: 0, // Rest/silence
}

const TRACK_CONFIGS: Record<MusicTrack, TrackConfig> = {
  menu: {
    bpm: 90,
    bassLine: {
      notes: [NOTE.C3, NOTE.REST, NOTE.G3, NOTE.REST, NOTE.A3, NOTE.REST, NOTE.G3, NOTE.REST],
      durations: [1, 1, 1, 1, 1, 1, 1, 1],
      loop: true,
    },
    melody: {
      notes: [
        NOTE.E4, NOTE.G4, NOTE.C5, NOTE.REST,
        NOTE.D4, NOTE.F4, NOTE.A4, NOTE.REST,
        NOTE.C4, NOTE.E4, NOTE.G4, NOTE.REST,
        NOTE.D4, NOTE.G4, NOTE.B4, NOTE.REST,
      ],
      durations: [0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1],
      loop: true,
    },
    drums: false,
    bassVolume: 0.15,
    melodyVolume: 0.12,
    drumVolume: 0,
  },

  gameplay: {
    bpm: 140,
    bassLine: {
      notes: [
        NOTE.C3, NOTE.C3, NOTE.G3, NOTE.G3,
        NOTE.A3, NOTE.A3, NOTE.E3, NOTE.E3,
        NOTE.F3, NOTE.F3, NOTE.C3, NOTE.C3,
        NOTE.G3, NOTE.G3, NOTE.G3, NOTE.A3,
      ],
      durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      loop: true,
    },
    melody: {
      notes: [
        NOTE.C5, NOTE.REST, NOTE.E5, NOTE.G5, NOTE.REST, NOTE.E5,
        NOTE.A4, NOTE.REST, NOTE.C5, NOTE.E5, NOTE.REST, NOTE.C5,
        NOTE.F4, NOTE.REST, NOTE.A4, NOTE.C5, NOTE.REST, NOTE.A4,
        NOTE.G4, NOTE.REST, NOTE.B4, NOTE.D5, NOTE.G5, NOTE.REST,
      ],
      durations: [0.25, 0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.25, 0.5, 0.25, 0.5, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5],
      loop: true,
    },
    drums: true,
    bassVolume: 0.18,
    melodyVolume: 0.1,
    drumVolume: 0.15,
  },

  boss: {
    bpm: 160,
    bassLine: {
      notes: [
        NOTE.E3, NOTE.E3, NOTE.E3, NOTE.REST,
        NOTE.E3, NOTE.E3, NOTE.G3, NOTE.A3,
        NOTE.A3, NOTE.A3, NOTE.A3, NOTE.REST,
        NOTE.A3, NOTE.G3, NOTE.F3, NOTE.E3,
      ],
      durations: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
      loop: true,
    },
    melody: {
      notes: [
        NOTE.E5, NOTE.REST, NOTE.E5, NOTE.REST, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.REST,
        NOTE.A4, NOTE.REST, NOTE.A4, NOTE.REST, NOTE.A4, NOTE.B4, NOTE.C5, NOTE.REST,
        NOTE.E5, NOTE.REST, NOTE.D5, NOTE.REST, NOTE.C5, NOTE.REST, NOTE.B4, NOTE.REST,
        NOTE.A4, NOTE.G4, NOTE.F4, NOTE.E4, NOTE.G4, NOTE.REST, NOTE.REST, NOTE.REST,
      ],
      durations: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5],
      loop: true,
    },
    drums: true,
    bassVolume: 0.2,
    melodyVolume: 0.12,
    drumVolume: 0.18,
  },

  victory: {
    bpm: 120,
    bassLine: {
      notes: [NOTE.C3, NOTE.E3, NOTE.G3, NOTE.C4, NOTE.G3, NOTE.E3, NOTE.C3, NOTE.REST],
      durations: [0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5],
      loop: true,
    },
    melody: {
      notes: [
        NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C5,
        NOTE.E5, NOTE.G5, NOTE.C5, NOTE.REST,
        NOTE.D5, NOTE.F5, NOTE.A5, NOTE.D5,
        NOTE.G5, NOTE.B4, NOTE.C5, NOTE.REST,
      ],
      durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5],
      loop: true,
    },
    drums: true,
    bassVolume: 0.15,
    melodyVolume: 0.12,
    drumVolume: 0.1,
  },

  gameover: {
    bpm: 70,
    bassLine: {
      notes: [NOTE.A3, NOTE.REST, NOTE.E3, NOTE.REST, NOTE.A3, NOTE.G3, NOTE.F3, NOTE.E3],
      durations: [1, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 1],
      loop: true,
    },
    melody: {
      notes: [
        NOTE.A4, NOTE.REST, NOTE.G4, NOTE.REST,
        NOTE.F4, NOTE.REST, NOTE.E4, NOTE.REST,
        NOTE.D4, NOTE.REST, NOTE.C4, NOTE.REST,
        NOTE.REST, NOTE.REST, NOTE.REST, NOTE.REST,
      ],
      durations: [0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 0.75, 0.25, 1, 0.5, 0.5, 0.5, 0.5, 0.5],
      loop: true,
    },
    drums: false,
    bassVolume: 0.12,
    melodyVolume: 0.1,
    drumVolume: 0,
  },
}

export class MusicManager {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private currentTrack: MusicTrack | null = null
  private isPlaying: boolean = false
  private volume: number = 0.5
  private enabled: boolean = true

  // Scheduling
  private nextBassTime: number = 0
  private nextMelodyTime: number = 0
  private nextDrumTime: number = 0
  private bassIndex: number = 0
  private melodyIndex: number = 0
  private schedulerInterval: number | null = null

  // Active oscillators for cleanup
  private activeOscillators: Set<OscillatorNode> = new Set()
  private activeGains: Set<GainNode> = new Set()

  constructor() {
    this.initContext()
  }

  private initContext(): void {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.context.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.context.destination)
    } catch (e) {
      console.warn('Web Audio API not supported for music:', e)
      this.enabled = false
    }
  }

  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume()
    }
  }

  play(track: MusicTrack): void {
    if (!this.enabled || !this.context || !this.masterGain) return

    // Don't restart if same track
    if (this.currentTrack === track && this.isPlaying) return

    // Stop current track
    this.stop()

    this.currentTrack = track
    this.isPlaying = true

    // Resume context if needed
    if (this.context.state === 'suspended') {
      this.context.resume()
    }

    // Reset indices
    this.bassIndex = 0
    this.melodyIndex = 0

    // Start scheduling
    const now = this.context.currentTime
    this.nextBassTime = now
    this.nextMelodyTime = now
    this.nextDrumTime = now

    // Start the scheduler loop
    this.schedulerInterval = window.setInterval(() => this.schedule(), 25)
  }

  private schedule(): void {
    if (!this.context || !this.masterGain || !this.currentTrack || !this.isPlaying) return

    const config = TRACK_CONFIGS[this.currentTrack]
    const now = this.context.currentTime
    const lookAhead = 0.1 // Schedule 100ms ahead

    // Schedule bass notes
    while (this.nextBassTime < now + lookAhead) {
      this.scheduleBassNote(config)
    }

    // Schedule melody notes
    while (this.nextMelodyTime < now + lookAhead) {
      this.scheduleMelodyNote(config)
    }

    // Schedule drums
    if (config.drums) {
      while (this.nextDrumTime < now + lookAhead) {
        this.scheduleDrum(config)
      }
    }
  }

  private scheduleBassNote(config: TrackConfig): void {
    if (!this.context || !this.masterGain) return

    const { bassLine, bpm, bassVolume } = config
    const beatDuration = 60 / bpm

    const noteIndex = this.bassIndex % bassLine.notes.length
    const note = bassLine.notes[noteIndex]
    const duration = bassLine.durations[noteIndex] * beatDuration

    if (note !== NOTE.REST) {
      this.playNote(note, this.nextBassTime, duration * 0.8, 'square', bassVolume)
    }

    this.nextBassTime += duration
    this.bassIndex++

    // Loop if needed
    if (this.bassIndex >= bassLine.notes.length && bassLine.loop) {
      this.bassIndex = 0
    }
  }

  private scheduleMelodyNote(config: TrackConfig): void {
    if (!this.context || !this.masterGain) return

    const { melody, bpm, melodyVolume } = config
    const beatDuration = 60 / bpm

    const noteIndex = this.melodyIndex % melody.notes.length
    const note = melody.notes[noteIndex]
    const duration = melody.durations[noteIndex] * beatDuration

    if (note !== NOTE.REST) {
      this.playNote(note, this.nextMelodyTime, duration * 0.7, 'triangle', melodyVolume)
    }

    this.nextMelodyTime += duration
    this.melodyIndex++

    // Loop if needed
    if (this.melodyIndex >= melody.notes.length && melody.loop) {
      this.melodyIndex = 0
    }
  }

  private scheduleDrum(config: TrackConfig): void {
    if (!this.context || !this.masterGain) return

    const { bpm, drumVolume } = config
    const beatDuration = 60 / bpm

    // Simple kick-snare pattern
    const beatInMeasure = Math.floor(this.nextDrumTime / beatDuration) % 4

    if (beatInMeasure === 0 || beatInMeasure === 2) {
      // Kick
      this.playKick(this.nextDrumTime, drumVolume)
    }
    if (beatInMeasure === 1 || beatInMeasure === 3) {
      // Snare (hi-hat style)
      this.playSnare(this.nextDrumTime, drumVolume * 0.6)
    }

    this.nextDrumTime += beatDuration * 0.5 // 8th notes
  }

  private playNote(
    midiNote: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ): void {
    if (!this.context || !this.masterGain) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = type
    osc.frequency.value = midiToFreq(midiNote)

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(volume * this.volume, startTime + 0.01)
    gain.gain.linearRampToValueAtTime(volume * this.volume * 0.7, startTime + duration * 0.5)
    gain.gain.linearRampToValueAtTime(0, startTime + duration)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(startTime)
    osc.stop(startTime + duration + 0.1)

    // Track for cleanup
    this.activeOscillators.add(osc)
    this.activeGains.add(gain)

    osc.onended = () => {
      this.activeOscillators.delete(osc)
      this.activeGains.delete(gain)
    }
  }

  private playKick(startTime: number, volume: number): void {
    if (!this.context || !this.masterGain) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, startTime)
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1)

    gain.gain.setValueAtTime(volume * this.volume, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(startTime)
    osc.stop(startTime + 0.2)

    this.activeOscillators.add(osc)
    osc.onended = () => this.activeOscillators.delete(osc)
  }

  private playSnare(startTime: number, volume: number): void {
    if (!this.context || !this.masterGain) return

    // Noise-based snare/hi-hat
    const bufferSize = this.context.sampleRate * 0.05
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const source = this.context.createBufferSource()
    source.buffer = buffer

    const gain = this.context.createGain()
    gain.gain.setValueAtTime(volume * this.volume * 0.5, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05)

    const filter = this.context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 5000

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    source.start(startTime)
  }

  stop(): void {
    this.isPlaying = false
    this.currentTrack = null

    // Clear scheduler
    if (this.schedulerInterval !== null) {
      clearInterval(this.schedulerInterval)
      this.schedulerInterval = null
    }

    // Stop all active oscillators
    for (const osc of this.activeOscillators) {
      try {
        osc.stop()
      } catch {
        // Already stopped
      }
    }
    this.activeOscillators.clear()
    this.activeGains.clear()
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume
    }
  }

  getVolume(): number {
    return this.volume
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled) {
      this.stop()
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  getCurrentTrack(): MusicTrack | null {
    return this.currentTrack
  }
}

// Singleton instance
let instance: MusicManager | null = null

export function getMusicManager(): MusicManager {
  if (!instance) {
    instance = new MusicManager()
  }
  return instance
}

// Convenience functions
export function playMusic(track: MusicTrack): void {
  getMusicManager().play(track)
}

export function stopMusic(): void {
  getMusicManager().stop()
}

export function setMusicVolume(vol: number): void {
  getMusicManager().setVolume(vol)
}
