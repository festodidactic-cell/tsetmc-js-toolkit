/*
 TSETMC JS Toolkit

 Price Change Indicator

 Calculates percentage change between
 current price and reference price.
*/


function priceChange(currentPrice, referencePrice) {

    if (!referencePrice || referencePrice === 0) {
        return 0;
    }


    return (
        ((currentPrice - referencePrice) /
        referencePrice) * 100
    );

}


// Export for reuse

if (typeof module !== "undefined") {

    module.exports = priceChange;

}
