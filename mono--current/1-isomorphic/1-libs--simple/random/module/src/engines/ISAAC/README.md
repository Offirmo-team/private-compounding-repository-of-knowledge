Isaac

- supposedly very fast on 32bits, maybe crypto secure
- Intro https://en.wikipedia.org/wiki/ISAAC_(cipher)
- Official site https://www.burtleburtle.net/bob/rand/isaacafa.html
- Important discussions
  - https://crypto.stackexchange.com/questions/1623/is-isaac-considered-secure-as-a-cryptographic-random-number-generator
  - seeding https://rt.cpan.org/Public/Bug/Display.html?id=64324 (linked from
    https://www.reddit.com/r/programming/comments/1xl7yc/isaac_a_pseudorandom_number_generator_thats/)
  -

https://jtobin.io/crushing-isaac

- Output: [ 0x00000000; 0xffffffff]
-         [-2147483648; 2147483647]

CREDITS

- This code is a derivation of https://github.com/rubycon/isaac.js MIT Licence: Copyright (c) 2012 Yves-Marie K. Rinquin
  - Which itself is derived from http://www.burtleburtle.net/bob/rand/isaacafa.html

- ISAAC is a cryptographically secure pseudo-random number generator
- (or CSPRNG for short) designed by Robert J. Jenkins Jr. in 1996 and
- based on RC4. It is designed for speed and security.
-
- ISAAC's informations & analysis:
- http://burtleburtle.net/bob/rand/isaac.html
- ISAAC's implementation details:
- http://burtleburtle.net/bob/rand/isaacafa.html
-
- ISAAC succesfully passed TestU01
