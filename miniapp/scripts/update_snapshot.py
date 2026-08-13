#!/usr/bin/env python3
"""
Kingdom Hermes — snapshot updater.

Regenerates miniapp/data.json with a fresh updatedAt timestamp and pushes
the change to GitHub so the Telegram Mini App always shows a live snapshot.

Usage:
    python3 update_snapshot.py            # refresh timestamp, commit, push
    python3 update_snapshot.py --no-push  # refresh timestamp only

Extend this script as real data sources come online (ledger CSVs, bank
exports, credit reports): read them, fold values into the data dict below,
and the miniapp picks up the new numbers automatically.
"""
import argparse
import datetime
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(HERE, "..", "data.json")
REPO_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))


def utcnow_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-push", action="store_true", help="update file but do not commit/push")
    args = ap.parse_args()

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["updatedAt"] = utcnow_iso()

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"data.json updated -> {data['updatedAt']}")

    if args.no_push:
        return 0

    # Commit + push from repo root
    r = subprocess.run(["git", "diff", "--quiet", "--", "miniapp/data.json"],
                       cwd=REPO_ROOT, capture_output=True)
    if r.returncode == 0:
        print("no changes to push")
        return 0

    subprocess.run(["git", "add", "miniapp/data.json"], cwd=REPO_ROOT, check=True)
    subprocess.run(
        ["git", "commit", "-m", f"chore(miniapp): refresh snapshot {data['updatedAt']}"],
        cwd=REPO_ROOT, check=True,
    )
    subprocess.run(["git", "push", "origin", "HEAD"], cwd=REPO_ROOT, check=True)
    print("pushed to origin")
    return 0


if __name__ == "__main__":
    sys.exit(main())
