## better-console-groups

auto-break out of collapsed console groups if error

This is only useful on debuggers supporting collapsed groups = mainly browser

1. why isomorphic?
   - because technically not browser dependent. Also making it isomorphic helps breaking deps loops.
2. why advanced?
   - because of the above. not a lib that should be blindly used.
