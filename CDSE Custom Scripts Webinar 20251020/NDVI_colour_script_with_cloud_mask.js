function setup() {
	return{
		input: ["B04", "B08", "SCL"], // SCL gives cloud mask
		output: {
			bands: 3, //need 3 bands for RGB output
			sampleType: "AUTO"
		}
	}
}

// Required function
// index() creates normalised difference index
function evaluatePixel(sample) {
	let NDVI = index(sample.B08, sample.B04) //use 'let' to define variables
	
	// if cloud mask is true, return black, else return colour ramp
	if ([8, 9, 10].includes(sample.SCL)){
		return [0, 0, 0]}
	else{
		return valueInterpolate(NDVI,
								[-1, 0, 0.2, 0.5, 1], //thresholds
								//colour ramp - one for each threshold
								[
									[0, 0, 0],
									[1, 1, 0.88],
									[0.57, 0.75, 0.32],
									[0.31, 0.54, 0.18],
									[0.06, 0.33, 0.04]
								]
								);
	}
}
