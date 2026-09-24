/*
 TSETMC JS Toolkit
 Core Module Tests

 Zero-dependency regression checks for:
 - price change
 - volume ratio
 - buyer power
 - candidate ranking
*/


const assert = require("assert");

const priceChange =
    require("../src/indicators/price-change");

const volumeRatio =
    require("../src/indicators/volume-ratio");

const buyerPower =
    require("../src/indicators/buyer-power");

const rankCandidate =
    require("../src/scoring/candidate-ranking");


// ------------------------------------------------------------
// Small test runner
// ------------------------------------------------------------

let passed = 0;
let failed = 0;


function test(name, fn) {

    try {

        fn();

        passed++;

        console.log(
            "PASS:",
            name
        );

    }

    catch (error) {

        failed++;

        console.error(
            "FAIL:",
            name
        );

        console.error(
            error.message
        );

    }

}


// ------------------------------------------------------------
// price-change.js
// ------------------------------------------------------------

test(
    "priceChange returns correct positive percentage",
    function () {

        assert.strictEqual(
            priceChange(110, 100),
            10
        );

    }
);


test(
    "priceChange returns correct negative percentage",
    function () {

        assert.strictEqual(
            priceChange(90, 100),
            -10
        );

    }
);


test(
    "priceChange protects against zero reference price",
    function () {

        assert.strictEqual(
            priceChange(100, 0),
            0
        );

    }
);


// ------------------------------------------------------------
// volume-ratio.js
// ------------------------------------------------------------

test(
    "volumeRatio calculates relative volume",
    function () {

        assert.strictEqual(
            volumeRatio(2000000, 1000000),
            2
        );

    }
);


test(
    "volumeRatio protects against zero reference volume",
    function () {

        assert.strictEqual(
            volumeRatio(1000000, 0),
            0
        );

    }
);


// ------------------------------------------------------------
// buyer-power.js
// ------------------------------------------------------------

test(
    "buyerPower compares average real buy and sell size",
    function () {

        const result =
            buyerPower(
                200000,
                20,
                100000,
                20
            );


        assert.strictEqual(
            result,
            2
        );

    }
);


test(
    "buyerPower returns zero for invalid participant counts",
    function () {

        assert.strictEqual(
            buyerPower(
                100000,
                0,
                100000,
                10
            ),
            0
        );

    }
);


// ------------------------------------------------------------
// candidate-ranking.js
// ------------------------------------------------------------

test(
    "candidate ranking returns valid score range",
    function () {

        const result =
            rankCandidate({

                smartMoney: 90,
                accumulation: 80,
                momentum: 85,
                quality: 90,
                regime: 75,
                risk: 20

            });


        assert.ok(
            result.score >= 0 &&
            result.score <= 100
        );

    }
);


test(
    "candidate ranking applies risk penalty",
    function () {

        const lowRisk =
            rankCandidate({

                smartMoney: 80,
                accumulation: 80,
                momentum: 80,
                quality: 80,
                regime: 80,
                risk: 10

            });


        const highRisk =
            rankCandidate({

                smartMoney: 80,
                accumulation: 80,
                momentum: 80,
                quality: 80,
                regime: 80,
                risk: 90

            });


        assert.ok(
            lowRisk.score >
            highRisk.score
        );

    }
);


test(
    "candidate ranking clamps invalid high scores",
    function () {

        const result =
            rankCandidate({

                smartMoney: 500,
                accumulation: 500,
                momentum: 500,
                quality: 500,
                regime: 500,
                risk: 0

            });


        assert.strictEqual(
            result.score,
            100
        );

    }
);


test(
    "candidate ranking handles missing input",
    function () {

        const result =
            rankCandidate({});


        assert.strictEqual(
            result.score,
            0
        );


        assert.strictEqual(
            result.classification,
            "REJECT"
        );

    }
);

// ------------------------------------------------------------
// candidate-ranking.js — boundary and robustness tests
// ------------------------------------------------------------

test(
    "candidate ranking classifies exact strong threshold",
    function () {

        const result =
            rankCandidate({

                smartMoney: 85,
                accumulation: 85,
                momentum: 85,
                quality: 85,
                regime: 85,
                risk: 0

            });


        assert.strictEqual(
            result.score,
            85
        );


        assert.strictEqual(
            result.classification,
            "STRONG_CANDIDATE"
        );

    }
);


test(
    "candidate ranking classifies exact review threshold",
    function () {

        const result =
            rankCandidate({

                smartMoney: 70,
                accumulation: 70,
                momentum: 70,
                quality: 70,
                regime: 70,
                risk: 0

            });


        assert.strictEqual(
            result.score,
            70
        );


        assert.strictEqual(
            result.classification,
            "REVIEW"
        );

    }
);


test(
    "candidate ranking classifies exact watch threshold",
    function () {

        const result =
            rankCandidate({

                smartMoney: 55,
                accumulation: 55,
                momentum: 55,
                quality: 55,
                regime: 55,
                risk: 0

            });


        assert.strictEqual(
            result.score,
            55
        );


        assert.strictEqual(
            result.classification,
            "WATCH"
        );

    }
);


test(
    "candidate ranking rejects score below watch threshold",
    function () {

        const result =
            rankCandidate({

                smartMoney: 54,
                accumulation: 54,
                momentum: 54,
                quality: 54,
                regime: 54,
                risk: 0

            });


        assert.strictEqual(
            result.classification,
            "REJECT"
        );

    }
);


test(
    "candidate ranking handles maximum risk penalty",
    function () {

        const result =
            rankCandidate({

                smartMoney: 100,
                accumulation: 100,
                momentum: 100,
                quality: 100,
                regime: 100,
                risk: 100

            });


        assert.strictEqual(
            result.score,
            75
        );


        assert.strictEqual(
            result.classification,
            "REVIEW"
        );

    }
);


test(
    "candidate ranking produces maximum score with zero risk",
    function () {

        const result =
            rankCandidate({

                smartMoney: 100,
                accumulation: 100,
                momentum: 100,
                quality: 100,
                regime: 100,
                risk: 0

            });


        assert.strictEqual(
            result.score,
            100
        );


        assert.strictEqual(
            result.classification,
            "STRONG_CANDIDATE"
        );

    }
);


test(
    "candidate ranking clamps negative inputs to zero",
    function () {

        const result =
            rankCandidate({

                smartMoney: -100,
                accumulation: -20,
                momentum: -10,
                quality: -1,
                regime: -500,
                risk: -100

            });


        assert.strictEqual(
            result.score,
            0
        );


        assert.strictEqual(
            result.classification,
            "REJECT"
        );

    }
);


test(
    "candidate ranking handles malformed input values",
    function () {

        const result =
            rankCandidate({

                smartMoney: "invalid",
                accumulation: null,
                momentum: undefined,
                quality: NaN,
                regime: Infinity,
                risk: "invalid"

            });


        assert.strictEqual(
            result.score,
            0
        );


        assert.strictEqual(
            result.classification,
            "REJECT"
        );

    }
);


test(
    "candidate ranking accepts numeric strings safely",
    function () {

        const result =
            rankCandidate({

                smartMoney: "80",
                accumulation: "80",
                momentum: "80",
                quality: "80",
                regime: "80",
                risk: "0"

            });


        assert.strictEqual(
            result.score,
            80
        );


        assert.strictEqual(
            result.classification,
            "REVIEW"
        );

    }
);


test(
    "candidate ranking exposes normalized component scores",
    function () {

        const result =
            rankCandidate({

                smartMoney: 120,
                accumulation: 80,
                momentum: 70,
                quality: 60,
                regime: 50,
                risk: 30

            });


        assert.strictEqual(
            result.components.smartMoney,
            100
        );


        assert.strictEqual(
            result.components.accumulation,
            80
        );


        assert.strictEqual(
            result.components.risk,
            30
        );

    }
);


test(
    "candidate ranking weighted values match configured weights",
    function () {

        const result =
            rankCandidate({

                smartMoney: 100,
                accumulation: 100,
                momentum: 100,
                quality: 100,
                regime: 100,
                risk: 20

            });


        assert.strictEqual(
            result.weighted.smartMoney,
            30
        );


        assert.strictEqual(
            result.weighted.accumulation,
            25
        );


        assert.strictEqual(
            result.weighted.momentum,
            20
        );


        assert.strictEqual(
            result.weighted.quality,
            15
        );


        assert.strictEqual(
            result.weighted.regime,
            10
        );


        assert.strictEqual(
            result.weighted.riskPenalty,
            5
        );

    }
);



// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------

console.log("");
console.log(
    "Tests:",
    passed + failed
);

console.log(
    "Passed:",
    passed
);

console.log(
    "Failed:",
    failed
);


if (failed > 0) {

    process.exitCode = 1;

}
