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
