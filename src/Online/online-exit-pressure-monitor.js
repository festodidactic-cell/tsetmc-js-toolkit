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
    // Current-session validation
    // ------------------------------------------------------------

    if (
        !Number.isFinite(Number(pl)) ||
        !Number.isFinite(Number(pc)) ||
        !Number.isFinite(Number(py)) ||
        !Number.isFinite(Number(pmin)) ||
        !Number.isFinite(Number(pmax)) ||
        !Number.isFinite(Number(tvol)) ||
        Number(pl) <= 0 ||
        Number(pc) <= 0 ||
        Number(py) <= 0 ||
        Number(pmin) <= 0 ||
        Number(pmax) <= 0 ||
        Number(tvol) <= 0 ||
        Number(pmax) < Number(pmin)
    )
        return false;


    // ------------------------------------------------------------
    // Current individual-investor validation
    // ------------------------------------------------------------

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
    // Real buyer power and net flow
    // ------------------------------------------------------------

    var buyPerCapita =
        Number((ct).Buy_I_Volume) /
        Number((ct).Buy_CountI);


    var sellPerCapita =
        Number((ct).Sell_I_Volume) /
        Number((ct).Sell_CountI);


    if (
        !Number.isFinite(buyPerCapita) ||
        !Number.isFinite(sellPerCapita) ||
        sellPerCapita <= 0
    )
        return false;


    var buyerPower =
        buyPerCapita /
        sellPerCapita;


    var netRealFlow =
        Number((ct).Buy_I_Volume) -
        Number((ct).Sell_I_Volume);


    // ------------------------------------------------------------
    // Historical volume baseline
    // ------------------------------------------------------------

    var volumeSum = 0;
    var validVolumeDays = 0;


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


        validVolumeDays++;

    }


    if (validVolumeDays < 15)
        return false;


    var avgHistoricalVolume =
        volumeSum /
        validVolumeDays;


    if (
        !Number.isFinite(avgHistoricalVolume) ||
        avgHistoricalVolume <= 0
    )
        return false;


    var volumeRatio =
        Number(tvol) /
        avgHistoricalVolume;


    // ------------------------------------------------------------
    // Current intraday price position
    // ------------------------------------------------------------

    var dayRange =
        Number(pmax) -
        Number(pmin);


    var priceLocation = 0.5;


    if (dayRange > 0)
    {
        priceLocation =
            (
                Number(pl) -
                Number(pmin)
            ) /
            dayRange;
    }


    if (priceLocation < 0)
        priceLocation = 0;


    if (priceLocation > 1)
        priceLocation = 1;


    var dayChange =
        (
            (Number(pl) - Number(py)) /
            Number(py)
        ) * 100;


    // ------------------------------------------------------------
    // Exit-pressure score
    // ------------------------------------------------------------

    var riskScore = 0;


    // Weak individual buyer power
    if (buyerPower < 0.85)
        riskScore += 25;


    // Additional penalty for severe buyer weakness
    if (buyerPower < 0.65)
        riskScore += 15;


    // Net individual selling
    if (netRealFlow < 0)
        riskScore += 20;


    // Heavy volume while last price is weaker than closing price
    if (
        volumeRatio >= 1.50 &&
        Number(pl) < Number(pc)
    )
        riskScore += 20;


    // Trading near the lower part of today's range
    if (
        dayRange > 0 &&
        priceLocation <= 0.35
    )
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

    if (
        riskScore >= 70 &&
        buyerPower < 0.90 &&
        netRealFlow < 0
    )
        return true;


    return false;

}()
