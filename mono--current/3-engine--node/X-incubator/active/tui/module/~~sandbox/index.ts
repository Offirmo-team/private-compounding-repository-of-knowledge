import { Chalk } from "chalk"

import { TUI, Text, Editor, ProcessTerminal, matchesKey, Loader } from "@earendil-works/pi-tui"

import { chalk, defaultEditorTheme as editorTheme } from './theme.ts'


/////////////////////////////////////////////////
// terminal
const terminal = new ProcessTerminal()


/////////////////////////////////////////////////
// TUI
const tui = new TUI(terminal)


/////////////////////////////////////////////////

const loader = new Loader(
	tui,                              // TUI instance for render updates
	(s) => chalk.cyan(s),            // spinner color function
	(s) => chalk.gray(s),            // message color function
	"Loading..."                      // message (default: "Loading...")
);
tui.addChild(loader)
loader.start();
//loader.setMessage("Still loading...");
//loader.stop();


/////////////////////////////////////////////////
// Add components

tui.addChild(new Text("Welcome to my app!"))

const editor = new Editor(tui, editorTheme)
editor.onSubmit = (text) => {
	console.log("Submitted:", text)
	tui.addChild(new Text(`You said: ${text}`))
};
tui.addChild(editor)


/////////////////////////////////////////////////

// In raw mode Ctrl+C doesn't send SIGINT — intercept it here to allow exit
tui.addInputListener((data) => {
	if (matchesKey(data, 'ctrl+c')) {
		tui.stop()
		process.exit(0)
	}
})

// Global debug key handler (Shift+Ctrl+D)
tui.onDebug = () => console.log("Debug triggered");

// Focus the editor so it receives keyboard input
tui.setFocus(editor)



//tui.start()
