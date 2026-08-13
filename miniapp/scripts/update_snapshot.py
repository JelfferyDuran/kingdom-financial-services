#!/usr/bin/env python3
"""
Kingdom Hermes — snapshot updater (multi-client).

Refreshes updatedAt on the client manifest + every client data file and
pushes to GitHub so the Telegram Mini App always shows fresh data.

Usage:
    python3 update_snapshot.py            # refresh timestamps, commit, push
    python3 update_snapshot.py --no-push  # refresh timestamps only

Extend this script to pull from real data sources (Supabase exports,
ledger CSVs, credit report analysis outputs) as they come online.
"""
import argparse
import datetime
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
MINIAPP = os.path.abspath(os.path.join(HERE, ".."))
DATA_DIR = os.path.join(MINIAPP, "data")
CLIENTS_DIR = os.path.join(DATA_DIR, "clients")
REPO_ROOT = os.path.abspath(os.path.join(MINIAPP, ".."))

TOUCH_FILES = [
    os.path.join(DATA_DIR, "clients.json"),
]


def utcnow_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-push", action="store_true")
    args = ap.parse_args()

    now = utcnow_iso()
    touched = []

    # Manifest
    mpath = os.path.join(DATA_DIR, "clients.json")
    with open(mpath, "r", encoding="utf-8") as f:
        m = json.load(f)
    m["updatedAt"] = now
    with open(mpath, "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=2)
        f.write("\n")
    touched.append(mpath)

    # Every client file
    for entry in sorted(os.listdir(CLIENTS_DIR)):
        if not entry.endswith(".json"):
            continue
        cpath = os.path.join(CLIENTS_DIR, entry)
        with open(cpath, "r", encoding="utf-8") as f:
            d = json.load(f)
        d["updatedAt"] = now
        with open(cpath, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=2)
            f.write("\n")
        touched.append(cpath)

    print(f"refreshed {len(touched)} files -> {now}")

    if args.no_push:
        return 0

    r = subprocess.run(["git", "diff", "--quiet", "--", "miniapp/data"],
                       cwd=REPO_ROOT, capture_output=True)
    if r.returncode == 0:
        return 0  # silent when nothing changed

    subprocess.run(["git", "add", "miniapp/data"], cwd=REPO_ROOT, check=True)
    subprocess.run(["git", "commit", "-m", f"chore(miniapp): refresh snapshots {now}"],
                   cwd=REPO_ROOT, check=True)
    subprocess.run(["git", "push", "origin", "HEAD"], cwd=REPO_ROOT, check=True)
    print("pushed to origin")
    return 0


if __name__ == "__main__":
    sys.exit(main())
