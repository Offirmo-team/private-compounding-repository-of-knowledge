# Timeline / Sequencer Terminology

What you're describing is much closer to a **timeline / sequencer** than a playlist. GarageBand is a good mental model.
The terminology mostly comes from DAWs (Digital Audio Workstations), video editors, animation tools, and game audio.

The key distinction is:

> **Playlist:** items happen one after another.\
> **Timeline:** events have positions in time and can overlap.

```text
TIME       0s        5s        10s       15s       20s
           |---------|---------|---------|---------|

MUSIC      [===============================]
VOICE            [--- "Get ready" ---]
SFX                     [DING]
VOICE                              [--- "Halfway!" ---]
SFX                                            [DING]
```

## Core terminology

---

Term Meaning Example

---

**Timeline** The overall time axis Your entire 7-minute on which everything is experience arranged

**Track** A lane containing Music track, Voice related content/events track, SFX track

**Clip** A piece of media placed 15 seconds of music, a on a track voice recording

**Event** Something that happens Play ding at 30s, at a specific time trigger vibration

**Cue** A timed "At 25s, play countdown instruction/marker to voice" make something happen

**Playhead** The current position in Currently at `02:34.5` the timeline

**Sequence** An ordered/timed The whole authored collection of experience events/clips

**Transport** Controls that Play, pause, stop, seek move/control playback

**Seek / Scrub** Move the playhead to Jump from 1:20 → 3:45 another time

**Duration** How long something Music clip is 60s lasts

**Start time / Offset** Where something begins Voice starts at 35s on the timeline

**Loop** Repeat a clip or region Repeat background music

**Marker** Named position on the "Warmup ends", timeline "Exercise 3"

**Region** A defined span of the Warmup: 0:00--1:00 timeline

**Fade in/out** Gradually change volume Music fades under voice

**Crossfade** Fade between two Music A → Music B overlapping clips

**Mix** Combine simultaneous Music + voice + ding audio

**Gain / Level** Volume of an individual Music at -12 dB source

**Automation** Change a property over Lower music volume time during speech

**Ducking** Automatically lower one Music gets quieter source when another under voice plays
-----------------------------------------------------------------------

## Track vs. clip

**Track** usually means the _lane_, not an individual item. This differs from Spotify terminology, where a song is
called a track.

In GarageBand/DAW terminology you'd have a **Voice Track**, and multiple **clips** or **regions** on that track.

```text
Timeline / Sequence
│
├── Music Track
│   ├── Music Clip A
│   └── Music Clip B
│
├── Voice Track
│   ├── Voice Clip: "Get ready"
│   ├── Voice Clip: "Halfway"
│   └── Voice Clip: "Rest"
│
└── SFX Track
    ├── Bell Event
    ├── Bell Event
    └── Completion Event
```

## Clips vs. events vs. cues

These three are related but useful to distinguish.

### Clip

A **clip** generally has media and duration:

```text
start: 30.0s
duration: 4.2s
audio: "halfway.wav"

       30s              34.2s
        [================]
```

### Event

An **event** can be instantaneous:

```text
30.0s → play ding
30.0s → vibrate
30.0s → show "HALFWAY"
```

### Cue

A **cue** is slightly more conceptual. It means _something scheduled to happen_. Theatre, broadcasting, audio systems,
and interactive experiences use this terminology a lot.

```text
Cue
├── time: 30s
├── audio: ding.wav
├── haptic: success
└── visual: "Halfway!"
```

For an app that isn't purely an audio editor, **cue** can be an excellent abstraction.

## Absolute vs. relative timing

Suppose you have:

```text
00:00   Workout starts
00:30   Exercise starts
00:35   Voice: "Keep going"
00:55   Voice: "5 seconds"
01:00   Bell
```

These can be represented as **absolute timeline positions**:

```text
voice → startTime: 35s
bell  → startTime: 60s
```

Or relative to something else:

```text
Exercise
  start: 30s

  cues:
    +5s   "Keep going"
    +25s  "5 seconds"
    +30s  bell
```

That distinction becomes important when designing the underlying model.

## Layers and tracks

You may also encounter **layer**.

A _track_ emphasizes organization over **time**:

```text
Voice Track   ──────────────────────────────>
Music Track   ──────────────────────────────>
SFX Track     ──────────────────────────────>
```

A _layer_ emphasizes things existing **simultaneously**:

```text
        Voice
          +
        Music
          +
         SFX
          ↓
       OUTPUT
```

For this kind of system, **tracks** work well in the authoring/data model, while the result can be described as
**layered audio**.

## Transport

There's a specific term for the playback controls familiar from GarageBand:

**Transport controls**, or simply **transport**.

```text
                TRANSPORT

      ⏮       ◀       ▶/❚❚       ▶       ⏭
    start   previous   play      next     end

                  02:34.500
                     ↑
                  playhead
```

A player might expose:

```text
play()
pause()
stop()
seek(time)

currentTime
duration
playbackRate
```

**Next/previous** become less fundamental in a timeline model. In a playlist, "next" is obvious. On a timeline
containing many overlapping events, _next what?_

More precise concepts are:

- **next marker**
- **next cue**
- **next section**
- **seek**

## Sections / scenes

For higher-level structure, don't try to make tracks do everything.

```text
SEQUENCE: "Morning Workout"

├── Section: Intro
├── Section: Warmup
├── Section: Jumping Jacks
├── Section: Rest
├── Section: Push-ups
└── Section: Finish
```

Independently, the tracks describe what happens over time:

```text
TRACKS

Music  ───[================][================]──
Voice  ───────[voice]──────────[voice]─────────
SFX    ───────────●────────●──────────●─────────
Haptic ───────────●────────●──────────●─────────
Visual ─────[title]──────────[countdown]────────
```

This is a useful separation:

- **Sections describe semantic structure.**
- **Tracks describe what happens over time.**

## Suggested software model

```text
Sequence
  ├── duration
  ├── markers / sections
  └── tracks[]
        └── clips[] / events[]

Player
  ├── sequence
  ├── playhead
  ├── state
  └── transport controls
```

## Vocabulary cheat sheet

The core vocabulary to learn is:

**sequence → timeline → track → clip/event → cue → marker/section → playhead → transport → mixing/ducking/automation**

Once you know these terms, GarageBand, Logic, Ableton, Premiere, Final Cut, animation timelines, and game-audio tooling
become much easier to reason about.
