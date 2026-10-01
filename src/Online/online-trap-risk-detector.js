/*
 TSETMC JS Toolkit
 Online Trap Risk Detector

 Detects potentially low-quality high-volume moves using:
 - abnormal relative volume
 - rejection from the intraday high
 - failed price acceptance
 - weak real-buyer confirmation
 - reversal after an intraday upward excursion

 This module focuses on failed high-activity moves.

 It does not identify manipulation and is
 not an automatic sell recommendation.
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
    // Individual-investor validation
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
    // Intraday rejection structure
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


    var rejectionFromHigh =
        (
            (Number(pmax) - Number(pl)) /
            Number(pmax)
        ) * 100;


    var dayChange =
        (
            (Number(pl) - Number(py)) /
            Number(py)
        ) * 100;


    var highExcursion =
        (
            (Number(pmax) - Number(py)) /
            Number(py)
        ) * 100;


    // ------------------------------------------------------------
    // Trap-risk score
    // ------------------------------------------------------------

    var trapRisk = 0;


    // Unusually heavy activity
    if (volumeRatio >= 1.80)
        trapRisk += 20;


    if (volumeRatio >= 2.50)
        trapRisk += 10;


    // Meaningful rejection from today's high
    if (rejectionFromHigh >= 2.0)
        trapRisk += 20;


    if (rejectionFromHigh >= 4.0)
        trapRisk += 10;


    // Price no longer holds the upper part of the range
    if (pricePosition <= 0.55)
        trapRisk += 15;


    // Last price is weaker than closing price
    if (Number(pl) < Number(pc))
        trapRisk += 10;


    // Price moved meaningfully above yesterday,
    // but much of that move has failed to hold
    if (
        highExcursion >= 2.0 &&
        dayChange <= 0.50
    )
        trapRisk += 10;


    // Real buyers do not confirm the high-activity move
    if (buyerPower < 1.00)
        trapRisk += 5;


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
        "Reject: " +
        rejectionFromHigh.toFixed(2) +
        "%";


    cfield5 =
        "Position: " +
        (pricePosition * 100)
            .toFixed(0) +
        "%";


    // ------------------------------------------------------------
    // Final screening gate
    // ------------------------------------------------------------

    if (
        trapRisk >= 65 &&
        volumeRatio >= 1.50 &&
        rejectionFromHigh >= 1.50
    )
        return true;


    return false;

}()
