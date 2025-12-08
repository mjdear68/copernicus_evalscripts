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
		output: { bands: 4 }, //need 3 RGB bands, plus transparency band 
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
	if (calcNDWI(samples[0])>0.2 && calcNDWI(samples[1])>0.2){//Mask pixels that were water during both periods
		return [0,0,1]
		}
	else if (calcNDVI(samples[0]) < 0.2 && calcNDVI(samples[1]) < 0.2){//Mask pixels that were non-vegetation during both periods
		return [0,0,0];	
	}
	else{
		return valueInterpolate(
					calcNDVI(samples[0]) - calcNDVI(samples[1]), //dates sorted descending
					[-0.5, -0.2, 0, 0.2, 0.5], //thresholds; positive difference is greener
					//colour ramp - one for each threshold
					[
					[1, 0, 0],
					[0.5, 0, 0],
					[0.5, 0.5, 0.5],
					[0, 0.5, 0],
					[0, 1, 0]
					]);
		}
}