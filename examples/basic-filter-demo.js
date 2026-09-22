/*
 TSETMC JS Toolkit
 Basic Filter Usage Example

 This example demonstrates how a screening condition
 can be structured as a reusable JavaScript module.
*/


function basicPriceVolumeFilter(stock) {

    const priceChange = stock.priceChange;
    const volumeRatio = stock.volumeRatio;


    return (
        priceChange > 2 &&
        volumeRatio > 1.5
    );

}


// Example market data object

const exampleStock = {

    symbol: "TEST",

    priceChange: 3.2,

    volumeRatio: 2.1

};



if (basicPriceVolumeFilter(exampleStock)) {

    console.log(
        exampleStock.symbol +
        " passed the screening criteria."
    );

}
else {

    console.log(
        exampleStock.symbol +
        " did not pass."
    );

}
