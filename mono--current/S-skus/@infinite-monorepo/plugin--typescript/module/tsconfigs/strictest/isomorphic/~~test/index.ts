/////////////////////////////////////////////////

// @ts-expect-error TS6133: 'target' is declared but its value is never read
export function hello(target: string): void {
	// @ts-expect-error TS2584: Cannot find name 'console'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
	console.log(`Hello!`)
}
