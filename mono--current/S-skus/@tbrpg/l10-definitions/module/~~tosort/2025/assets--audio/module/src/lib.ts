
// important!
// 1) loading this lib has side effects = will try to enable sound on any user interaction
// 2) as of 08/2023 it’s not compatible with dynamic import
import { Howl, Howler } from 'howler'

/////////////////////////////////////////////////

function createꓽsound(url: URL) {
	const src = url.toString()
	//console.log(url)
	const sound = new Howl({
		src,
		//onload(...rest) { console.log(`onload(${src})`, rest) },
		onloaderror(...rest) { console.log(`onloaderror(${src})`, rest) },
		onplayerror(...rest) { console.log(`onplayerror(${src})`, rest) },
		//onunlock(...rest) { console.log(`onunlock(${src})`, rest); sound.play() },
	})

	return sound
}

// TODO global settings

/////////////////////////////////////////////////

export {
	createꓽsound,
}
