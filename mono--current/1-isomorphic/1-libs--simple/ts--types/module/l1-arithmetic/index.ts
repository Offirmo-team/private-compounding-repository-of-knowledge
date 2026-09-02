/* Some of those types don't add any additional safety,
 * but they're still great for documentation.
 */

/////////////////////////////////////////////////

export { type Integer }
export type PositiveInteger = NonNegativeInteger<number>
export type PositiveIntegerInRange<min = PositiveInteger, max = PositiveInteger> = PositiveInteger
export type LineNumber = PositiveIntegerInRange<1, 999999>

export type Percentage = number // between 0 and 1

export type Float = number
export type PositiveFloat = Float
export type FloatInRange<min = Float, max = Float> = Float

/////////////////////////////////////////////////

import type { Integer, NonNegativeInteger } from "type-fest"
