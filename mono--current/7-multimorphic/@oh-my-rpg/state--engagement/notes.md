# Engagement

// IMPORTANT NOTE: the consumer is free to interpret this as they want. // For ex. a "full flow" consumer such as a
terminal-based app would likely display everything as flow anyway

## Concepts

- Engagement = any sort of attention-grabbing message
- client type:
  - full flow such as: terminal, chat interface
  - complex app
- level: log / notice / warning / critical
- CONTENT flow vs float
  - flow = in the same flow as one's actions, usually immediate BUT not necessarily important, ex. "level up" animation
    = in-flow but could be ignored
    - NOTE that action's feedback (ack, result) doesn't have to be in flow, ex. confirmation toast
    - acknowledgement of request
    - form / input (incl. confirmation requests)
    - progress bar, illusion of labor
    - answer, result (or error), acknowledgement
    - cutscene (interactive)
    - transition
    - tutorial?
  - float = float above the UI and doesn't have to interrupt the CONTENT flow
    - announcement banner (ex. maintenance)
    - upgrade notice
    - hint of the day
- main vs aside
  - aside = side message like an achievement
- auto-dismiss

## Known use cases

                                      Content flow?    Main

Notification banner no progress with minimal duration yes Growth prompt no Welcome message no tip of the day no tip for
current flow ex. play yes warning relevant to current flow yes ex. "inventory full" success/failure of a code redemption
yes achievement-unlocked yes "app ugraded" no cutscene yes ex. hyperspace jump, landing... NPC dialog yes

## TOSORT

type EngagementType = | `flow` // ex. normal text | `flow--${string}` // ex. cutscene, transition, loading bar, special
effect... | `float--${string}` // ex. announcement banner, "tip of the day"...
