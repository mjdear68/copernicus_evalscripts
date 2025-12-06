//VERSION=3

//if NDWI >= 0, returns RGB; if NDWI < 0, returns transparency

function setup() {
	return {
		input: ["B02", "B03", "B04", "B08"],
		output: { bands: 4 } //need 3 RGB bands, plus transparency band 
	};
}

function evaluatePixel(sample) {
	//calculate NDWI
	let NDWI = (sample.B03 - sample.B08) /
	(sample.B03 + sample.B08)
	
	let transparency=0; //set transparency to false
	if (NDWI<0){
		transparency=1 //set transparency to true when NDWI is negative
		}
	
	return [2.5 * sample.B04, 2.5 * sample.B03,
	2.5 * sample.B02, transparency]
}