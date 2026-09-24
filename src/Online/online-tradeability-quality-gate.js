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
 - intraday price stability

 This is a market-quality gate,
 not an automatic buy recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Basic validation
    // ------------------------------------------------------------

    if (pc <= 0 ||
        tvol <= 0 ||
        tno <= 0)
        return false;


    if ((ct).Buy_CountI <= 0 ||
        (ct).Sell_CountI <= 0 ||
        (ct).Buy_I_Volume <= 0 ||
        (ct).Sell_I_Volume <= 0)
        return false;


    // ------------------------------------------------------------
    // Real buyer power
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
    // Historical liquidity baseline
    // ------------------------------------------------------------

    var volumeSum = 0;
    var valueSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (typeof [ih][i] == "undefined")
            continue;


        if (
            [ih][i].QTotTran5J > 0 &&
            [ih][i].PClosing > 0
        )
        {

            volumeSum +=
                [ih][i].QTotTran5J;


            valueSum +=
                [ih][i].QTotTran5J *
                [ih][i].PClosing;


            validDays++;

        }

    }


    // Reject symbols with weak trading continuity

    if (validDays < 15)
        return false;


    var avgVolume20 =
        volumeSum / validDays;


    var avgValue20 =
        valueSum / validDays;


    if (avgVolume20 <= 0 ||
        avgValue20 <= 0)
        return false;


    // ------------------------------------------------------------
    // Relative activity
    // ------------------------------------------------------------

    var volumeRatio =
        tvol / avgVolume20;


    var currentValue =
        tvol * pc;


    var valueRatio =
        currentValue / avgValue20;


    // ------------------------------------------------------------
    // Intraday stability
    // ------------------------------------------------------------

    var dayRange =
        pmax - pmin;


    var rangePercent = 0;


    if (pmin > 0)
    {
        rangePercent =
            (dayRange / pmin) * 100;
    }


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
    if (tno >= 30)
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
