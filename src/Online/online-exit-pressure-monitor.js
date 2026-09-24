/*
 TSETMC JS Toolkit
 Online Exit Pressure Monitor

 Purpose:
 Detect deterioration in current real-investor flow
 and price/volume behaviour.

 This is a risk-monitoring filter.
 It is not an automatic sell recommendation.
*/

true == function ()
{
    // ------------------------------------------------------------
    // Historical-data availability
    // ------------------------------------------------------------

    if (typeof [ih][19] == "undefined")
        return false;


    // ------------------------------------------------------------
    // Current individual investor data
    // ------------------------------------------------------------

    if ((ct).Buy_CountI <= 0 ||
        (ct).Sell_CountI <= 0 ||
        (ct).Buy_I_Volume <= 0 ||
        (ct).Sell_I_Volume <= 0)
        return false;


    var buyPerCapita =
        (ct).Buy_I_Volume /
        (ct).Buy_CountI;


    var sellPerCapita =
        (ct).Sell_I_Volume /
        (ct).Sell_CountI;


    if (sellPerCapita <= 0)
        return false;


    var buyerPower =
        buyPerCapita / sellPerCapita;


    var netRealFlow =
        (ct).Buy_I_Volume -
        (ct).Sell_I_Volume;


    // ------------------------------------------------------------
    // 20-session average volume
    // ------------------------------------------------------------

    var volumeSum = 0;
    var validVolumeDays = 0;


    for (var i = 0; i < 20; i++)
    {
        if (typeof [ih][i] != "undefined" &&
            [ih][i].QTotTran5J > 0)
        {
            volumeSum += [ih][i].QTotTran5J;
            validVolumeDays++;
        }
    }


    if (validVolumeDays < 15)
        return false;


    var avgVolume20 =
        volumeSum / validVolumeDays;


    if (avgVolume20 <= 0)
        return false;


    var volumeRatio =
        tvol / avgVolume20;


    // ------------------------------------------------------------
    // Current intraday price position
    // ------------------------------------------------------------

    var dayRange =
        pmax - pmin;


    var priceLocation = 0.5;


    if (dayRange > 0)
    {
        priceLocation =
            (pl - pmin) / dayRange;
    }


    var dayChange = 0;


    if (py > 0)
    {
        dayChange =
            ((pl - py) / py) * 100;
    }


    // ------------------------------------------------------------
    // Exit-pressure score
    // ------------------------------------------------------------

    var riskScore = 0;


    // Weak individual buyer power
    if (buyerPower < 0.85)
        riskScore += 25;


    // Severe buyer weakness
    if (buyerPower < 0.65)
        riskScore += 15;


    // Net individual selling
    if (netRealFlow < 0)
        riskScore += 20;


    // Heavy volume while last price is weaker than closing price
    if (volumeRatio >= 1.50 &&
        pl < pc)
        riskScore += 20;


    // Trading near the lower part of today's range
    if (dayRange > 0 &&
        priceLocation <= 0.35)
        riskScore += 10;


    // Negative change versus previous close
    if (dayChange < 0)
        riskScore += 10;


    if (riskScore > 100)
        riskScore = 100;


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "EXIT PRESSURE";


    cfield1 =
        "Risk: " +
        riskScore +
        "%";


    cfield2 =
        riskScore >= 80 ?
        "HIGH PRESSURE" :
        riskScore >= 65 ?
        "WATCH" :
        "NORMAL";


    cfield3 =
        "Buyer Power: " +
        buyerPower.toFixed(2);


    cfield4 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield5 =
        "Real Flow: " +
        (netRealFlow > 0 ? "+" : "") +
        netRealFlow;


    // ------------------------------------------------------------
    // Final screening gate
    // ------------------------------------------------------------

    if (riskScore >= 70 &&
        buyerPower < 0.90 &&
        netRealFlow < 0)
        return true;


    return false;

}()
