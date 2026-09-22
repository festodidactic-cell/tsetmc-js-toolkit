/*
 TSETMC JS Toolkit

 Volume Ratio Indicator

 Calculates current trading volume
 compared with average/reference volume.
*/


function volumeRatio(currentVolume, referenceVolume) {


    if (!referenceVolume || referenceVolume === 0) {
        return 0;
    }


    return currentVolume / referenceVolume;


}


// Export for reuse

if (typeof module !== "undefined") {

    module.exports = volumeRatio;

}
