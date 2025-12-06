//VERSION=3

// Calculate the mean NDVI for a period

function setup() {
	return {
		input: [{ bands: ["B04", "B08", "dataMask"] }],
		output: {
			bands: 1
				},
		mosaicking: "ORBIT" // 'ORBIT' returns all data for each pixel for the period
	}
}

// function to calculate NDVI for a pixel
function calcNDVI(sample) {
	var NDVI = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
	return NDVI
}

function evaluatePixel(samples) {
	var sum = 0;
	var count = 0;
	
	//use all valid data to calculate mean NDVI for each pixel
	for (var i = 0; i < samples.length; i++) {
	if (samples[i].dataMask != 0) {
	var ndvi = calcNDVI(samples[i]);
	sum = sum + ndvi; // calculate the total NDVI for each pixel
	count++;
	}
	}
	var average = sum / count; //calculate the average NDVI
	
	return [average]; 
}