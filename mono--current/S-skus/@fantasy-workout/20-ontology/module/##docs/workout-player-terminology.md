# Workout Player Terminology

Use the **interaction model of a media player**, but replace music-specific nouns with workout-specific ones. This keeps
the controls immediately understandable without making exercises sound like songs.

## Terminology

---

Playlist concept Workout term Meaning

---

Playlist **Workout** / The full sequence the **Routine** user is doing

Track **Exercise** One item in the sequence

Track list **Exercise list** / Ordered list of **Routine** exercises

Current track **Current exercise** Exercise currently active

Up next / Queue **Up next** Exercises still to come

Play **Start** Begin the workout/exercise

Pause **Pause** Temporarily stop the timer/progression

Resume **Resume** Continue after pausing

Next **Next** Move to the next exercise

Previous / Back **Previous** Return to the previous exercise

Restart track **Restart exercise** Restart the current exercise timer

Restart playlist **Restart workout** Start the entire routine again

Progress **Workout progress** Position within the overall workout

Track progress **Exercise progress** Time elapsed/remaining in current exercise

Duration **Duration** Total workout/exercise time

Skip **Skip** Move past an exercise without completing it

Complete **Complete** / Mark exercise/workout **Finish** as finished
-----------------------------------------------------------------------

## Recommended terminology model

At the data/domain level:

```text
Workout
  ├── Exercise
  ├── Exercise
  ├── Exercise
  └── Exercise
```

At the player/controller level:

```text
Workout Player

Status:
  Ready
  Active
  Paused
  Completed

Controls:
  Start
  Pause
  Resume
  Previous
  Next
  Restart
  Skip
```

## Example UI

```text
7-Minute Workout

3 of 12
Jumping Jacks
00:24 remaining

[ Previous ]  [ Pause ]  [ Next ]

Up next
Wall Sit
Push-ups
Abdominal Crunches
```

## Back vs. Previous

**Back** and **Previous** should not mean the same thing.

Reserve **Back** for navigation:

> Leave the workout player / return to the previous screen.

Use **Previous** for sequence navigation:

> Move to the preceding exercise.

This avoids ambiguity between navigating the app and navigating the workout.

## Suggested code terminology

Avoid importing music terminology such as `Track` and `Playlist` unless the architecture is intentionally generic.

Prefer domain-specific names:

```text
Workout
Exercise
WorkoutSession

currentExercise
nextExercise()
previousExercise()
pause()
resume()
```

This keeps the domain model easy to understand while retaining the familiar interaction model of a media player.
