/* Scoring engine: one ball in, new state out. No DOM, no network, so it can be
   unit tested in Node and used unchanged in the browser (window.KCLEngine). */
(function (root) {
  function isMaiden(arr) {
    return arr.every(t => {
      t = String(t);
      if (/WD|NB/.test(t)) return false;
      if (/BYE|LB/.test(t)) return true;
      return !(parseInt(t, 10) > 0);          // "3", "2W" count against the bowler
    });
  }

  /* s = state, i = {run, wide, noball, byes, legbyes, wicket}, cfg = optional rules */
  function applyBall(s0, i, cfg) {
    const s = JSON.parse(JSON.stringify(s0));
    const pen = Object.assign({ wd: 1, nb: 1 }, (cfg || {}).penalty);
    const r = Math.max(0, parseInt(i.run, 10) || 0);
    const ex = s.extras, out = { legal: true, overEnded: false, wicket: !!i.wicket };
    if (!s.partnerships.length)
      s.partnerships.push({ striker: s.striker, nonStriker: s.nonStriker, runs: 0, balls: 0 });
    const part = s.partnerships[s.partnerships.length - 1];

    let team = 0, bowler = 0, faced = true, label;
    if (i.wide) {                                    // wide: not a legal ball, batter does not face it
      out.legal = false; faced = false;
      team = pen.wd + r; bowler = team;
      ex.wd += team; ex.total += team;
      label = r ? r + "WD" : "WD";
    } else if (i.noball) {                           // no ball: batter faces it, bat runs are his
      out.legal = false;
      team = pen.nb + r; ex.nb += pen.nb; ex.total += pen.nb;
      bowler = pen.nb;
      if (i.byes) { ex.b += r; ex.total += r; }
      else if (i.legbyes) { ex.lb += r; ex.total += r; }
      else { s.sRuns += r; bowler += r; if (r === 4) s.s4++; if (r === 6) s.s6++; }
      label = r ? r + "NB" : "NB";
    } else if (i.byes || i.legbyes) {                // byes / leg byes: legal, not charged to bowler
      team = r; ex.total += r;
      if (i.byes) ex.b += r; else ex.lb += r;
      label = (i.byes ? "BYE" : "LB"); if (r) label = r + label;
    } else {                                         // normal delivery
      team = r; bowler = r; s.sRuns += r;
      if (r === 4) s.s4++; if (r === 6) s.s6++;
      label = String(r);
    }

    s.score += team; s.bRuns += bowler;
    if (faced) s.sBalls++;
    part.runs += team;
    if (out.legal) { s.ball++; s.bBalls++; part.balls++; }

    if (i.wicket) {
      s.wickets++;
      s.fow.push({ player: s.striker, run: s.score, wicket: s.wickets, over: s.over + "." + s.ball });
      s.thisOver.push(out.legal ? (r ? r + "W" : "W") : label, ...(out.legal ? [] : ["W"]));
    } else {
      s.thisOver.push(label);
      if (r % 2 === 1) swap(s);
    }

    if (out.legal && s.ball >= 6) {                  // over complete
      if (isMaiden(s.thisOver)) s.bMaiden++;
      out.finishedOver = s.thisOver.join(",");
      s.thisOver = []; s.over++; s.ball = 0;
      out.overEnded = true;
      if (!i.wicket) swap(s);                        // wicket case: new batter position is set on the wicket page
    }
    const played = s.over * 6 + s.ball;
    out.inningsOver = s.wickets >= s.maxWickets || played >= s.totalOvers * 6;
    return { state: s, out };
  }

  function swap(s) {
    [s.striker, s.nonStriker] = [s.nonStriker, s.striker];
    [s.sRuns, s.nsRuns] = [s.nsRuns, s.sRuns];
    [s.sBalls, s.nsBalls] = [s.nsBalls, s.sBalls];
    [s.s4, s.ns4] = [s.ns4, s.s4];
    [s.s6, s.ns6] = [s.ns6, s.s6];
  }

  /* 2nd innings result. Returns text or null while the match is still on. */
  function result(score, wickets, over, ball, target, maxWickets, totalOvers, battingTeam, bowlingTeam) {
    if (!target) return null;
    if (score >= target) {
      const w = maxWickets - wickets;
      return battingTeam + " won by " + w + " wicket" + (w === 1 ? "" : "s");
    }
    if (wickets >= maxWickets || over * 6 + ball >= totalOvers * 6) {
      if (score === target - 1) return "Match Draw(Running super over)";
      const d = target - 1 - score;
      return bowlingTeam + " Win by " + d + " run" + (d === 1 ? "" : "s");
    }
    return null;
  }

  const api = { applyBall, result, isMaiden };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KCLEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
