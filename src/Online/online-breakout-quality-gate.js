/*
 TSETMC JS Toolkit
 Online Breakout Quality Gate

 Validates the quality of a breakout using:
 - prior 20-session resistance
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
    // Required current client-type data
    // ------------------------------------------------------------

    if ((ct).Buy_CountI <= 0 ||
        (ct).Sell_CountI <= 0 ||
        (ct).Buy_I_Volume <= 0 ||
        (ct).Sell_I_Volume <= 0)
        return false;


    // ------------------------------------------------------------
    // Buyer power
    // ------------------------------------------------------------

    var avgRealBuy =
        (ct).Buy_I_Volume /
        (ct).Buy_CountI;


    var avgRealSell =
        (ct).Sell_I_Volume /
        (ct).Sell_CountI;


    if (avgRealSell <= 0)
        return false;


    var buyerPower =
        avgRealBuy / avgRealSell;


    // ------------------------------------------------------------
    // Previous 20-session resistance + average volume
    // ------------------------------------------------------------

    var previousHigh = 0;
    var volumeSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (typeof [ih][i] == "undefined")
            continue;


        if ([ih][i].PriceMax > previousHigh)
            previousHigh = [ih][i].PriceMax;


        if ([ih][i].QTotTran5J > 0)
        {
            volumeSum +=
                [ih][i].QTotTran5J;

            validDays++;
        }

    }


    if (previousHigh <= 0 ||
        validDays < 15)
        return false;


    var avgVolume20 =
        volumeSum / validDays;


    if (avgVolume20 <= 0)
        return false;


    var volumeRatio =
        tvol / avgVolume20;


    // ------------------------------------------------------------
    // Breakout acceptance
    // ------------------------------------------------------------

    var breakoutPercent =
        ((pl - previousHigh) /
        previousHigh) * 100;


    var closingAcceptance =
        ((pc - previousHigh) /
        previousHigh) * 100;


    // ------------------------------------------------------------
    // Intraday position
    // ------------------------------------------------------------

    var dayRange =
        pmax - pmin;


    var rangePosition = 0.5;


    if (dayRange > 0)
    {
        rangePosition =
            (pl - pmin) /
            dayRange;
    }


    // ------------------------------------------------------------
    // Quality score
    // ------------------------------------------------------------

    var qualityScore = 0;


    // Actual penetration of previous resistance
    if (pl > previousHigh)
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
    if (pl >= pc)
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
        pl > previousHigh &&
        qualityScore >= 70 &&
        volumeRatio >= 1.30 &&
        buyerPower >= 1.15
    )
        return true;


    return false;

}()
