https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--multi/universal-debug-api-browser/dist/index-bundle.js

    "scripts": {
    	"clean": "monorepo-script--clean-package …dist",

    	"_build:dev:watch": "monorepo-script--build-typescript-package --watch",
    	"_build:prod": "monorepo-script--build-typescript-package",
    	"xxxbuild:bundle": "parcel build --no-autoinstall --no-source-maps --out-file index-bundle.js  src/index.ts",
    	"ensure-size": "size-limit",

    	"dev": "run-s clean _build:dev:watch",
    	"build": "run-p _build:prod",
    	"demo": "parcel --out-dir .parcel --no-autoinstall doc/demo/index.html",

    	"np": "np --no-publish",
    	"prepublishOnly": "run-s clean build ensure-size"
    },


    "size-limit": [
    	{
    		"limit": "4kb",
    		"path": "dist/src.es2025.esm/index.js"
    	},
    	{
    		"limit": "6kb",
    		"path": "dist/index-bundle.js"
    	}
    ],

"keywords": [

-     "debug",
-     "logger",
-     "typescript"
- ],
