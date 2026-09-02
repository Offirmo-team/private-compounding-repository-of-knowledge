import FractionBadlyTyped, { type NumeratorDenominator } from "fraction.js"

function time_to_human(seconds: number): string {
	//console.log(`time_to_human(${seconds})`)
	const human_time_parts = []

	const s = seconds % 60
	seconds -= s
	const m = (seconds / 60) % 60
	seconds -= m * 60
	const h = seconds / 3600

	if (h) {
		human_time_parts.push(`${h}h`)
	}
	if (m) {
		human_time_parts.push(`${m}m`)
	}
	if (s /*&& !(h && m)*/) {
		human_time_parts.push(`${s}s`)
	}

	return human_time_parts.join(" ")
}

/////
// manual re-typing

type FractionConstructor = {
	(fraction: Fraction): Fraction
	(num: number | string): Fraction
	(numerator: number, denominator: number): Fraction
	(numbers: [number | string, number | string]): Fraction
	(fraction: NumeratorDenominator): Fraction
	(
		firstValue: Fraction | number | string | [number | string, number | string] | NumeratorDenominator,
		secondValue?: number,
	): Fraction
}

interface Fraction {
	new (fraction: Fraction): Fraction
	new (num: number | string): Fraction
	new (numerator: number, denominator: number): Fraction
	new (numbers: [number | string, number | string]): Fraction
	new (fraction: NumeratorDenominator): Fraction
	new (
		firstValue: Fraction | number | string | [number | string, number | string] | NumeratorDenominator,
		secondValue?: number,
	): Fraction

	s: number
	n: number
	d: number

	abs(): Fraction
	neg(): Fraction

	add: FractionConstructor
	sub: FractionConstructor
	mul: FractionConstructor
	div: FractionConstructor
	pow: FractionConstructor
	gcd: FractionConstructor
	lcm: FractionConstructor

	mod(n?: number | string | Fraction): Fraction

	ceil(places?: number): Fraction
	floor(places?: number): Fraction
	round(places?: number): Fraction

	inverse(): Fraction

	simplify(eps?: number): Fraction

	equals(n: number | string | Fraction): boolean
	compare(n: number | string | Fraction): number
	divisible(n: number | string | Fraction): boolean

	valueOf(): number
	toString(decimalPlaces?: number): string
	toLatex(excludeWhole?: boolean): string
	toFraction(excludeWhole?: boolean): string
	toContinued(): number[]
	clone(): Fraction
}
const Fraction: Fraction = FractionBadlyTyped as any

export { Fraction, time_to_human }
