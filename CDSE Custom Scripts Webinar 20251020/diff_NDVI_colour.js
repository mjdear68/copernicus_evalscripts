//VERSION=3

//Calculate the NDVI difference between two dates
//Apply colour to output
//Apply water mask for most recent date

//NOTES:
//Requires the use of Time Range in Copernicus Browser
//Can be used with S2 Quarterly Mosaics

//begin and end dates
//order doesn't matter; output will be ordered descending
var allowedDates = ["2025-07-01", "2024-07-01"]; 

function setup() {
	return {
		input: [{ bands: ["B02", "B03", "B04", "B08"] }],
		output: { bands: 3 },
		mosaicking: "ORBIT"
	}
}

//function to extract the two dates
function preProcessScenes (collections) {	
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
	var ndvi_diff = calcNDVI(samples[0]) - calcNDVI(samples[1]) //dates sorted descending
	
	//water masks based on most recent observation
	//water mask with NDWI
	let NDWI = (samples[0].B03 - samples[0].B08) / (samples[0].B03 +
samples[0].B08)
/*	//water mask with FMI (https://www.mdpi.com/3195314)
	let FMI = (samples[0].B04 - samples[0].B02) / (samples[0].B04 +
samples[0].B02)
*/

	if (NDWI>0.2){
		return [0,0,1]
		}
/*	else if (FMI>0){
		return [0,0,1]
		}
*/
	else{
		return valueInterpolate(ndvi_diff,
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