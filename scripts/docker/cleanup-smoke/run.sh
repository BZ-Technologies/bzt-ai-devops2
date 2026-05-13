#!/usr/bin/env bash
set -euo pipefail

cd /repo

export OPENBZ_STATE_DIR="/tmp/openbz-test"
export OPENBZ_CONFIG_PATH="${OPENBZ_STATE_DIR}/openbz.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${OPENBZ_STATE_DIR}/credentials"
mkdir -p "${OPENBZ_STATE_DIR}/agents/main/sessions"
echo '{}' >"${OPENBZ_CONFIG_PATH}"
echo 'creds' >"${OPENBZ_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${OPENBZ_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm openbz reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${OPENBZ_CONFIG_PATH}"
test ! -d "${OPENBZ_STATE_DIR}/credentials"
test ! -d "${OPENBZ_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${OPENBZ_STATE_DIR}/credentials"
echo '{}' >"${OPENBZ_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm openbz uninstall --state --yes --non-interactive

test ! -d "${OPENBZ_STATE_DIR}"

echo "OK"
