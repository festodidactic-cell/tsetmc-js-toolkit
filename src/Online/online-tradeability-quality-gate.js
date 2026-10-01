/*
 TSETMC JS Toolkit
 Online Tradeability Quality Gate

 Purpose:
 Filter out weak or low-quality market candidates
 before applying more aggressive screening logic.

 Evaluates:
 - historical trading continuity
 - relative volume
 - relative traded value
 - real-buyer power
 - transaction activity
 - intraday price position

 This is a market-quality gate,
 not an automatic buy recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Current-session validation
    // ------------------------------------------------------------

    if (
        !Number.isFinite(Number(pl)) ||
        !Number.isFinite(Number(pmin)) ||
        !Number.isFinite(Number(pmax)) ||
        !Number.isFinite(Number(tvol)) ||
        !Number.isFinite(Number(tval)) ||
        !Number.isFinite(Number(tno)) ||
        Number(pl) <= 0 ||
        Number(pmin) <= 0 ||
        Number(pmax) <= 0 ||
        Number(tvol) <= 0 ||
        Number(tval) <= 0 ||
        Number(tno) <= 0
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
        avgRealBuy /
        avgRealSell;


    // ------------------------------------------------------------
    // Historical liquidity baseline
    // ------------------------------------------------------------

    var volumeSum = 0;
    var valueSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] == "undefined" ||
            !Number.isFinite(Number([ih][i].QTotTran5J)) ||
            !Number.isFinite(Number([ih][i].QTotCap)) ||
            Number([ih][i].QTotTran5J) <= 0 ||
            Number([ih][i].QTotCap) <= 0
        )
            continue;


        volumeSum +=
            Number([ih][i].QTotTran5J);


        valueSum +=
            Number([ih][i].QTotCap);


        validDays++;

    }


    // Reject symbols with weak trading continuity

    if (validDays < 15)
        return false;


    var avgHistoricalVolume =
        volumeSum /
        validDays;


    var avgHistoricalValue =
        valueSum /
        validDays;


    if (
        !Number.isFinite(avgHistoricalVolume) ||
        !Number.isFinite(avgHistoricalValue) ||
        avgHistoricalVolume <= 0 ||
        avgHistoricalValue <= 0
    )
        return false;


    // ------------------------------------------------------------
    // Relative activity
    // ------------------------------------------------------------

    var volumeRatio =
        Number(tvol) /
        avgHistoricalVolume;


    var valueRatio =
        Number(tval) /
        avgHistoricalValue;


    // ------------------------------------------------------------
    // Intraday price position
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


    // Stable recent trading history
    if (validDays >= 18)
        qualityScore += 20;


    // Current volume is not abnormally weak
    if (volumeRatio >= 0.60)
        qualityScore += 20;


    // Current traded value is healthy versus history
    if (valueRatio >= 0.60)
        qualityScore += 20;


    // Adequate transaction activity
    if (Number(tno) >= 30)
        qualityScore += 15;


    // Real buyers are not severely weaker
    if (buyerPower >= 0.80)
        qualityScore += 15;


    // Price is not trapped near today's low
    if (rangePosition >= 0.25)
        qualityScore += 10;


    if (qualityScore > 100)
        qualityScore = 100;


    // ------------------------------------------------------------
    // Output
    // ------------------------------------------------------------

    cfield0 =
        "TRADEABILITY GATE";


    cfield1 =
        "Quality: " +
        qualityScore +
        "%";


    cfield2 =
        qualityScore >= 80 ?
        "PASS" :
        qualityScore >= 65 ?
        "CAUTION" :
        "REJECT";


    cfield3 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield4 =
        "Value: " +
        valueRatio.toFixed(2) +
        "x";


    cfield5 =
        "Buyer Power: " +
        buyerPower.toFixed(2);


    // ------------------------------------------------------------
    // Final quality gate
    // ------------------------------------------------------------

    if (
        qualityScore >= 65 &&
        validDays >= 15 &&
        volumeRatio >= 0.50 &&
        valueRatio >= 0.50
    )
        return true;


    return false;

}()
