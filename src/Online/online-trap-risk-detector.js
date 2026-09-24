/*
 TSETMC JS Toolkit
 Online Trap Risk Detector

 Detects potentially low-quality high-volume moves using:
 - abnormal relative volume
 - weak real-buyer power
 - negative real flow
 - rejection from intraday high
 - weak price acceptance

 This is a risk-detection filter.
 It does not identify manipulation and is
 not an automatic sell recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Basic validation
    // ------------------------------------------------------------

    if (
        pc <= 0 ||
        py <= 0 ||
        tvol <= 0
    )
        return false;


    if (
        (ct).Buy_CountI <= 0 ||
        (ct).Sell_CountI <= 0 ||
        (ct).Buy_I_Volume <= 0 ||
        (ct).Sell_I_Volume <= 0
    )
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


    var netRealFlow =
        (ct).Buy_I_Volume -
        (ct).Sell_I_Volume;


    // ------------------------------------------------------------
    // 20-session volume baseline
    // ------------------------------------------------------------

    var volumeSum = 0;
    var validDays = 0;


    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] != "undefined" &&
            [ih][i].QTotTran5J > 0
        )
        {

            volumeSum +=
                [ih][i].QTotTran5J;

            validDays++;

        }

    }


    if (validDays < 15)
        return false;


    var avgVolume20 =
        volumeSum / validDays;


    if (avgVolume20 <= 0)
        return false;


    var volumeRatio =
        tvol / avgVolume20;


    // ------------------------------------------------------------
    // Intraday price rejection
    // ------------------------------------------------------------

    var dayRange =
        pmax - pmin;


    var pricePosition =
        0.5;


    if (dayRange > 0)
    {
        pricePosition =
            (pl - pmin) /
            dayRange;
    }


    var rejectionFromHigh = 0;


    if (pmax > 0)
    {
        rejectionFromHigh =
            ((pmax - pl) /
            pmax) * 100;
    }


    var dayChange =
        ((pl - py) /
        py) * 100;


    // ------------------------------------------------------------
    // Trap risk score
    // ------------------------------------------------------------

    var trapRisk = 0;


    // Heavy activity requires stronger confirmation
    if (volumeRatio >= 1.80)
        trapRisk += 20;


    if (volumeRatio >= 2.50)
        trapRisk += 10;


    // Weak real-buyer power
    if (buyerPower < 1.00)
        trapRisk += 25;


    if (buyerPower < 0.75)
        trapRisk += 10;


    // Net individual selling
    if (netRealFlow < 0)
        trapRisk += 15;


    // Price rejected from today's high
    if (rejectionFromHigh >= 2.0)
        trapRisk += 10;


    // Price finishes in lower part of intraday range
    if (
        dayRange > 0 &&
        pricePosition <= 0.40
    )
        trapRisk += 10;


    if (trapRisk > 100)
        trapRisk = 100;


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "TRAP RISK";


    cfield1 =
        "Risk: " +
        trapRisk +
        "%";


    cfield2 =
        trapRisk >= 75 ?
        "HIGH RISK" :
        trapRisk >= 55 ?
        "CAUTION" :
        "LOW";


    cfield3 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield4 =
        "Buyer Power: " +
        buyerPower.toFixed(2);


    cfield5 =
        "Reject: " +
        rejectionFromHigh.toFixed(2) +
        "%";


    // ------------------------------------------------------------
    // Final screening gate
    // ------------------------------------------------------------

    if (
        trapRisk >= 65 &&
        volumeRatio >= 1.50 &&
        buyerPower < 1.10
    )
        return true;


    return false;

}()
