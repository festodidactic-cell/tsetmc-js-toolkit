/*
 TSETMC JS Toolkit
 Candidate Ranking Engine

 Combines normalized module scores into a single
 candidate-ranking score.

 Expected input scores:
 - smartMoney:   0..100
 - accumulation: 0..100
 - momentum:     0..100
 - quality:      0..100
 - regime:       0..100
 - risk:         0..100

 Risk is treated as a penalty.

 This module does not generate buy/sell signals.
 It provides a comparable ranking score for
 screening candidates.
*/


function clamp(value, min, max) {

    if (value < min)
        return min;

    if (value > max)
        return max;

    return value;

}


function safeScore(value) {

    var number =
        Number(value);

    if (!isFinite(number))
        return 0;

    return clamp(
        number,
        0,
        100
    );

}


function rankCandidate(input) {

    input =
        input || {};


    var smartMoney =
        safeScore(
            input.smartMoney
        );


    var accumulation =
        safeScore(
            input.accumulation
        );


    var momentum =
        safeScore(
            input.momentum
        );


    var quality =
        safeScore(
            input.quality
        );


    var regime =
        safeScore(
            input.regime
        );


    var risk =
        safeScore(
            input.risk
        );


    // ------------------------------------------------------------
    // Positive components
    // ------------------------------------------------------------

    var positiveScore =
        (
            smartMoney * 0.30 +
            accumulation * 0.25 +
            momentum * 0.20 +
            quality * 0.15 +
            regime * 0.10
        );


    // ------------------------------------------------------------
    // Risk penalty
    // ------------------------------------------------------------

    var riskPenalty =
        risk * 0.25;


    var finalScore =
        positiveScore -
        riskPenalty;


    finalScore =
        clamp(
            finalScore,
            0,
            100
        );


    // ------------------------------------------------------------
    // Classification
    // ------------------------------------------------------------

    var classification;


    if (finalScore >= 85) {

        classification =
            "STRONG_CANDIDATE";

    }

    else if (finalScore >= 70) {

        classification =
            "REVIEW";

    }

    else if (finalScore >= 55) {

        classification =
            "WATCH";

    }

    else {

        classification =
            "REJECT";

    }


    return {

        score:
            Number(
                finalScore.toFixed(2)
            ),

        classification:
            classification,

        components: {

            smartMoney:
                smartMoney,

            accumulation:
                accumulation,

            momentum:
                momentum,

            quality:
                quality,

            regime:
                regime,

            risk:
                risk

        },

        weighted: {

            smartMoney:
                Number(
                    (smartMoney * 0.30)
                    .toFixed(2)
                ),

            accumulation:
                Number(
                    (accumulation * 0.25)
                    .toFixed(2)
                ),

            momentum:
                Number(
                    (momentum * 0.20)
                    .toFixed(2)
                ),

            quality:
                Number(
                    (quality * 0.15)
                    .toFixed(2)
                ),

            regime:
                Number(
                    (regime * 0.10)
                    .toFixed(2)
                ),

            riskPenalty:
                Number(
                    riskPenalty.toFixed(2)
                )

        }

    };

}


// ------------------------------------------------------------
// CommonJS export
// ------------------------------------------------------------

if (typeof module !== "undefined") {

    module.exports =
        rankCandidate;

}
