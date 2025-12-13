//VERSION=3

/****About****/
/*
The purpose of this script is to use NDVI differencing for the identification of vegetation loss between two dates. 

Author: Michael Dear, Dec 2025

Credits:
This script is based on diff_NDVI from the CDSE webinar "An Introduction to Working with Custom Scripts with the Sentinel Hub APIs in CDSE", 2025-10-04
https://youtu.be/7mkEVukGQ4o?si=VFfz4l_sjJYlSaxL

Usage
1. Select either "Sentinel 2" or "Sentinel 2 Quarterly Mosaics" in the Data Collections panel
2. Set a begin and end date that covers the required period using Time Range in Date panel
3. Load the custom script either by providing a url or by pasting into the Custom Script panel
4. Adjust the DATES constant and the thresholds to suit the project
5. Select the correct factor for the data source
6. Click Apply
*/

/****Global constants and variables****/
//Begin and end dates
//Order doesn't matter; output will be ordered descending
//Dates must exist for the given product for the range set in the Copernicus Browser Date panel
const DATES = ["2025-01-01", "2024-01-01"]; 

//Threshold to identify vegetation in first period
const veg_thold = 0.4; 

//Threshold to determine significant loss of vegetation
const change_thold = -0.3; 

//Threshold for water detection
const water_thold = 0.4;

//Uncomment only one of the following lines
//Uncomment this line for single dates
//const factor = 2.5; 
//Uncomment this line for quarterly mosaics
const FACTOR = 1/2000; 


/****Begin main script***/
function setup() {
	return {
		input: [{ bands: ["B02", "B03", "B04", "B08"] }],
		output: { bands: 3 },
		mosaicking: "ORBIT"
	}
};

//function to extract the two dates
function preProcessScenes (collections) {	
	collections.scenes.orbits = collections.scenes.orbits.filter(function
	(orbit) {
		let orbitDateFrom = orbit.dateFrom.split("T")[0];
		return DATES.includes(orbitDateFrom);
	})
return collections
};

//function to calculate NDVI
function calcNDVI(sample) {
	let NDVI = index(sample.B08, sample.B04)
	return NDVI
};

//function to calculate NDWI
function calcNDWI(sample) {
	let NDWI = index(sample.B03, sample.B08)
	return NDWI
};

function evaluatePixel(samples){
	//calculate NDVI difference
	let dNDVI = calcNDVI(samples[0]) - calcNDVI(samples[1]);
	
	//Mask pixels that were water during both periods
	if (calcNDWI(samples[0]) >= water_thold && calcNDWI(samples[1]) >= water_thold){
	return [0,0,1]
	}
	//Select pixels that were vegetation in the earliest period
	// with dNDVI below the change threshold
	else if (calcNDVI(samples[1]) >= veg_thold && dNDVI <= change_thold){
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
		return [FACTOR*samples[0].B04,FACTOR*samples[0].B03,FACTOR*samples[0].B02];
	}
		
}