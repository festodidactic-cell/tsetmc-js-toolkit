/*
 TSETMC JS Toolkit

 Buyer Power Indicator

 Compares average real-buyer trade size
 with average real-seller trade size.

 Returns 0 when participant counts or
 calculated averages are invalid.
*/

function buyerPower(
    buyVolume,
    buyCount,
    sellVolume,
    sellCount
) {

    if (
        !Number.isFinite(Number(buyVolume)) ||
        !Number.isFinite(Number(buyCount)) ||
        !Number.isFinite(Number(sellVolume)) ||
        !Number.isFinite(Number(sellCount))
    ) {
        return 0;
    }


    buyVolume =
        Number(buyVolume);

    buyCount =
        Number(buyCount);

    sellVolume =
        Number(sellVolume);

    sellCount =
        Number(sellCount);


    if (
        buyVolume < 0 ||
        sellVolume < 0 ||
        buyCount <= 0 ||
        sellCount <= 0
    ) {
        return 0;
    }


    var averageBuy =
        buyVolume / buyCount;


    var averageSell =
        sellVolume / sellCount;


    if (
        !Number.isFinite(averageBuy) ||
        !Number.isFinite(averageSell) ||
        averageSell <= 0
    ) {
        return 0;
    }


    return averageBuy / averageSell;

}


if (typeof module !== "undefined") {
    module.exports = buyerPower;
}
