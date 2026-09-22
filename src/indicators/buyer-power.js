/*
 TSETMC JS Toolkit

 Buyer Power Indicator

 Estimates buying strength compared
 with selling pressure.
*/


function buyerPower(
    buyVolume,
    buyCount,
    sellVolume,
    sellCount
) {


    var averageBuy =
        buyVolume / (buyCount || 1);


    var averageSell =
        sellVolume / (sellCount || 1);



    if (averageSell === 0) {

        return 0;

    }



    return averageBuy / averageSell;


}


// Export for reuse

if (typeof module !== "undefined") {

    module.exports = buyerPower;

}
