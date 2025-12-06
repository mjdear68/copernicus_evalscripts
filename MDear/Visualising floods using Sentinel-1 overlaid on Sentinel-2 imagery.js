//VERSION=3
// https://custom-scripts.sentinel-hub.com/data-fusion/s1_flooding_visualisation/
// Sentinel-2 Mosaic

// Usage
// Go to the location
// Select the Sentinel-2 quarterly mosaic date
// Go to custom scripts
// Select "Use additional datasets"
// Add "S-1 GRD"
// Select the date range for the flood event
// Paste in and run the script

function setup() {
    return {
        input: [
            {
                datasource: "CUSTOM",
                bands: ["B02", "B03", "B04"],
            },
            {
                datasource: "S1GRD",
                bands: ["VV", "VH", "dataMask"],
            },
        ],
        output: { bands: 4 },
        mosaicking: "SIMPLE",
    };
}

function toDB(input) {
    return (10 * Math.log(input)) / Math.LN10;
}
//threshold value for water detection, reduce for more water, increase for less water
const lim = 15;
//gain value for image brightness (increase for brighter image)
const f = 0.0008;

function evaluatePixel(sample) {
    var S1 = sample.S1GRD[0];
    var S2 = sample.CUSTOM[0];
    if (toDB(S1.VV) <= -1 * lim) {
        return [S1.VV * 10, S1.VV * 10, S1.VV * 50, 1];
    } else {
        return [f * S2.B04, f * S2.B03, f * S2.B02, 1];
    }
}