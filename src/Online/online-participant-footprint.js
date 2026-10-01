/*
 TSETMC JS Toolkit
 Online Participant Footprint Detector

 Detects observable participation patterns using:
 - institutional participation
 - institutional net flow
 - real-buyer power
 - relative volume
 - intraday price acceptance

 The filter evaluates observable market-participant
 behaviour. It does not attempt to identify a
 specific market actor.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Current-session validation
    // ------------------------------------------------------------

    if (
        !Number.isFinite(Number(pl)) ||
        !Number.isFinite(Number(py)) ||
        !Number.isFinite(Number(pmin)) ||
        !Number.isFinite(Number(pmax)) ||
        !Number.isFinite(Number(tvol)) ||
        Number(pl) <= 0 ||
        Number(py) <= 0 ||
        Number(pmin) <= 0 ||
        Number(pmax) <= 0 ||
        Number(tvol) <= 0 ||
        Number(pmax) < Number(pmin)
    )
        return false;


    // ------------------------------------------------------------
    // Client-type validation
    // ------------------------------------------------------------

    if (
        !Number.isFinite(Number((ct).Buy_CountI)) ||
        !Number.isFinite(Number((ct).Sell_CountI)) ||
        !Number.isFinite(Number((ct).Buy_I_Volume)) ||
        !Number.isFinite(Number((ct).Sell_I_Volume)) ||
        !Number.isFinite(Number((ct).Buy_N_Volume)) ||
        !Number.isFinite(Number((ct).Sell_N_Volume)) ||
        Number((ct).Buy_CountI) <= 0 ||
        Number((ct).Sell_CountI) <= 0 ||
        Number((ct).Buy_I_Volume) <= 0 ||
        Number((ct).Sell_I_Volume) <= 0 ||
        Number((ct).Buy_N_Volume) < 0 ||
        Number((ct).Sell_N_Volume) < 0
    )
        return false;


    // ------------------------------------------------------------
    // Real buyer power
    // ------------------------------------------------------------

    var avgRealBuy =
        Number((ct).Buy_I_Volume) /
        Number((ct).Buy_CountI);


    var avgRealSell =
        Number((ct).Sell_I_Volume) /
        Number((ct).Sell_CountI);


    if (
        !Number.isFinite(avgRealBuy) ||
        !Number.isFinite(avgRealSell) ||
        avgRealSell <= 0
    )
        return false;


    var buyerPower =
        avgRealBuy /
        avgRealSell;


    // ------------------------------------------------------------
    // Institutional participation
    // ------------------------------------------------------------

    var individualBuyVolume =
        Number((ct).Buy_I_Volume);


    var institutionalBuyVolume =
        Number((ct).Buy_N_Volume);


    var institutionalSellVolume =
        Number((ct).Sell_N_Volume);


    var totalBuyVolume =
        individualBuyVolume +
        institutionalBuyVolume;


    if (totalBuyVolume <= 0)
        return false;


    var institutionalBuyShare =
        institutionalBuyVolume /
        totalBuyVolume;


    var institutionalNetFlow =
        institutionalBuyVolume -
        institutionalSellVolume;


    var institutionalNetRatio =
        institutionalNetFlow /
        Number(tvol);


    // ------------------------------------------------------------
    // Historical volume baseline
    // ------------------------------------------------------------

    var volumeSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] == "undefined" ||
            !Number.isFinite(
                Number([ih][i].QTotTran5J)
            ) ||
            Number([ih][i].QTotTran5J) <= 0
        )
            continue;


        volumeSum +=
            Number([ih][i].QTotTran5J);


        validDays++;

    }


    if (validDays < 15)
        return false;


    var avgHistoricalVolume =
        volumeSum /
        validDays;


    if (
        !Number.isFinite(avgHistoricalVolume) ||
        avgHistoricalVolume <= 0
    )
        return false;


    var volumeRatio =
        Number(tvol) /
        avgHistoricalVolume;


    // ------------------------------------------------------------
    // Intraday price acceptance
    // ------------------------------------------------------------

    var dayRange =
        Number(pmax) -
        Number(pmin);


    var pricePosition = 0.5;


    if (dayRange > 0)
    {
        pricePosition =
            (
                Number(pl) -
                Number(pmin)
            ) /
            dayRange;
    }


    if (pricePosition < 0)
        pricePosition = 0;


    if (pricePosition > 1)
        pricePosition = 1;


    var dayChange =
        (
            (Number(pl) - Number(py)) /
            Number(py)
        ) * 100;


    // ------------------------------------------------------------
    // Footprint score
    // ------------------------------------------------------------

    var footprintScore = 0;


    // Meaningful institutional participation
    if (institutionalBuyShare >= 0.15)
        footprintScore += 15;


    if (institutionalBuyShare >= 0.30)
        footprintScore += 10;


    // Institutional net buying
    if (institutionalNetRatio > 0.02)
        footprintScore += 15;


    // Strong individual buyers
    if (buyerPower >= 1.30)
        footprintScore += 20;


    // Abnormal trading activity
    if (volumeRatio >= 1.50)
        footprintScore += 20;


    // Price accepts the upper half of today's range
    if (pricePosition >= 0.55)
        footprintScore += 10;


    // Price has not materially deteriorated
    if (dayChange >= -1)
        footprintScore += 10;


    if (footprintScore > 100)
        footprintScore = 100;


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "PARTICIPANT FOOTPRINT";


    cfield1 =
        "Score: " +
        footprintScore +
        "%";


    cfield2 =
        footprintScore >= 80 ?
        "STRONG" :
        footprintScore >= 65 ?
        "WATCH" :
        "WEAK";


    cfield3 =
        "Institutional: " +
        (institutionalBuyShare * 100)
            .toFixed(0) +
        "%";


    cfield4 =
        "Buyer Power: " +
        buyerPower.toFixed(2);


    cfield5 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    // ------------------------------------------------------------
    // Final screening gate
    // ------------------------------------------------------------

    if (
        footprintScore >= 70 &&
        volumeRatio >= 1.30 &&
        buyerPower >= 1.20
    )
        return true;


    return false;

}()
