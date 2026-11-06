This custom parcel.js resolver solves a bug where parcel can't resolve TypeScript files.

This resolver should be LAST so that it activates if parcel.js COULDN'T resolve the file.

If the file is a .js, we try to resolve the .ts version.

If it doesn't work, we fall back to the next resolver (will crash)
