This custom parcel.js resolver solves a bug where parcel can't resolve typescript files.

This resolver should be LAST so that it activates if parcel.js COULDN'T resolve the file.

If the file is a .js, we try to resolve the .ts version.

If it doesn't work, we fallback to the next resolver (will crash)

"@parcel/diagnostic": "2.10.3", "@parcel/node-resolver-core": "3.1.3", "@parcel/plugin": "2.10.3", "@parcel/utils":
"2.10.3", "nullthrows": "^1.1.1"
