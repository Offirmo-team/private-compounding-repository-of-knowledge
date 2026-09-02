// isomorphic local storage
// copied from TS libs
export interface StorageⳇSync {
	readonly length: number
	clear(): void
	getItem(key: string): string | null
	removeItem(key: string): void
	setItem(key: string, value: string): void
}
