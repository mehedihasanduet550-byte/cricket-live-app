const page = window.location.pathname;
const sliders = document.querySelectorAll(".slider");

let speed = 1;

function move() {

    sliders.forEach(slider => {

        slider.scrollLeft += speed;

        if (slider.scrollLeft >= slider.scrollWidth / 2) {

            slider.scrollLeft = 0;
        }

    });

}

setInterval(move, 20);

const hostInput = document.getElementById("hostTeam");
const visitorInput = document.getElementById("visitorTeam");

const hostLabel = document.getElementById("hostLabel");
const visitorLabel = document.getElementById("visitorLabel");

// 🔥 live update
if (hostInput && hostLabel) {
    hostInput.addEventListener("input", function () {
        hostLabel.textContent = hostInput.value || "Host Team";
    });
}

if (visitorInput && visitorLabel) {
    visitorInput.addEventListener("input", function () {
        visitorLabel.textContent = visitorInput.value || "Visitor Team";
    });
}

function goToOpening() {
    window.location.href = "/opening-players";
}

function startMatch() {
    window.location.href = "/live-match";
}

function validateMatch() {

    const host = document.getElementById("hostTeam");
    const visitor = document.getElementById("visitorTeam");
    const overs = document.getElementById("overs");

    const toss = document.querySelector('input[name="toss"]:checked');
    const opt = document.querySelector('input[name="opt"]:checked');

    if (!host.value.trim()) {
        host.focus();
        alert("Enter Host Team");
        return;
    }

    if (!visitor.value.trim()) {
        visitor.focus();
        alert("Enter Visitor Team");
        return;
    }

    if (!toss) {
        alert("Select Toss Winner");
        return;
    }

    if (!opt) {
        alert("Select Bat or Bowl");
        return;
    }

    if (!overs.value) {
        overs.focus();
        alert("Enter Overs");
        return;
    }

    const tossValue = toss.value;
    const optValue = opt.value;

    const url = `/save-match?host=${encodeURIComponent(host.value)}&visitor=${encodeURIComponent(visitor.value)}&toss=${tossValue}&opt=${optValue}&overs=${overs.value}`;

    window.location.href = url;
}
function validateMatch2() {

    const host = document.getElementById("hostTeam");
    const visitor = document.getElementById("visitorTeam");
    const overs = document.getElementById("overs");

    const toss = document.querySelector('input[name="toss"]:checked');
    const opt = document.querySelector('input[name="opt"]:checked');

    if (!host.value.trim()) {
        host.focus();
        alert("Enter Host Team");
        return;
    }

    if (!visitor.value.trim()) {
        visitor.focus();
        alert("Enter Visitor Team");
        return;
    }

    if (!toss) {
        alert("Select Toss Winner");
        return;
    }

    if (!opt) {
        alert("Select Bat or Bowl");
        return;
    }

    if (!overs.value) {
        overs.focus();
        alert("Enter Overs");
        return;
    }

    const url =
    `/save-match-2?host=${encodeURIComponent(host.value)}`
    + `&visitor=${encodeURIComponent(visitor.value)}`
    + `&toss=${toss.value}`
    + `&opt=${opt.value}`
    + `&overs=${overs.value}`;

    window.location.href = url;
}
function validateOpening() {

    const striker = document.getElementById("striker");
    const nonStriker = document.getElementById("nonStriker");
    const bowler = document.getElementById("bowler");

    if (!striker.value.trim()) {
        striker.focus();
        alert("Enter Striker Name");
        return;
    }

    if (!nonStriker.value.trim()) {
        nonStriker.focus();
        alert("Enter Non-Striker Name");
        return;
    }

    if (!bowler.value.trim()) {
        bowler.focus();
        alert("Enter Bowler Name");
        return;
    }

    // 🔥 backend e pathabo
    const url = `/save-opening?striker=${encodeURIComponent(striker.value)}&nonStriker=${encodeURIComponent(nonStriker.value)}&bowler=${encodeURIComponent(bowler.value)}`;

    window.location.href = url;
}
function validateOpening2() {

    const striker = document.getElementById("striker");
    const nonStriker = document.getElementById("nonStriker");
    const bowler = document.getElementById("bowler");

    if (!striker.value.trim()) {
        striker.focus();
        alert("Enter Striker Name");
        return;
    }

    if (!nonStriker.value.trim()) {
        nonStriker.focus();
        alert("Enter Non-Striker Name");
        return;
    }

    if (!bowler.value.trim()) {
        bowler.focus();
        alert("Enter Bowler Name");
        return;
    }

    const url =
    `/save-opening-2?striker=${encodeURIComponent(striker.value)}`
    + `&nonStriker=${encodeURIComponent(nonStriker.value)}`
    + `&bowler=${encodeURIComponent(bowler.value)}`;

    window.location.href = url;
}
function saveSettings() {

    const players = document.querySelector('[name="players"]').value;

    const noball = document.querySelector('[name="noball"]').checked ? 1 : 0;
    const noball_reball = document.querySelector('[name="noball_reball"]').checked ? 1 : 0;
    const noball_run = document.querySelector('[name="noball_run"]').value;

    const wide = document.querySelector('[name="wide"]').checked ? 1 : 0;
    const wide_reball = document.querySelector('[name="wide_reball"]').checked ? 1 : 0;
    const wide_run = document.querySelector('[name="wide_run"]').value;

    // 🔥 backend e pathabo
    const url = `/save-settings?players=${players}&noball=${noball}&noball_reball=${noball_reball}&noball_run=${noball_run}&wide=${wide}&wide_reball=${wide_reball}&wide_run=${wide_run}`;

    window.location.href = url;
}

let extraTotal = 0;
let extraLB = 0;
let extraB = 0;
let extraWD = 0;
let extraNB = 0;
let partnerships = [];
let fallOfWickets = [];
// 🔥 current running partnership
let pRuns = 0;
let pBalls = 0;
if (page.includes("live-match") || page.includes("match")) {

    let score = 0;
    let ball = 0;
    let over = 0;
    let wickets = 0;
    let strikerRuns = 0;
    let strikerBalls = 0;
    let striker4 = 0;
    let striker6 = 0;
    let striker = "";
    let nonStriker = "";
    let nonStrikerRuns = 0;
    let nonStrikerBalls = 0;
    let nonStriker4 = 0;
    let nonStriker6 = 0;
    let bowlerRuns = 0;
    let bowlerBalls = 0;
    let bowlerWickets = 0;
    let bowlerMaiden = 0;
    let overRuns = 0;
    let thisOver = [];
    
    

    window.onload = function(){

        // 🔥 SCORE
        const scoreText = document.getElementById("score").innerText;
        const overText = document.getElementById("over").innerText;

        score = parseInt(scoreText.split(" - ")[0]) || 0;
        wickets = parseInt(scoreText.split(" - ")[1]) || 0;

        let overParts = overText.split(".");
        over = parseInt(overParts[0]) || 0;
        ball = parseInt(overParts[1]) || 0;

        // 🔥 PLAYER NAME
        const s = document.getElementById("strikerName");
        const ns = document.getElementById("nonStrikerName");

        if(s && ns){
            striker = s.innerText.replace(" *", "");
            nonStriker = ns.innerText;
        }

        // 🔥 STRIKER
        strikerRuns = parseInt(document.getElementById("sRuns").innerText) || 0;
        strikerBalls = parseInt(document.getElementById("sBalls").innerText) || 0;
        striker4 = parseInt(document.getElementById("s4").innerText) || 0;
        striker6 = parseInt(document.getElementById("s6").innerText) || 0;

        // 🔥 NON STRIKER
        nonStrikerRuns = parseInt(document.getElementById("nsRuns").innerText) || 0;
        nonStrikerBalls = parseInt(document.getElementById("nsBalls").innerText) || 0;
        nonStriker4 = parseInt(document.getElementById("ns4").innerText) || 0;
        nonStriker6 = parseInt(document.getElementById("ns6").innerText) || 0;

        // 🔥 BOWLER
        bowlerRuns = parseInt(document.getElementById("bRun").innerText) || 0;
        bowlerWickets = parseInt(document.getElementById("bWicket").innerText) || 0;
        bowlerMaiden = parseInt(document.getElementById("bMaiden").innerText) || 0;

        let bOverText = document.getElementById("bOver").innerText.split(".");
        bowlerBalls = (parseInt(bOverText[0]) * 6) + parseInt(bOverText[1]);

        // 🔥 THIS OVER
        const overDiv = document.getElementById("thisOver");

        if (overDiv) {
            let overData = overDiv.innerText.trim();
            thisOver = overData ? overData.split(",") : [];
        } else {
            thisOver = [];
        }

        // 🔥 EXTRA
        let extraText = document.getElementById("extraData")?.innerText.trim() || "";

        if(extraText){
            let parts = extraText.split(",");

            extraTotal = parseInt(parts[0]) || 0;
            extraLB = parseInt(parts[1]) || 0;
            extraB = parseInt(parts[2]) || 0;
            extraWD = parseInt(parts[3]) || 0;
            extraNB = parseInt(parts[4]) || 0;
        }
        partnerships = [];
        // 🔥 FALL OF WICKETS LOAD

        let fowData =
        document.getElementById("fowData")?.textContent.trim();

        if(fowData && fowData !== "[]"){

            try{
                fallOfWickets = JSON.parse(fowData);
            }catch(e){
                fallOfWickets = [];
            }

        }else{

            fallOfWickets = [];
        }
        // 🔥 PARTNERSHIP LOAD (FINAL FIX)
        let pData = document.getElementById("partnerData")?.textContent.trim();

        if(pData && pData !== "[]"){
            try{
                partnerships = JSON.parse(pData);
            }catch(e){
                console.log("PARTNERSHIP ERROR:", pData);
                partnerships = [];
            }
        }

        // 🔥 ONLY IF COMPLETELY EMPTY (FIRST MATCH START)
        if(partnerships.length === 0){
            partnerships.push({
                striker: striker,
                nonStriker: nonStriker,
                runs: 0,
                balls: 0
            });
        }

        // 🔥 START NEW PARTNERSHIP AFTER WICKET
        let last = partnerships[partnerships.length - 1];

        // 🔥 ONLY যদি batsman change হয় (wicket case)
        if(last){

            let samePair =
                (last.striker === striker && last.nonStriker === nonStriker) ||
                (last.striker === nonStriker && last.nonStriker === striker);

            if(!samePair){
                partnerships.push({
                    striker: striker,
                    nonStriker: nonStriker,
                    runs: 0,
                    balls: 0
                });
            }
        }

        // 🔥 SAVE FOR FOW PAGE
        if(striker){
            localStorage.setItem("strikerName", striker);
        }
        if(nonStriker){
            localStorage.setItem("nonStrikerName", nonStriker);
        }

        updateCRR();
        updateRRR();

        // Coming back here after confirming a wicket that ended the innings or the
        // match (see addRun): show the screen that was postponed for it. This does NOT
        // rely solely on the flag addRun set before leaving -- it also double-checks the
        // freshly loaded score against the real limits, so the innings-break / result
        // screen still appears correctly even if that flag was ever missing or wrong.
        const params = new URLSearchParams(window.location.search);
        const totalOversVal = parseInt(document.getElementById("oversData")?.innerText.trim()) || 0;
        const maxWicketsVal = (parseInt(document.getElementById("playersData")?.innerText.trim()) || 11) - 1;
        const inningsVal = document.getElementById("inningsData")?.innerText.trim();

        if (params.get("inningsBreak")) {
            const target = parseInt(localStorage.getItem("inningsEndTarget")) || (score + 1);
            const overs = parseInt(localStorage.getItem("inningsEndOvers")) || totalOversVal;
            localStorage.removeItem("inningsEndTarget");
            localStorage.removeItem("inningsEndOvers");
            openInningsModal(target, overs);
        } else if (params.get("matchResult")) {
            const text = localStorage.getItem("pendingResultText");
            localStorage.removeItem("pendingResultText");
            if (text) finishMatch(text);
            else checkMatchResult();
        } else if (inningsVal == "1" && (wickets >= maxWicketsVal || (over * 6 + ball) >= totalOversVal * 6)) {
            openInningsModal(score + 1, totalOversVal);
        } else if (inningsVal == "2") {
            checkMatchResult();
        }
    };
    function isMaidenOver(overArr) {

        for (let b of overArr) {

            let text = String(b);

            // normal run > 0
            if (!isNaN(text) && Number(text) > 0) {
                return false;
            }

            // wide / no ball
            if (text.includes("WD") || text.includes("NB")) {
                return false;
            }
        }

        return true;
    }
    
    window.addRun = function (run) {
        // All cricket rules live in scoring-engine.js (tested separately with
        // `node test-engine.js`). This function only reads the current page
        // state, asks the engine what happens, writes the result back into
        // the same globals the rest of the file already uses, then saves.
        const flags = {
            run,
            wide: document.getElementById("wide").checked,
            noball: document.getElementById("noball").checked,
            byes: document.getElementById("byes").checked,
            legbyes: document.getElementById("legbyes").checked,
            wicket: document.getElementById("wicket").checked
        };
        const outPlayer = striker; // the batter facing this ball, before anything changes

        const before = {
            score, wickets, over, ball, striker, nonStriker,
            sRuns: strikerRuns, sBalls: strikerBalls, s4: striker4, s6: striker6,
            nsRuns: nonStrikerRuns, nsBalls: nonStrikerBalls, ns4: nonStriker4, ns6: nonStriker6,
            bRuns: bowlerRuns, bBalls: bowlerBalls, bMaiden: bowlerMaiden, thisOver,
            extras: { total: extraTotal, lb: extraLB, b: extraB, wd: extraWD, nb: extraNB },
            partnerships, fow: fallOfWickets,
            maxWickets: (parseInt(document.getElementById("playersData")?.innerText.trim()) || 11) - 1,
            totalOvers: parseInt(document.getElementById("oversData")?.innerText.trim()) || 0
        };
        const { state: n, out } = KCLEngine.applyBall(before, flags);

        score = n.score; wickets = n.wickets; over = n.over; ball = n.ball;
        striker = n.striker; nonStriker = n.nonStriker;
        strikerRuns = n.sRuns; strikerBalls = n.sBalls; striker4 = n.s4; striker6 = n.s6;
        nonStrikerRuns = n.nsRuns; nonStrikerBalls = n.nsBalls; nonStriker4 = n.ns4; nonStriker6 = n.ns6;
        bowlerRuns = n.bRuns; bowlerBalls = n.bBalls; bowlerMaiden = n.bMaiden; thisOver = n.thisOver;
        extraTotal = n.extras.total; extraLB = n.extras.lb; extraB = n.extras.b; extraWD = n.extras.wd; extraNB = n.extras.nb;
        partnerships = n.partnerships; fallOfWickets = n.fow;
        resetChecks();

        // the fall-of-wicket page reads these from localStorage; keep them fresh at the
        // exact moment a wicket falls, not just on page load, so the dropdown there always
        // defaults to the correct batter even if strike changed earlier in this over
        if (out.wicket) {
            localStorage.setItem("strikerName", outPlayer);
            localStorage.setItem("nonStrikerName", nonStriker === outPlayer ? striker : nonStriker);
        }

        if (!out.wicket && !out.overEnded) { updateUI(); return; }

        const sr = (r, b) => b === 0 ? 0 : ((r / b) * 100).toFixed(2);
        const innings = document.getElementById("inningsData")?.innerText.trim();
        const totalOvers = parseInt(document.getElementById("oversData")?.innerText.trim()) || 0;
        const players = parseInt(document.getElementById("playersData")?.innerText.trim()) || 11;
        const maxWickets = players - 1;
        const totalBallsPlayed = over * 6 + ball;
        const totalBallsMatch = totalOvers * 6;

        const body = {
            score, wickets, over, ball, striker, non_striker: nonStriker,
            s_runs: strikerRuns, s_balls: strikerBalls, s_4: striker4, s_6: striker6,
            ns_runs: nonStrikerRuns, ns_balls: nonStrikerBalls, ns_4: nonStriker4, ns_6: nonStriker6,
            b_runs: bowlerRuns, b_balls: bowlerBalls, b_wickets: bowlerWickets, b_maiden: bowlerMaiden,
            this_over: out.overEnded ? "" : thisOver.join(","),
            finished_over: out.overEnded ? out.finishedOver : "",
            s_sr: sr(strikerRuns, strikerBalls), ns_sr: sr(nonStrikerRuns, nonStrikerBalls),
            b_er: bowlerBalls === 0 ? 0 : (bowlerRuns / (bowlerBalls / 6)).toFixed(2),
            extra: `${extraTotal},${extraLB}LB,${extraB}B,${extraWD}WD,${extraNB}NB`,
            partnerships: partnerships.length > 0 ? JSON.stringify(partnerships) : null
        };
        if (out.wicket) Object.assign(body, {
            out_player: outPlayer,
            out_stats: `${outPlayer}=${strikerRuns},${strikerBalls},${striker4},${striker6},${sr(strikerRuns, strikerBalls)}`,
            over_ended: out.overEnded,
            wicket_type: localStorage.getItem("wicketType") || "pending",
            fall_of_wickets: JSON.stringify(fallOfWickets)
        });

        fetch("/update-score-2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then(() => {
            const inningsEnding = wickets >= maxWickets || totalBallsPlayed >= totalBallsMatch;

            if (out.wicket) {
                // A wicket always has to be confirmed on the Fall-of-wicket page: that is
                // the only place the real out batter (striker or non-striker), the bowler's
                // wicket tally and the dismissal type get finalized. This is true even when
                // the wicket also ends the innings or the match -- we still visit that page
                // (it will skip asking for a new batsman), then come back here afterward to
                // show the innings-break or match-result screen. Skipping the page in that
                // case was exactly why the bowler's wicket count and the batting summary's
                // dismissal text used to go missing for the very last wicket of an innings.
                if (innings == "1" && inningsEnding) {
                    localStorage.setItem("pendingAfterWicket", "inningsBreak");
                    localStorage.setItem("inningsEndTarget", score + 1);
                    localStorage.setItem("inningsEndOvers", totalOvers);
                } else if (innings == "2" && inningsEnding) {
                    localStorage.setItem("pendingAfterWicket", "matchResult");
                    localStorage.setItem("pendingResultText", evalResult(score, wickets, over, ball) || "");
                } else {
                    localStorage.removeItem("pendingAfterWicket");
                }
                localStorage.setItem("overEnded", out.overEnded);
                setTimeout(() => { window.location.href = "/fall-of-wicket-2"; }, 200);
                return;
            }

            if (innings == "2") {
                const ended = checkMatchResultDirect(score, wickets, over, ball);
                if (ended) return;
            }
            if (innings == "1" && inningsEnding) {
                openInningsModal(score + 1, totalOvers);
            } else {
                window.location.href = "/choose-bowler-2";
            }
        });
    };
    function resetChecks() {
        document.getElementById("wide").checked = false;
        document.getElementById("noball").checked = false;
        document.getElementById("byes").checked = false;
        document.getElementById("legbyes").checked = false;
        document.getElementById("wicket").checked = false;
    }
    function swapStrike() {

        // 🔥 name swap
        let temp = striker;
        striker = nonStriker;
        nonStriker = temp;

        // 🔥 stats swap
        let tempRuns = strikerRuns;
        let tempBalls = strikerBalls;
        let temp4 = striker4;
        let temp6 = striker6;

        strikerRuns = nonStrikerRuns;
        strikerBalls = nonStrikerBalls;
        striker4 = nonStriker4;
        striker6 = nonStriker6;

        nonStrikerRuns = tempRuns;
        nonStrikerBalls = tempBalls;
        nonStriker4 = temp4;
        nonStriker6 = temp6;
    }

   function updateUI() {

        // 🔥 score + over
        document.getElementById("score").innerText = score + " - " + wickets;
        document.getElementById("over").innerText = over + "." + ball;

        // 🔥 batsman name
        document.getElementById("strikerName").innerText = striker + " *";
        document.getElementById("nonStrikerName").innerText = nonStriker;

        // 🔥 STRIKER stats
        document.getElementById("sRuns").innerText = strikerRuns;
        document.getElementById("sBalls").innerText = strikerBalls;
        document.getElementById("s4").innerText = striker4;
        document.getElementById("s6").innerText = striker6;

        let sr = strikerBalls === 0 ? 0 : (strikerRuns / strikerBalls) * 100;
        document.getElementById("sSR").innerText = sr.toFixed(2);

        // 🔥 NON-STRIKER stats (🔥 ETAI MISSING CHILO)
        document.getElementById("nsRuns").innerText = nonStrikerRuns;
        document.getElementById("nsBalls").innerText = nonStrikerBalls;
        document.getElementById("ns4").innerText = nonStriker4;
        document.getElementById("ns6").innerText = nonStriker6;

        let nsSR = nonStrikerBalls === 0 ? 0 : (nonStrikerRuns / nonStrikerBalls) * 100;
        document.getElementById("nsSR").innerText = nsSR.toFixed(2);
        // 🔥 bowler over
        let bOver = Math.floor(bowlerBalls / 6);
        let bBall = bowlerBalls % 6;

        document.getElementById("bOver").innerText = bOver + "." + bBall;
        document.getElementById("bMaiden").innerText = bowlerMaiden;
        document.getElementById("bRun").innerText = bowlerRuns;
        document.getElementById("bWicket").innerText = bowlerWickets;
        updateCRR();
        updateRRR();
        updateNeed();
        checkMatchResult();
        // 🔥 economy
        let overs = bowlerBalls / 6;
        let er = overs === 0 ? 0 : (bowlerRuns / overs);

        document.getElementById("bER").innerText = er.toFixed(2);
        
        let overHTML = "";

        thisOver.forEach(item => {

            let text = item.toString();

            let run = text.match(/\d+/)?.[0] || "";
            let extra = text.replace(run, "");

            if(text === "W"){
                overHTML += `<span class="ball red">W</span>`;
            }
            else if(text === "WD" || text === "NB"){
                overHTML += `<span class="ball gray">${text}</span>`;
            }
            else if(text == 4){
                overHTML += `<span class="ball orange">4</span>`;
            }
            else if(text == 6){
                overHTML += `<span class="ball green">6</span>`;
            }
            else{
                // 🔥 MAIN FIX
                overHTML += `
                    <div class="ball-wrap">
                        <span class="ball">${run}</span>
                        ${extra ? `<small class="extra">${extra}</small>` : ""}
                    </div>
                `;
            }

        });

        document.getElementById("thisOver").innerHTML = overHTML;
        let pSend = partnerships.length > 0 ? JSON.stringify(partnerships) : null;
        // 🔥 BACKEND SAVE
       fetch("/update-score-2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: score,
                wickets: wickets,
                over: over,
                ball: ball,

                striker: striker,
                non_striker: nonStriker,

                s_runs: strikerRuns,
                s_balls: strikerBalls,
                s_4: striker4,
                s_6: striker6,

                ns_runs: nonStrikerRuns,
                ns_balls: nonStrikerBalls,
                ns_4: nonStriker4,
                ns_6: nonStriker6,

                b_runs: bowlerRuns,
                b_balls: bowlerBalls,
                b_wickets: bowlerWickets,
                b_maiden: bowlerMaiden,
                // 🔥 MAIN ADD
                this_over: thisOver.join(","),
                // 🔥 NEW
                s_sr: strikerBalls === 0 ? 0 : ((strikerRuns / strikerBalls) * 100).toFixed(2),
                ns_sr: nonStrikerBalls === 0 ? 0 : ((nonStrikerRuns / nonStrikerBalls) * 100).toFixed(2),
                b_er: (bowlerBalls === 0) ? 0 : (bowlerRuns / (bowlerBalls / 6)).toFixed(2),

                extra: `${extraTotal},${extraLB}LB,${extraB}B,${extraWD}WD,${extraNB}NB`,
                partnerships: pSend,
                fall_of_wickets: JSON.stringify(fallOfWickets)
            })
        });
        // 🔥 extra save (batsman + bowler)
        
    }
}
function updateCRR(){

    let scoreText = document.getElementById("score").innerText;
    let overText = document.getElementById("over").innerText;

    // 🔥 score parse
    let score = parseInt(scoreText.split(" - ")[0]) || 0;

    // 🔥 over + ball parse
    let parts = overText.split(".");
    let over = parseInt(parts[0]) || 0;
    let ball = parseInt(parts[1]) || 0;

    let totalOvers = over + (ball / 6);

    let crr = 0;

    if(totalOvers > 0){
        crr = (score / totalOvers).toFixed(2);
    }

    document.getElementById("crr").innerText = crr;
}
function updateRRR(){

    let innings = document.getElementById("inningsData")?.innerText.trim();
    if(innings != "2") return;

    let scoreText = document.getElementById("score").innerText;
    let overText = document.getElementById("over").innerText;

    let score = parseInt(scoreText.split(" - ")[0]) || 0;

    let parts = overText.split(".");
    let over = parseInt(parts[0]) || 0;
    let ball = parseInt(parts[1]) || 0;

    let target = parseInt(document.getElementById("target")?.innerText) || 0;
    let totalOvers = parseInt(document.getElementById("oversData")?.innerText) || 0;

    let ballsPlayed = over * 6 + ball;
    let totalBalls = totalOvers * 6;

    let ballsLeft = totalBalls - ballsPlayed;
    let runsNeeded = target - score;

    let rrr = 0;

    // 🔥 FIXED LOGIC
    if(runsNeeded <= 0){
        rrr = 0;
    }
    else if(ballsLeft <= 0){
        rrr = 0;
    }
    else{
        let oversLeft = ballsLeft / 6;
        rrr = runsNeeded / oversLeft;
    }

    document.getElementById("rrr").innerText = rrr.toFixed(2);
}

function updateNeed(){

    let innings = document.getElementById("inningsData")?.innerText.trim();
    if(innings != "2") return;

    let team = document.querySelector(".live-top span")?.innerText.split(",")[0] || "";

    // 🔥 DOM থেকে data নে
    let scoreText = document.getElementById("score").innerText;
    let overText = document.getElementById("over").innerText;

    let score = parseInt(scoreText.split(" - ")[0]) || 0;

    let parts = overText.split(".");
    let over = parseInt(parts[0]) || 0;
    let ball = parseInt(parts[1]) || 0;

    let target = parseInt(document.getElementById("target")?.innerText) || 0;
    let totalOvers = parseInt(document.getElementById("oversData")?.innerText) || 0;

    let ballsPlayed = over * 6 + ball;
    let totalBalls = totalOvers * 6;

    let ballsLeft = totalBalls - ballsPlayed;
    let runsNeeded = target - score;

    // 🔥 TEXT UPDATE
    document.getElementById("needText").innerText =
        `${team} need ${runsNeeded} runs in ${ballsLeft} balls`;

    
}
let matchEnded = false; //  GLOBAL ( declare)

function evalResult(score, wickets, over, ball) {
    const target = parseInt(document.getElementById("target")?.innerText) || 0;
    const totalOvers = parseInt(document.getElementById("oversData")?.innerText) || 0;
    const players = parseInt(document.getElementById("playersData")?.innerText) || 11;
    const maxWickets = players - 1;
    const battingTeam = document.querySelector(".live-top span")?.innerText.split(",")[0];
    const bowlingTeam = document.getElementById("bowlingTeamData")?.innerText.trim();
    return KCLEngine.result(score, wickets, over, ball, target, maxWickets, totalOvers, battingTeam, bowlingTeam);
}
function finishMatch(text) {
    matchEnded = true;
    return fetch("/save-result-2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: text })
    }).then(() => openResult(text));
}
function checkMatchResult(){
    if (matchEnded) return;
    if (document.getElementById("inningsData")?.innerText.trim() != "2") return;
    const scoreText = document.getElementById("score").innerText;
    const overText = document.getElementById("over").innerText;
    const score = parseInt(scoreText.split(" - ")[0]) || 0;
    const wickets = parseInt(scoreText.split(" - ")[1]) || 0;
    const parts = overText.split(".");
    const over = parseInt(parts[0]) || 0;
    const ball = parseInt(parts[1]) || 0;
    const text = evalResult(score, wickets, over, ball);
    if (text) setTimeout(() => finishMatch(text), 100);
}

function saveBowler(){

    const bowler = document.getElementById("bowlerName").value;

    if(!bowler.trim()){
        alert("Select bowler");
        return;
    }

    const params = new URLSearchParams(window.location.search);

    const newPlayer = params.get("new");   // only for wicket
    const type = params.get("type");

    let url = "/live-match?bowler=" + encodeURIComponent(bowler);

    // 🔥 ONLY if wicket flow
    if(newPlayer && type){
        url += "&new=" + encodeURIComponent(newPlayer);
        url += "&type=" + encodeURIComponent(type);
        url += "&overEnded=true";
    }

    window.location.href = url;
}
function saveBowler2(){

    const bowler =
    document.getElementById("bowlerName").value;

    if(!bowler.trim()){
        alert("Select bowler");
        return;
    }

    const params =
    new URLSearchParams(window.location.search);

    const newPlayer = params.get("new");
    const type = params.get("type");

    let url =
    "/live-match-2?bowler="
    + encodeURIComponent(bowler);

    if(newPlayer && type){

        url += "&new="
        + encodeURIComponent(newPlayer);

        url += "&type="
        + encodeURIComponent(type);

        url += "&overEnded=true";
    }

    window.location.href = url;
}

function openExtra(){
    modalOpen = true;
    // 🔥 set values
    document.getElementById("exTotal").innerText = extraTotal;
    document.getElementById("exLB").innerText = extraLB;
    document.getElementById("exB").innerText = extraB;
    document.getElementById("exWD").innerText = extraWD;
    document.getElementById("exNB").innerText = extraNB;

    document.getElementById("extraModal").classList.add("show");
}

function closeExtra(){
    modalOpen = false;
    document.getElementById("extraModal").classList.remove("show");
}

// 🔥 click outside close (same as manage team)
window.addEventListener("click", function(e){
    const modal = document.getElementById("extraModal");
    if(e.target === modal){
        modal.classList.remove("show");
    }
});

function openUndo(){
    document.getElementById("undoModal").classList.add("show");
}

function closeUndo(){
    document.getElementById("undoModal").classList.remove("show");
}

function confirmUndo(){
    window.location.href = "/undo-2";
}

function renderPartnerships(){

    let container = document.getElementById("partnerList");
    container.innerHTML = "";

    partnerships.forEach(p => {

        let percent = Math.min((p.runs / 100) * 100, 100);

        container.innerHTML += `
        <div style="margin-bottom:15px;">
            
            <div style="display:flex; justify-content:space-between;">
                <span>${p.striker}</span>
                <span><b>${p.runs} (${p.balls})</b></span>
                <span>${p.nonStriker}</span>
            </div>

            <div style="height:6px; background:#333; margin-top:5px; border-radius:5px;">
                <div style="
                    width:${percent}%;
                    height:100%;
                    background:#4da6ff;
                    border-radius:5px;
                "></div>
            </div>

        </div>
        `;
    });
}

function openPartner(){
    modalOpen = true;
    renderPartnerships();
    document.getElementById("partnerModal").classList.add("show");
}

function closePartner(){
    modalOpen = false;
    document.getElementById("partnerModal").classList.remove("show");
}


function openInningsModal(target, overs){

    let rrr = (target / overs).toFixed(2);

    document.getElementById("targetText").innerText =
        `Need ${target} runs in ${overs} overs`;

    document.getElementById("rrrText").innerText =
        `Required Run Rate: ${rrr}`;

    document.getElementById("inningsModal").style.display = "flex";
}

function closeInnings(){
    document.getElementById("inningsModal").style.display = "none";
}

function startSecond(){

    // 🔥 RESET FALL OF WICKETS
    fallOfWickets = [];

    localStorage.setItem(
        "fallOfWickets",
        "[]"
    );

    window.location.href = "/start-second-2";
}

function openResult(text){
    document.getElementById("resultText").innerText = text;
    document.getElementById("resultModal").classList.add("show");
}

function closeResult(){
    document.getElementById("resultModal").classList.remove("show");
}

function goNewMatch(){
    window.location.href = "/all-match-files";
}
function checkMatchResultDirect(score, wickets, over, ball){
    if (matchEnded) return true;
    const text = evalResult(score, wickets, over, ball);
    if (!text) return false;
    finishMatch(text);
    return true;
}

function syncPartnershipFromDOM(){

    let pData = document.getElementById("partnerData")?.textContent.trim();

    if(pData){
        try{
            partnerships = JSON.parse(pData);
        }catch(e){
            partnerships = [];
        }
    }
}