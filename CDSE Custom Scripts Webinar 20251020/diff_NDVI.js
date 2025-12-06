//VERSION=3

//Calculate the NDVI difference between two dates

function setup() {
	return {
		input: [{ bands: ["B04", "B08"] }],
		output: { bands: 1 },
		mosaicking: "ORBIT"
	}
}

//function to extract the two dates
function preProcessScenes (collections) {
	var allowedDates = ["2025-11-24", "2024-11-24"];
	
	collections.scenes.orbits = collections.scenes.orbits.filter(function
	(orbit) {
		var orbitDateFrom = orbit.dateFrom.split("T")[0];
		return allowedDates.includes(orbitDateFrom);
	})
return collections
}

//function to calculate NDVI
function calcNDVI(sample) {
	var NDVI = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
	return NDVI
}

function evaluatePixel(samples){
	//calculate and return dNDVI
	var ndvi_diff = calcNDVI(samples[1]) - calcNDVI(samples[0])
	return [ndvi_diff]
}