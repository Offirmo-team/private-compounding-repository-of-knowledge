// use case: to avoid it!
// https://2ality.com/2012/03/signedzero.html (outdated)
export function isꓽnegative_zero(x: number): x is -0 {
	return Object.is(x, -0)
}
