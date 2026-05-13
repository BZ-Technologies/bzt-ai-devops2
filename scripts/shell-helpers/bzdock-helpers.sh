#!/usr/bin/env bash
# BZDock - Docker helpers for OpenBZ
# Inspired by Simon Willison's "Running OpenBZ in Docker"
# https://til.simonwillison.net/llms/openclaw-docker
#
# Installation:
#   mkdir -p ~/.bzdock && curl -sL https://raw.githubusercontent.com/openbz/openbz/main/scripts/shell-helpers/bzdock-helpers.sh -o ~/.bzdock/bzdock-helpers.sh
#   echo 'source ~/.bzdock/bzdock-helpers.sh' >> ~/.zshrc
#
# Usage:
#   bzdock-help    # Show all available commands

# =============================================================================
# Colors
# =============================================================================
_CLR_RESET='\033[0m'
_CLR_BOLD='\033[1m'
_CLR_DIM='\033[2m'
_CLR_GREEN='\033[0;32m'
_CLR_YELLOW='\033[1;33m'
_CLR_BLUE='\033[0;34m'
_CLR_MAGENTA='\033[0;35m'
_CLR_CYAN='\033[0;36m'
_CLR_RED='\033[0;31m'

# Styled command output (green + bold)
_clr_cmd() {
  echo -e "${_CLR_GREEN}${_CLR_BOLD}$1${_CLR_RESET}"
}

# Inline command for use in sentences
_cmd() {
  echo "${_CLR_GREEN}${_CLR_BOLD}$1${_CLR_RESET}"
}

# =============================================================================
# Config
# =============================================================================
BZDOCK_CONFIG="${HOME}/.bzdock/config"

# Common paths to check for OpenBZ
BZDOCK_COMMON_PATHS=(
  "${HOME}/openbz"
  "${HOME}/workspace/openbz"
  "${HOME}/projects/openbz"
  "${HOME}/dev/openbz"
  "${HOME}/code/openbz"
  "${HOME}/src/openbz"
)

_bzdock_filter_warnings() {
  grep -v "^WARN\|^time="
}

_bzdock_trim_quotes() {
  local value="$1"
  value="${value#\"}"
  value="${value%\"}"
  printf "%s" "$value"
}

_bzdock_read_config_dir() {
  if [[ ! -f "$BZDOCK_CONFIG" ]]; then
    return 1
  fi
  local raw
  raw=$(sed -n 's/^BZDOCK_DIR=//p' "$BZDOCK_CONFIG" | head -n 1)
  if [[ -z "$raw" ]]; then
    return 1
  fi
  _bzdock_trim_quotes "$raw"
}

# Ensure BZDOCK_DIR is set and valid
_bzdock_ensure_dir() {
  # Already set and valid?
  if [[ -n "$BZDOCK_DIR" && -f "${BZDOCK_DIR}/docker-compose.yml" ]]; then
    return 0
  fi

  # Try loading from config
  local config_dir
  config_dir=$(_bzdock_read_config_dir)
  if [[ -n "$config_dir" && -f "${config_dir}/docker-compose.yml" ]]; then
    BZDOCK_DIR="$config_dir"
    return 0
  fi

  # Auto-detect from common paths
  local found_path=""
  for path in "${BZDOCK_COMMON_PATHS[@]}"; do
    if [[ -f "${path}/docker-compose.yml" ]]; then
      found_path="$path"
      break
    fi
  done

  if [[ -n "$found_path" ]]; then
    echo ""
    echo "🦞 Found OpenBZ at: $found_path"
    echo -n "   Use this location? [Y/n] "
    read -r response
    if [[ "$response" =~ ^[Nn] ]]; then
      echo ""
      echo "Set BZDOCK_DIR manually:"
      echo "  export BZDOCK_DIR=/path/to/openbz"
      return 1
    fi
    BZDOCK_DIR="$found_path"
  else
    echo ""
    echo "❌ OpenBZ not found in common locations."
    echo ""
    echo "Clone it first:"
    echo ""
    echo "  git clone https://github.com/openbz/openbz.git ~/openbz"
    echo "  cd ~/openbz && ./docker-setup.sh"
    echo ""
    echo "Or set BZDOCK_DIR if it's elsewhere:"
    echo ""
    echo "  export BZDOCK_DIR=/path/to/openbz"
    echo ""
    return 1
  fi

  # Save to config
  if [[ ! -d "${HOME}/.bzdock" ]]; then
    /bin/mkdir -p "${HOME}/.bzdock"
  fi
  echo "BZDOCK_DIR=\"$BZDOCK_DIR\"" > "$BZDOCK_CONFIG"
  echo "✅ Saved to $BZDOCK_CONFIG"
  echo ""
  return 0
}

# Wrapper to run docker compose commands
_bzdock_compose() {
  _bzdock_ensure_dir || return 1
  local compose_args=(-f "${BZDOCK_DIR}/docker-compose.yml")
  if [[ -f "${BZDOCK_DIR}/docker-compose.extra.yml" ]]; then
    compose_args+=(-f "${BZDOCK_DIR}/docker-compose.extra.yml")
  fi
  command docker compose "${compose_args[@]}" "$@"
}

_bzdock_read_env_token() {
  _bzdock_ensure_dir || return 1
  if [[ ! -f "${BZDOCK_DIR}/.env" ]]; then
    return 1
  fi
  local raw
  raw=$(sed -n 's/^OPENBZ_GATEWAY_TOKEN=//p' "${BZDOCK_DIR}/.env" | head -n 1)
  if [[ -z "$raw" ]]; then
    return 1
  fi
  _bzdock_trim_quotes "$raw"
}

# Basic Operations
bzdock-start() {
  _bzdock_compose up -d openbz-gateway
}

bzdock-stop() {
  _bzdock_compose down
}

bzdock-restart() {
  _bzdock_compose restart openbz-gateway
}

bzdock-logs() {
  _bzdock_compose logs -f openbz-gateway
}

bzdock-status() {
  _bzdock_compose ps
}

# Navigation
bzdock-cd() {
  _bzdock_ensure_dir || return 1
  cd "${BZDOCK_DIR}"
}

bzdock-config() {
  cd ~/.openbz
}

bzdock-workspace() {
  cd ~/.openbz/workspace
}

# Container Access
bzdock-shell() {
  _bzdock_compose exec openbz-gateway \
    bash -c 'echo "alias openbz=\"./openbz.mjs\"" > /tmp/.bashrc_openbz && bash --rcfile /tmp/.bashrc_openbz'
}

bzdock-exec() {
  _bzdock_compose exec openbz-gateway "$@"
}

bzdock-cli() {
  _bzdock_compose run --rm openbz-cli "$@"
}

# Maintenance
bzdock-rebuild() {
  _bzdock_compose build openbz-gateway
}

bzdock-clean() {
  _bzdock_compose down -v --remove-orphans
}

# Health check
bzdock-health() {
  _bzdock_ensure_dir || return 1
  local token
  token=$(_bzdock_read_env_token)
  if [[ -z "$token" ]]; then
    echo "❌ Error: Could not find gateway token"
    echo "   Check: ${BZDOCK_DIR}/.env"
    return 1
  fi
  _bzdock_compose exec -e "OPENBZ_GATEWAY_TOKEN=$token" openbz-gateway \
    node dist/index.js health
}

# Show gateway token
bzdock-token() {
  _bzdock_read_env_token
}

# Fix token configuration (run this once after setup)
bzdock-fix-token() {
  _bzdock_ensure_dir || return 1

  echo "🔧 Configuring gateway token..."
  local token
  token=$(bzdock-token)
  if [[ -z "$token" ]]; then
    echo "❌ Error: Could not find gateway token"
    echo "   Check: ${BZDOCK_DIR}/.env"
    return 1
  fi

  echo "📝 Setting token: ${token:0:20}..."

  _bzdock_compose exec -e "TOKEN=$token" openbz-gateway \
    bash -c './openbz.mjs config set gateway.remote.token "$TOKEN" && ./openbz.mjs config set gateway.auth.token "$TOKEN"' 2>&1 | _bzdock_filter_warnings

  echo "🔍 Verifying token was saved..."
  local saved_token
  saved_token=$(_bzdock_compose exec openbz-gateway \
    bash -c "./openbz.mjs config get gateway.remote.token 2>/dev/null" 2>&1 | _bzdock_filter_warnings | tr -d '\r\n' | head -c 64)

  if [[ "$saved_token" == "$token" ]]; then
    echo "✅ Token saved correctly!"
  else
    echo "⚠️  Token mismatch detected"
    echo "   Expected: ${token:0:20}..."
    echo "   Got: ${saved_token:0:20}..."
  fi

  echo "🔄 Restarting gateway..."
  _bzdock_compose restart openbz-gateway 2>&1 | _bzdock_filter_warnings

  echo "⏳ Waiting for gateway to start..."
  sleep 5

  echo "✅ Configuration complete!"
  echo -e "   Try: $(_cmd bzdock-devices)"
}

# Open dashboard in browser
bzdock-dashboard() {
  _bzdock_ensure_dir || return 1

  echo "🦞 Getting dashboard URL..."
  local output exit_status url
  output=$(_bzdock_compose run --rm openbz-cli dashboard --no-open 2>&1)
  exit_status=$?
  url=$(printf "%s\n" "$output" | _bzdock_filter_warnings | grep -o 'http[s]\?://[^[:space:]]*' | head -n 1)
  if [[ $exit_status -ne 0 ]]; then
    echo "❌ Failed to get dashboard URL"
    echo -e "   Try restarting: $(_cmd bzdock-restart)"
    return 1
  fi

  if [[ -n "$url" ]]; then
    echo "✅ Opening: $url"
    open "$url" 2>/dev/null || xdg-open "$url" 2>/dev/null || echo "   Please open manually: $url"
    echo ""
    echo -e "${_CLR_CYAN}💡 If you see 'pairing required' error:${_CLR_RESET}"
    echo -e "   1. Run: $(_cmd bzdock-devices)"
    echo "   2. Copy the Request ID from the Pending table"
    echo -e "   3. Run: $(_cmd 'bzdock-approve <request-id>')"
  else
    echo "❌ Failed to get dashboard URL"
    echo -e "   Try restarting: $(_cmd bzdock-restart)"
  fi
}

# List device pairings
bzdock-devices() {
  _bzdock_ensure_dir || return 1

  echo "🔍 Checking device pairings..."
  local output exit_status
  output=$(_bzdock_compose exec openbz-gateway node dist/index.js devices list 2>&1)
  exit_status=$?
  printf "%s\n" "$output" | _bzdock_filter_warnings
  if [ $exit_status -ne 0 ]; then
    echo ""
    echo -e "${_CLR_CYAN}💡 If you see token errors above:${_CLR_RESET}"
    echo -e "   1. Verify token is set: $(_cmd bzdock-token)"
    echo "   2. Try manual config inside container:"
    echo -e "      $(_cmd bzdock-shell)"
    echo -e "      $(_cmd 'openbz config get gateway.remote.token')"
    return 1
  fi

  echo ""
  echo -e "${_CLR_CYAN}💡 To approve a pairing request:${_CLR_RESET}"
  echo -e "   $(_cmd 'bzdock-approve <request-id>')"
}

# Approve device pairing request
bzdock-approve() {
  _bzdock_ensure_dir || return 1

  if [[ -z "$1" ]]; then
    echo -e "❌ Usage: $(_cmd 'bzdock-approve <request-id>')"
    echo ""
    echo -e "${_CLR_CYAN}💡 How to approve a device:${_CLR_RESET}"
    echo -e "   1. Run: $(_cmd bzdock-devices)"
    echo "   2. Find the Request ID in the Pending table (long UUID)"
    echo -e "   3. Run: $(_cmd 'bzdock-approve <that-request-id>')"
    echo ""
    echo "Example:"
    echo -e "   $(_cmd 'bzdock-approve 6f9db1bd-a1cc-4d3f-b643-2c195262464e')"
    return 1
  fi

  echo "✅ Approving device: $1"
  _bzdock_compose exec openbz-gateway \
    node dist/index.js devices approve "$1" 2>&1 | _bzdock_filter_warnings

  echo ""
  echo "✅ Device approved! Refresh your browser."
}

# Show all available bzdock helper commands
bzdock-help() {
  echo -e "\n${_CLR_BOLD}${_CLR_CYAN}🦞 ClawDock - Docker Helpers for OpenBZ${_CLR_RESET}\n"

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}⚡ Basic Operations${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-start)       ${_CLR_DIM}Start the gateway${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-stop)        ${_CLR_DIM}Stop the gateway${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-restart)     ${_CLR_DIM}Restart the gateway${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-status)      ${_CLR_DIM}Check container status${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-logs)        ${_CLR_DIM}View live logs (follows)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🐚 Container Access${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-shell)       ${_CLR_DIM}Shell into container (openbz alias ready)${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-cli)         ${_CLR_DIM}Run CLI commands (e.g., bzdock-cli status)${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-exec) ${_CLR_CYAN}<cmd>${_CLR_RESET}  ${_CLR_DIM}Execute command in gateway container${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🌐 Web UI & Devices${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-dashboard)   ${_CLR_DIM}Open web UI in browser ${_CLR_CYAN}(auto-guides you)${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-devices)     ${_CLR_DIM}List device pairings ${_CLR_CYAN}(auto-guides you)${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-approve) ${_CLR_CYAN}<id>${_CLR_RESET} ${_CLR_DIM}Approve device pairing ${_CLR_CYAN}(with examples)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}⚙️  Setup & Configuration${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-fix-token)   ${_CLR_DIM}Configure gateway token ${_CLR_CYAN}(run once)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🔧 Maintenance${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-rebuild)     ${_CLR_DIM}Rebuild Docker image${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-clean)       ${_CLR_RED}⚠️  Remove containers & volumes (nuclear)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🛠️  Utilities${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-health)      ${_CLR_DIM}Run health check${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-token)       ${_CLR_DIM}Show gateway auth token${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-cd)          ${_CLR_DIM}Jump to openbz project directory${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-config)      ${_CLR_DIM}Open config directory (~/.openbz)${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-workspace)   ${_CLR_DIM}Open workspace directory${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${_CLR_RESET}"
  echo -e "${_CLR_BOLD}${_CLR_GREEN}🚀 First Time Setup${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  1.${_CLR_RESET} $(_cmd bzdock-start)          ${_CLR_DIM}# Start the gateway${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  2.${_CLR_RESET} $(_cmd bzdock-fix-token)      ${_CLR_DIM}# Configure token${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  3.${_CLR_RESET} $(_cmd bzdock-dashboard)      ${_CLR_DIM}# Open web UI${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  4.${_CLR_RESET} $(_cmd bzdock-devices)        ${_CLR_DIM}# If pairing needed${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  5.${_CLR_RESET} $(_cmd bzdock-approve) ${_CLR_CYAN}<id>${_CLR_RESET}   ${_CLR_DIM}# Approve pairing${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_GREEN}💬 WhatsApp Setup${_CLR_RESET}"
  echo -e "  $(_cmd bzdock-shell)"
  echo -e "    ${_CLR_BLUE}>${_CLR_RESET} $(_cmd 'openbz channels login --channel whatsapp')"
  echo -e "    ${_CLR_BLUE}>${_CLR_RESET} $(_cmd 'openbz status')"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_CYAN}💡 All commands guide you through next steps!${_CLR_RESET}"
  echo -e "${_CLR_BLUE}📚 Docs: ${_CLR_RESET}${_CLR_CYAN}https://docs.openbz.ai${_CLR_RESET}"
  echo ""
}
