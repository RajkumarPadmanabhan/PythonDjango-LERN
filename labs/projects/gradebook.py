"""Turn grades.csv into a per-student report.

Run: py -3 labs/projects/gradebook.py grades.csv report.csv
"""

from __future__ import annotations

import csv
import sys
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path


def read_scores(path):
    groups = {}
    with Path(path).open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for number, row in enumerate(reader, start=2):
            name = (row.get("name") or "").strip()
            raw = (row.get("score") or "").strip()
            if not name or not raw:
                raise ValueError(f"Row {number} needs a name and a score")
            try:
                score = Decimal(raw)
            except InvalidOperation as exc:
                raise ValueError(f"Row {number} is not a number") from exc
            if not Decimal("0") <= score <= Decimal("100"):
                raise ValueError(f"Row {number}: {name} has a score outside 0-100")
            groups.setdefault(name, []).append(score)
    return groups


def average(scores):
    if not scores:
        raise ValueError("No scores")
    mean = sum(scores, Decimal("0")) / Decimal(len(scores))
    return mean.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def write_report(path, groups):
    with Path(path).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["name", "count", "average"])
        for name in sorted(groups):
            scores = groups[name]
            writer.writerow([name, len(scores), average(scores)])


def self_check(tmp):
    source = tmp / "grades.csv"
    target = tmp / "report.csv"
    source.write_text("name,score\nAda,90\nAda,80\nGrace,100\n", encoding="utf-8")
    write_report(target, read_scores(source))
    text = target.read_text(encoding="utf-8")
    assert "Ada,2,85.00" in text
    assert "Grace,1,100.00" in text


def main(argv):
    if len(argv) != 2:
        print("Use: gradebook.py grades.csv report.csv", file=sys.stderr)
        return 1
    write_report(argv[1], read_scores(argv[0]))
    return 0


if __name__ == "__main__":
    from tempfile import TemporaryDirectory

    with TemporaryDirectory() as folder:
        self_check(Path(folder))
    if len(sys.argv) == 1:
        print("Self-check passed. Pass grades.csv and report.csv to write a report.")
    else:
        raise SystemExit(main(sys.argv[1:]))
