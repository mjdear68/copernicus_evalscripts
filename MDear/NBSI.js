//VERSION=3
//Normalised Bare Soil Index (NBSI)
//Based on NDVI from Copernicus Browser -- Custom -- Index
//This method allows the histogram in the browser to function correctly

const colorRamp = [[0,0x000000],[1,0xffffff]]

let viz = new ColorRampVisualizer(colorRamp);

function setup() {
  return {
    input: ["B02", "B04", "B08", "B11", "B12", "dataMask"],
    output: [
      { id:"default", bands: 4 },
      { id: "index", bands: 1, sampleType: 'FLOAT32' }
    ]
  };
}

function evaluatePixel(samples) {
  let index = ((samples.B11 + samples.B04)-(samples.B08 + samples.B02))/((samples.B11 + samples.B04)+(samples.B08 + samples.B02));
  const minIndex = 0;
  const maxIndex = 1;
  let visVal = null;

  if(index > maxIndex || index < minIndex) {
    visVal = [0, 0, 0, 0];
  }
  else {
    visVal = [...viz.process(index),samples.dataMask];
  }

  // The library for tiffs only works well if there is one channel returned.
  // So here we encode "no data" as NaN and ignore NaNs on the frontend.  
  const indexVal = samples.dataMask === 1 ? index : NaN;

  return { default: visVal, index: [indexVal] };
}