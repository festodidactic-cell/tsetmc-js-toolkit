/*
 TSETMC JS Toolkit
 Online Multi-Day Swing Structure

 Detects early multi-session bullish structure using:
 - 3 / 5 / 10 session moving averages
 - close-to-close progression
 - relative volume
 - real-buyer power
 - current price extension control

 Designed for short swing structures,
 approximately 2 to 10 trading sessions.

 This is an analytical screener,
 not an automatic buy recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Historical validation
    // ------------------------------------------------------------

    if (typeof [ih][19] == "undefined")
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


    // ------------------------------------------------------------
    // Historical price / volume structure
    // ------------------------------------------------------------

    var closeSum3 = 0;
    var closeSum5 = 0;
    var closeSum10 = 0;

    var volumeSum20 = 0;

    var validCloseDays = 0;
    var validVolumeDays = 0;

    var risingTransitions = 0;


    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] == "undefined" ||
            [ih][i].PClosing <= 0
        )
            continue;


        var closeValue =
            [ih][i].PClosing;


        if (i < 3)
            closeSum3 += closeValue;


        if (i < 5)
            closeSum5 += closeValue;


        if (i < 10)
            closeSum10 += closeValue;


        if (
            [ih][i].QTotTran5J > 0
        )
        {
            volumeSum20 +=
                [ih][i].QTotTran5J;

            validVolumeDays++;
        }


        validCloseDays++;

    }


    if (
        validCloseDays < 10 ||
        validVolumeDays < 15
    )
        return false;


    // ------------------------------------------------------------
    // Moving averages
    // ------------------------------------------------------------

    var avgClose3 =
        closeSum3 / 3;


    var avgClose5 =
        closeSum5 / 5;


    var avgClose10 =
        closeSum10 / 10;


    var avgVolume20 =
        volumeSum20 /
        validVolumeDays;


    if (
        avgClose3 <= 0 ||
        avgClose5 <= 0 ||
        avgClose10 <= 0 ||
        avgVolume20 <= 0
    )
        return false;


    // ------------------------------------------------------------
    // Recent directional consistency
    // ------------------------------------------------------------

    for (var j = 0; j < 4; j++)
    {

        if (
            typeof [ih][j] != "undefined" &&
            typeof [ih][j + 1] != "undefined" &&
            [ih][j].PClosing > 0 &&
            [ih][j + 1].PClosing > 0
        )
        {

            if (
                [ih][j].PClosing >
                [ih][j + 1].PClosing
            )
            {
                risingTransitions++;
            }

        }

    }


    // ------------------------------------------------------------
    // Derived metrics
    // ------------------------------------------------------------

    var volumeRatio =
        tvol /
        avgVolume20;


    var trendSpread =
        (
            (avgClose3 - avgClose10)
            /
            avgClose10
        ) * 100;


    var priceExtension =
        (
            (pl - avgClose5)
            /
            avgClose5
        ) * 100;


    // ------------------------------------------------------------
    // Swing structure score
    // ------------------------------------------------------------

    var swingScore = 0;


    // Short-term structure above medium-term structure
    if (
        avgClose3 > avgClose5 &&
        avgClose5 > avgClose10
    )
        swingScore += 30;


    // Majority of recent closes are progressing upward
    if (risingTransitions >= 3)
        swingScore += 20;


    // Current price remains above short-term mean
    if (pl >= avgClose5)
        swingScore += 15;


    // Activity confirms the structure
    if (volumeRatio >= 1.10)
        swingScore += 15;


    // Current real buyers are supportive
    if (buyerPower >= 1.15)
        swingScore += 10;


    // Avoid heavily extended candidates
    if (
        priceExtension >= 0 &&
        priceExtension <= 7
    )
        swingScore += 10;


    if (swingScore > 100)
        swingScore = 100;


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "SWING STRUCTURE";


    cfield1 =
        "Score: " +
        swingScore +
        "%";


    cfield2 =
        swingScore >= 80 ?
        "STRONG" :
        swingScore >= 65 ?
        "DEVELOPING" :
        "WEAK";


    cfield3 =
        "Trend: " +
        trendSpread.toFixed(2) +
        "%";


    cfield4 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield5 =
        "Extension: " +
        priceExtension.toFixed(2) +
        "%";


    // ------------------------------------------------------------
    // Final screening gate
    // ------------------------------------------------------------

    if (
        swingScore >= 70 &&
        avgClose3 > avgClose5 &&
        avgClose5 > avgClose10 &&
        priceExtension <= 8
    )
        return true;


    return false;

}()
