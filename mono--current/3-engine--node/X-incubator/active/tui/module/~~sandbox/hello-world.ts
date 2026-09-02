import { TUI, Text, Editor, ProcessTerminal, matchesKey } from "@earendil-works/pi-tui"

import { defaultEditorTheme as editorTheme } from './theme.ts'


// Create terminal
const terminal = new ProcessTerminal()

// Create TUI
const tui = new TUI(terminal)

// Add components
tui.addChild(new Text("Welcome to my app!"))

const editor = new Editor(tui, editorTheme)
editor.onSubmit = (text) => {
	console.log("Submitted:", text)
	tui.addChild(new Text(`You said: ${text}`))
};
tui.addChild(editor)

// Focus the editor so it receives keyboard input
tui.setFocus(editor)

// In raw mode Ctrl+C doesn't send SIGINT — intercept it here to allow exit
tui.addInputListener((data) => {
	if (matchesKey(data, 'ctrl+c')) {
		tui.stop()
		process.exit(0)
	}
})

// Start
tui.start()
