/*
 TSETMC JS Toolkit
 Online Symbol Regime Classifier

 Classifies the current behaviour of a symbol using:
 - short-term vs medium-term price structure
 - recent volatility
 - historical volatility
 - relative volume
 - position inside the recent price range

 Regimes:
 - COMPRESSION
 - EXPANSION
 - UPTREND
 - DOWNTREND
 - NEUTRAL

 This is a market-structure classifier,
 not an automatic trading recommendation.
*/


true == function ()
{

    // ------------------------------------------------------------
    // Historical validation
    // ------------------------------------------------------------

    if (typeof [ih][19] == "undefined")
        return false;


    var closeSum5 = 0;
    var closeSum20 = 0;

    var rangeSum5 = 0;
    var rangeSum20 = 0;

    var volumeSum20 = 0;

    var high20 = 0;
    var low20 = 0;

    var validDays = 0;


    // ------------------------------------------------------------
    // Historical calculations
    // ------------------------------------------------------------

    for (var i = 0; i < 20; i++)
    {

        if (
            typeof [ih][i] == "undefined" ||
            [ih][i].PClosing <= 0 ||
            [ih][i].PriceMax <= 0 ||
            [ih][i].PriceMin <= 0
        )
            continue;


        var dailyClose =
            [ih][i].PClosing;


        var dailyRangePercent =
            (
                ([ih][i].PriceMax -
                 [ih][i].PriceMin)
                /
                dailyClose
            ) * 100;


        closeSum20 +=
            dailyClose;


        rangeSum20 +=
            dailyRangePercent;


        if ([ih][i].QTotTran5J > 0)
        {
            volumeSum20 +=
                [ih][i].QTotTran5J;
        }


        if (
            high20 === 0 ||
            [ih][i].PriceMax > high20
        )
        {
            high20 =
                [ih][i].PriceMax;
        }


        if (
            low20 === 0 ||
            [ih][i].PriceMin < low20
        )
        {
            low20 =
                [ih][i].PriceMin;
        }


        if (i < 5)
        {
            closeSum5 +=
                dailyClose;

            rangeSum5 +=
                dailyRangePercent;
        }


        validDays++;

    }


    if (validDays < 20)
        return false;


    // ------------------------------------------------------------
    // Averages
    // ------------------------------------------------------------

    var avgClose5 =
        closeSum5 / 5;


    var avgClose20 =
        closeSum20 / 20;


    var avgRange5 =
        rangeSum5 / 5;


    var avgRange20 =
        rangeSum20 / 20;


    var avgVolume20 =
        volumeSum20 / 20;


    if (
        avgClose20 <= 0 ||
        avgRange20 <= 0 ||
        avgVolume20 <= 0
    )
        return false;


    // ------------------------------------------------------------
    // Derived metrics
    // ------------------------------------------------------------

    var trendStrength =
        (
            (avgClose5 - avgClose20)
            /
            avgClose20
        ) * 100;


    var rangeRatio =
        avgRange5 /
        avgRange20;


    var volumeRatio =
        tvol /
        avgVolume20;


    var pricePosition20 = 0.5;


    if (high20 > low20)
    {
        pricePosition20 =
            (pl - low20) /
            (high20 - low20);
    }


    // Clamp unexpected values

    if (pricePosition20 < 0)
        pricePosition20 = 0;


    if (pricePosition20 > 1)
        pricePosition20 = 1;


    // ------------------------------------------------------------
    // Regime classification
    // ------------------------------------------------------------

    var regime =
        "NEUTRAL";


    var regimeScore =
        50;


    // Volatility contraction
    if (
        rangeRatio <= 0.75 &&
        volumeRatio <= 1.20
    )
    {
        regime =
            "COMPRESSION";

        regimeScore =
            75;
    }


    // Volatility / activity expansion
    else if (
        rangeRatio >= 1.30 ||
        volumeRatio >= 1.80
    )
    {
        regime =
            "EXPANSION";

        regimeScore =
            80;
    }


    // Positive trend structure
    else if (
        trendStrength >= 1.50 &&
        pricePosition20 >= 0.60
    )
    {
        regime =
            "UPTREND";

        regimeScore =
            80;
    }


    // Negative trend structure
    else if (
        trendStrength <= -1.50 &&
        pricePosition20 <= 0.40
    )
    {
        regime =
            "DOWNTREND";

        regimeScore =
            80;
    }


    // ------------------------------------------------------------
    // Output fields
    // ------------------------------------------------------------

    cfield0 =
        "SYMBOL REGIME";


    cfield1 =
        regime;


    cfield2 =
        "Trend: " +
        trendStrength.toFixed(2) +
        "%";


    cfield3 =
        "Range: " +
        rangeRatio.toFixed(2) +
        "x";


    cfield4 =
        "Volume: " +
        volumeRatio.toFixed(2) +
        "x";


    cfield5 =
        "Position: " +
        (pricePosition20 * 100)
            .toFixed(0) +
        "%";


    // ------------------------------------------------------------
    // Show only symbols with an identifiable regime
    // ------------------------------------------------------------

    if (regime != "NEUTRAL")
        return true;


    return false;

}()
