/////////////////////////////////////////////////

export interface Dimensions2D {
	width: number
	height: number
}

export interface Dimensions2DSpec {
	// should define at least 2
	// should be coherent if all 3
	width?: number
	height?: number
	aspect_ratio?: number
}

/////////////////////////////////////////////////
