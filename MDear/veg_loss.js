//VERSION=3

//Calculate the vegetation loss between two dates
//Apply colour to output
//Apply transparency for non-loss pixels

//Michael Dear, Dec 2025

//Based on diff_NDVI, "Webinar - An Introduction to Working with Custom Scripts with the Sentinel Hub APIs in CDSE", 2025-10-04
//https://youtu.be/7mkEVukGQ4o?si=VFfz4l_sjJYlSaxL

//NOTES:
//Requires the use of Time Range in Copernicus Browser
//Can be used with S2 Quarterly Mosaics

//Begin and end dates
//Order doesn't matter; output will be ordered descending
//Dates must exist for the given product for the range set in Copernicus Browser
var allowedDates = ["2025-01-01", "2024-01-01"]; 

function setup() {
	return {
		input: [{ bands: ["B02", "B03", "B04", "B08"] }],
		output: { bands: 3 }, //need 3 RGB bands, plus transparency band 
		mosaicking: "ORBIT"
	}
};

//function to extract the two dates
function preProcessScenes (collections) {	
	collections.scenes.orbits = collections.scenes.orbits.filter(function
	(orbit) {
		var orbitDateFrom = orbit.dateFrom.split("T")[0];
		return allowedDates.includes(orbitDateFrom);
	})
return collections
};

//function to calculate NDVI
function calcNDVI(sample) {
	var NDVI = index(sample.B08, sample.B04)
	return NDVI
};

function evaluatePixel(samples){
	let veg_thold = 0.4; // Threshold to identify vegetation in first period
	let change_thold = -0.3; // Threshold to determine significant loss of vegetation
	let dNDVI = calcNDVI(samples[0]) - calcNDVI(samples[1]);
	
	//Select pixels that were vegetation in the earliest period
	// with dNDVI below the change threshold
	if (calcNDVI(samples[1]) >= veg_thold && dNDVI <= change_thold){
		// Output coloured pixels
		return valueInterpolate(
				dNDVI, //dates sorted descending
				[1.5*change_thold, change_thold], 
				//colour ramp - one for each threshold
				[
				[1, 0, 0],
				[0.5, 0, 0.5]
				]);
	}
	else{
		// return RGB
		//let factor = 2.5; //factor for single dates
		let factor = 1/2000; //factor for quarterly mosaics
		return [factor*samples[0].B04,factor*samples[0].B03,factor*samples[0].B02];
	}
		
}