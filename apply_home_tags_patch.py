"""
Home page "Next Match" cards  ->  same Group / Knock Out / Qualifier / Final tags as the Fixture page.

HOW TO RUN (project folder-e, jekhane app.py ache):

    python apply_home_tags_patch.py

What it changes (backup rakhe: app.py.bak_home_tags, templates/index.html.bak_home_tags):
  1. app.py            -> new function enrich_fixture_tags()  (fixture() er tag logic-er hubohu copy)
                          + home() e fixtures.sort(...) er pore ekta line: enrich_fixture_tags(fixtures)
  2. templates/index.html -> Next Match card-er VS-box block-ta Fixture page-er markup diye replace

Safe to run twice (already patched hole kichu kore na). Kono jaygay anchor na mille kichu na likhe bole dey.
"""
import os
import re
import shutil
import sys

APP = "app.py"
INDEX = os.path.join("templates", "index.html")


def read(path):
    raw = open(path, "rb").read()
    crlf = b"\r\n" in raw
    return raw.decode("utf-8").replace("\r\n", "\n"), crlf


def write(path, text, crlf):
    if crlf:
        text = text.replace("\n", "\r\n")
    with open(path, "wb") as f:
        f.write(text.encode("utf-8"))


def backup(path):
    bak = path + ".bak_home_tags"
    if not os.path.exists(bak):
        shutil.copy2(path, bak)


HELPER = '''def enrich_fixture_tags(fixtures):
    """Fixture page-er moto Group / Knock Out / Qualifier / label field-gulo toiri kore,
    jate Home page-er "Next Match" card-o hubohu Fixture page-er moto tag dekhay.
    (fixture() route-er ekdom same logic.)"""

    team_group = {_norm_team(e["name"]): e["group"] for e in _read_group_entries()}

    for m in fixtures:
        g1 = team_group.get(_norm_team(m["team1"]))
        g2 = team_group.get(_norm_team(m["team2"]))
        auto_group = ("Group " + g1.upper()) if g1 and g1 == g2 else "Group"

        # label: "Group A - Qualifier" -> Group A tag + Qualifier tag; "Semi Final 1" -> label
        lp = _fx_label_parts(m.get("label", ""))
        explicit = ("Group " + lp["group"].upper()) if lp["group"] else ""

        m["label_show"] = lp["text"]
        m["is_qualifier"] = lp["qualifier"]

        m["is_round"] = "final" in (lp["text"] or "").lower()
        m["is_knockout"] = bool(
            lp["knockout"]
            or (m["stage"] == "knockout" and not lp["text"])   # purano line: label chhara knockout
        )

        if m["stage"] == "group":
            # Group select na kore sudhu Qualifier dile Group tag dekhabo na
            m["group_tag"] = explicit or ("" if lp["qualifier"] else auto_group)
        else:
            m["group_tag"] = explicit
        m["group_name"] = m["group_tag"]

    return fixtures


'''

NEW_VS_BOX = '''<div class="vs-box">

    <div class="vs">VS</div>

    {% if match.stage == "final" or (match.label_show and match.label_show|lower == "grand final") %}

    <div class="stage-tag stage-green"
        style="background:linear-gradient(135deg,#6a3ec2,#a4308a) !important; color:#fff !important; font-weight:600; border:1.5px solid #ffffff00; box-shadow:0 1px 5px rgba(0,0,0,.5);">
        FINAL 🏆</div>

    {% if match.group_tag %}
    <div class="stage-tag group" style="margin-top:3px;">{{ match.group_tag }}</div>
    {% endif %}

    {% if match.label_show and match.label_show|lower != "grand final" %}
    <div
        style="font-size:18px; color:#f4f6ff; font-weight:600; text-shadow:0 1px 3px rgba(0,0,0,.5); margin-top:4px;">
        {{ match.label_show }}</div>
    {% endif %}

    {% else %}

    {% if match.group_tag %}
    <div class="stage-tag group">{{ match.group_tag }}</div>
    {% endif %}

    {% if match.is_knockout %}
    <div class="stage-tag knockout">Knock Out</div>
    {% endif %}

    {% if match.is_qualifier %}
    <div class="stage-tag qualifier">Qualifier</div>
    {% endif %}

    {% if match.label_show and ("final" in match.label_show|lower) %}
    <div class="stage-tag stage-green"
        style="background:linear-gradient(135deg,#6a3ec2,#a4308a) !important; color:#fff !important; font-weight:600; border:1.5px solid #ffffff00; box-shadow:0 1px 5px rgba(0,0,0,.5);">
        {{ match.label_show }}</div>
    {% elif match.label_show %}
    <div
        style="font-size:22px; color:#f4f6ff; font-weight:600; text-shadow:0 1px 3px rgba(0,0,0,.5); margin-top:4px;">
        {{ match.label_show }}</div>
    {% endif %}

    {% endif %}

</div>'''


def patch_app():
    if not os.path.exists(APP):
        return "SKIP  app.py paoa jayni (project folder-e chalao)"
    text, crlf = read(APP)
    done_helper = "def enrich_fixture_tags(" in text
    done_call = "enrich_fixture_tags(fixtures)" in text
    if done_helper and done_call:
        return "OK    app.py already patched"

    new = text

    if not done_helper:
        m = re.search(r'@app\.route\("/"\)\s*\ndef home\(\):', new)
        if not m:
            return 'FAIL  app.py: @app.route("/") def home(): paoa jayni, kichu bodlayni'
        new = new[:m.start()] + HELPER + new[m.start():]

    if not done_call:
        pat = re.compile(
            r'(?P<sort>[ \t]*fixtures\.sort\(\s*key=parse_match\s*\)[ \t]*\n)'
            r'(?P<dev>[ \t]*device = request\.cookies\.get\("kcl_user"\))'
        )
        hits = pat.findall(new)
        if len(hits) != 1:
            return ("FAIL  app.py: home()-er 'fixtures.sort(key=parse_match)' + 'device = request.cookies.get(\"kcl_user\")' "
                    "ekta jaygay paoa jayni (%d paoa gese), kichu bodlayni" % len(hits))
        new = pat.sub(lambda mm: mm.group("sort") + "    enrich_fixture_tags(fixtures)\n" + mm.group("dev"), new, count=1)

    backup(APP)
    write(APP, new, crlf)
    return "DONE  app.py patched"


def find_block_end(text, start):
    """start = index of '<div class="vs-box">' ; returns index just after its matching </div>."""
    depth = 0
    for t in re.finditer(r"<div\b|</div>", text[start:]):
        depth += 1 if t.group().startswith("<div") else -1
        if depth == 0:
            return start + t.end()
    return None


def patch_index():
    if not os.path.exists(INDEX):
        return "SKIP  templates/index.html paoa jayni"
    text, crlf = read(INDEX)
    if "match.group_tag" in text and "match.is_knockout" in text:
        return "OK    index.html already patched"

    # only the Next Match block (inside #home-next-matches)
    anchor = text.find('id="home-next-matches"')
    if anchor < 0:
        return "FAIL  index.html: id=\"home-next-matches\" paoa jayni, kichu bodlayni"
    start = text.find('<div class="vs-box">', anchor)
    if start < 0:
        return "FAIL  index.html: Next Match-er <div class=\"vs-box\"> paoa jayni, kichu bodlayni"
    end = find_block_end(text, start)
    if end is None:
        return "FAIL  index.html: vs-box block-er shesh paoa jayni, kichu bodlayni"

    line_start = text.rfind("\n", 0, start) + 1
    indent = text[line_start:start]
    if indent.strip():
        indent = ""
    block = NEW_VS_BOX.replace("\n", "\n" + indent)

    new = text[:start] + block + text[end:]
    backup(INDEX)
    write(INDEX, new, crlf)
    return "DONE  templates/index.html patched"


if __name__ == "__main__":
    print(patch_app())
    print(patch_index())
    print("\nEkhon Flask app restart koro, tarpor browser-e Ctrl + Shift + R.")
