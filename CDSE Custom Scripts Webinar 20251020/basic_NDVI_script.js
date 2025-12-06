//VERSION=3

//Basic NDVI script

// Required function
function setup() {
	return{
		input: ["B04", "B08"],
		output: {
			bands: 1,
			sampleType: "AUTO"
		}
	}
}

// Required function
// index() creates normalised difference index
function evaluatePixel(sample) {
	return [index(sample.B08, sample.B04)];
}