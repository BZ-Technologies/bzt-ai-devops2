#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${OPENBZ_IMAGE:-${BZDBOT_IMAGE:-openbz:local}}"
LIVE_IMAGE_NAME="${OPENBZ_LIVE_IMAGE:-${BZDBOT_LIVE_IMAGE:-${IMAGE_NAME}-live}}"
CONFIG_DIR="${OPENBZ_CONFIG_DIR:-${BZDBOT_CONFIG_DIR:-$HOME/.openbz}}"
WORKSPACE_DIR="${OPENBZ_WORKSPACE_DIR:-${BZDBOT_WORKSPACE_DIR:-$HOME/.openbz/workspace}}"
PROFILE_FILE="${OPENBZ_PROFILE_FILE:-${BZDBOT_PROFILE_FILE:-$HOME/.profile}}"

PROFILE_MOUNT=()
if [[ -f "$PROFILE_FILE" ]]; then
  PROFILE_MOUNT=(-v "$PROFILE_FILE":/home/node/.profile:ro)
fi

EXTERNAL_AUTH_MOUNTS=()
for auth_dir in .claude .codex .minimax .qwen; do
  host_path="$HOME/$auth_dir"
  if [[ -d "$host_path" ]]; then
    EXTERNAL_AUTH_MOUNTS+=(-v "$host_path":/host-auth/"$auth_dir":ro)
  fi
done

read -r -d '' LIVE_TEST_CMD <<'EOF' || true
set -euo pipefail
[ -f "$HOME/.profile" ] && source "$HOME/.profile" || true
for auth_dir in .claude .codex .minimax .qwen; do
  if [ -d "/host-auth/$auth_dir" ]; then
    mkdir -p "$HOME/$auth_dir"
    cp -R "/host-auth/$auth_dir/." "$HOME/$auth_dir"
    chmod -R u+rwX "$HOME/$auth_dir" || true
  fi
done
tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT
tar -C /src \
  --exclude=.git \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=ui/dist \
  --exclude=ui/node_modules \
  -cf - . | tar -C "$tmp_dir" -xf -
ln -s /app/node_modules "$tmp_dir/node_modules"
ln -s /app/dist "$tmp_dir/dist"
cd "$tmp_dir"
pnpm test:live
EOF

echo "==> Build live-test image: $LIVE_IMAGE_NAME (target=build)"
docker build --target build -t "$LIVE_IMAGE_NAME" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "==> Run gateway live model tests (profile keys)"
docker run --rm -t \
  --entrypoint bash \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e HOME=/home/node \
  -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
  -e OPENBZ_LIVE_TEST=1 \
  -e OPENBZ_LIVE_GATEWAY_MODELS="${OPENBZ_LIVE_GATEWAY_MODELS:-${BZDBOT_LIVE_GATEWAY_MODELS:-modern}}" \
  -e OPENBZ_LIVE_GATEWAY_PROVIDERS="${OPENBZ_LIVE_GATEWAY_PROVIDERS:-${BZDBOT_LIVE_GATEWAY_PROVIDERS:-}}" \
  -e OPENBZ_LIVE_GATEWAY_MAX_MODELS="${OPENBZ_LIVE_GATEWAY_MAX_MODELS:-${BZDBOT_LIVE_GATEWAY_MAX_MODELS:-24}}" \
  -e OPENBZ_LIVE_GATEWAY_MODEL_TIMEOUT_MS="${OPENBZ_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-${BZDBOT_LIVE_GATEWAY_MODEL_TIMEOUT_MS:-}}" \
  -v "$ROOT_DIR":/src:ro \
  -v "$CONFIG_DIR":/home/node/.openbz \
  -v "$WORKSPACE_DIR":/home/node/.openbz/workspace \
  "${EXTERNAL_AUTH_MOUNTS[@]}" \
  "${PROFILE_MOUNT[@]}" \
  "$LIVE_IMAGE_NAME" \
  -lc "$LIVE_TEST_CMD"
