// https://developer.chrome.com/docs/ai/built-in

/////////////////////////////////////////////////

// https://gemini.google.com/share/a4665036f4b9
type LLMTemperature = number
type LLMTopK = number
type LLMTokenCount = number

/////////////////////////////////////////////////

interface AI {
	assistant: AIAssistantFactory
	summarizer?: any
	writer?: any
	rewriter?: any
}

declare var ai: AI

/////////////////////////////////////////////////
// https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit#heading=h.nszgbi9928bg

interface AICreateMonitor extends EventTarget {
	ondownloadprogress(evt: {loaded: number, total: number}): void
}

interface AICreateMonitorCallback {
	(monitor: AICreateMonitor): void
}

type AICapabilityAvailability = 'no' | 'after-download' | 'readily' // TODO report better values no (won't appear again) no-downloading yes

interface AIAssistantFactory {
	create(options ?: Partial<AIAssistantCreateOptions>): Promise<AIAssistant>
	capabilities(): Promise<AIAssistantCapabilities>
}

interface AIAssistant {
	// prompt 101: https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit#heading=h.6uab7jk43311
	prompt(input: string, options?: AIAssistantPromptOptions): Promise<string>
	promptStreaming(input: string, options?: AIAssistantPromptOptions): ReadableStream<string>

	countPromptTokens(input: string, options?: AIAssistantPromptOptions): Promise<number>

	maxTokens: LLMTokenCount
	tokensSoFar: LLMTokenCount
	tokensLeft: LLMTokenCount // TODO REPORT redundant
	topK: LLMTopK
	temperature: LLMTemperature

	clone(): Promise<AIAssistant> // TODO report: should this one have an abort signal as well?
	destroy(): void // TODO REPORT Why needed in JS? Isn't the GC enough?
}

interface AIAssistantCapabilities {
	// https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit#heading=h.mufft7x7opvi
	available: AICapabilityAvailability // TODO report "readiness" with better values

	// only if available != 'no'
	defaultTopK?: LLMTopK
	maxTopK?: LLMTopK
	defaultTemperature?: LLMTemperature // TODO report: null or undefined?
}

interface AIAssistantCreateOptions {
	signal: AbortSignal
	monitor: AICreateMonitorCallback // awkward, TODO report

	systemPrompt: string
	initialPrompts: Array<AIAssistantPrompt>

	// Initializing a new session must either specify both topK and temperature, or neither of them.
	// TODO report
	topK: LLMTopK
	temperature: LLMTemperature
}

interface AIAssistantPrompt {
	role: AIAssistantPromptRole
	content: string

}

interface AIAssistantPromptOptions {
	signal: AbortSignal
}

type AIAssistantPromptRole = 'system' | 'user' | 'assistant' // TODO report: where can we set that?
