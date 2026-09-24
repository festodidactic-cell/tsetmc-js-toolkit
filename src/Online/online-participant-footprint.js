/*
 TSETMC JS Toolkit
 Online Participant Footprint Detector

 Detects unusual participation patterns using:
 - institutional participation
 - institutional net flow
 - real-buyer power
 - relative volume
 - intraday price acceptance

 The filter detects observable market-participant
 behaviour. It does not attempt to identify a
 specific market actor.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Current client-type validation
    // ------------------------------------------------------------

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


    // ------------------------------------------------------------
    // Institutional participation
    // ------------------------------------------------------------

    var totalBuyVolume =
        (ct).Buy_I_Volume +
        (ct).Buy_N_Volume;


    var institutionalBuyShare = 0;


    if (totalBuyVolume > 0)
    {
        institutionalBuyShare =
            (ct).Buy_N_Volume /
            totalBuyVolume;
    }


    var institutionalNetFlow =
        (ct).Buy_N_Volume -
        (ct).Sell_N_Volume;


    var institutionalNetRatio = 0;


    if (tvol > 0)
    {
        institutionalNetRatio =
            institutionalNetFlow /
            tvol;
    }


    // ------------------------------------------------------------
    // Historical volume baseline
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
    // Intraday price acceptance
    // ------------------------------------------------------------

    var dayRange =
        pmax - pmin;


    var pricePosition = 0.5;


    if (dayRange > 0)
    {
        pricePosition =
            (pl - pmin) /
            dayRange;
    }


    var dayChange = 0;


    if (py > 0)
    {
        dayChange =
            ((pl - py) / py) * 100;
    }


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
