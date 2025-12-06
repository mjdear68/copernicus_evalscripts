//VERSION=3

//Basic RGB script

// Required function
function setup() {
	return{
		input: ["B02", "B03", "B04"],
		output: {
			bands: 3,
			sampleType: "AUTO"
		}
	}
}

// Required function
function evaluatePixel(sample) {
	return [2.5*sample.B04, 2.5*sample.B03, 2.5*sample.B02];
}