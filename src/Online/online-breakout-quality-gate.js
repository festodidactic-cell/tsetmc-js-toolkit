/*
 TSETMC JS Toolkit
 Online Breakout Quality Gate

 Validates the quality of a breakout using:
 - prior historical resistance
 - relative volume
 - real-buyer power
 - intraday price position
 - price acceptance above resistance

 This module is a breakout-quality screener,
 not an automatic trading recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Current-session validation
    // ------------------------------------------------------------

    if (
        !Number.isFinite(Number(pl)) ||
        !Number.isFinite(Number(pc)) ||
        !Number.isFinite(Number(pmin)) ||
        !Number.isFinite(Number(pmax)) ||
        !Number.isFinite(Number(tvol)) ||
        Number(pl) <= 0 ||
        Number(pc) <= 0 ||
        Number(pmin) <= 0 ||
        Number(pmax) <= 0 ||
        Number(tvol) < 0
    )
        return false;


    if (
        !Number.isFinite(Number((ct).Buy_CountI)) ||
        !Number.isFinite(Number((ct).Sell_CountI)) ||
        !Number.isFinite(Number((ct).Buy_I_Volume)) ||
        !Number.isFinite(Number((ct).Sell_I_Volume)) ||
        Number((ct).Buy_CountI) <= 0 ||
        Number((ct).Sell_CountI) <= 0 ||
        Number((ct).Buy_I_Volume) <= 0 ||
        Number((ct).Sell_I_Volume) <= 0
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
        avgRealBuy / avgRealSell;


    // ------------------------------------------------------------
    // Historical resistance + average volume
    // ------------------------------------------------------------

    var previousHigh = 0;
    var volumeSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] == "undefined" ||
            !Number.isFinite(Number([ih][i].PriceMax)) ||
            !Number.isFinite(Number([ih][i].QTotTran5J)) ||
            Number([ih][i].PriceMax) <= 0 ||
            Number([ih][i].QTotTran5J) < 0
        )
            continue;


        var historicalHigh =
            Number([ih][i].PriceMax);


        var historicalVolume =
            Number([ih][i].QTotTran5J);


        if (historicalHigh > previousHigh)
        {
            previousHigh =
                historicalHigh;
        }


        volumeSum +=
            historicalVolume;


        validDays++;

    }


    if (
        previousHigh <= 0 ||
        validDays < 15
    )
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
    // Breakout acceptance
    // ------------------------------------------------------------

    var breakoutPercent =
        (
            (Number(pl) - previousHigh) /
            previousHigh
        ) * 100;


    var closingAcceptance =
        (
            (Number(pc) - previousHigh) /
            previousHigh
        ) * 100;


    // ------------------------------------------------------------
    // Intraday position
    // ------------------------------------------------------------

    var dayRange =
        Number(pmax) -
        Number(pmin);


    var rangePosition = 0.5;


    if (dayRange > 0)
    {
        rangePosition =
            (
                Number(pl) -
                Number(pmin)
            ) /
            dayRange;
    }


    if (rangePosition < 0)
        rangePosition = 0;


    if (rangePosition > 1)
        rangePosition = 1;


    // ------------------------------------------------------------
    // Quality score
    // ------------------------------------------------------------

    var qualityScore = 0;


    // Actual penetration of historical resistance
    if (Number(pl) > previousHigh)
        qualityScore += 25;


    // Closing price also accepts the breakout zone
    if (closingAcceptance >= -0.5)
        qualityScore += 20;


    // Volume confirmation
    if (volumeRatio >= 1.5)
        qualityScore += 20;


    // Strong real buyers
    if (buyerPower >= 1.3)
        qualityScore += 15;


    // Price remains in upper part of today's range
    if (rangePosition >= 0.70)
        qualityScore += 10;


    // Last price is not weaker than closing price
    if (Number(pl) >= Number(pc))
        qualityScore += 10;


    if (qualityScore > 100)
        qualityScore = 100;


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "BREAKOUT QUALITY";


    cfield1 =
        "Score: " +
        qualityScore +
        "%";


    cfield2 =
        qualityScore >= 85 ?
        "STRONG" :
        qualityScore >= 70 ?
        "VALID" :
        "WEAK";


    cfield3 =
        "Breakout: " +
        breakoutPercent.toFixed(2) +
        "%";


    cfield4 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield5 =
        "Buyer Power: " +
        buyerPower.toFixed(2);


    // ------------------------------------------------------------
    // Final gate
    // ------------------------------------------------------------

    if (
        Number(pl) > previousHigh &&
        qualityScore >= 70 &&
        volumeRatio >= 1.30 &&
        buyerPower >= 1.15
    )
        return true;


    return false;

}()
