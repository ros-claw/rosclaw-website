import { NextResponse } from "next/server";
import {
  releaseManifest,
  type ReleaseChannel,
} from "@/content/release-manifest";

function buildInstaller(defaultChannel: ReleaseChannel) {
  const stable = releaseManifest.stable;
  const main = releaseManifest.main;

  return `#!/usr/bin/env bash
#
# ROSClaw reproducible installer
# Stable: curl -fsSL https://rosclaw.io/get | bash
# Main:   curl -fsSL https://rosclaw.io/get-main | bash
#

set -Eeuo pipefail

DEFAULT_CHANNEL="${defaultChannel}"
CHANNEL="\${ROSCLAW_CHANNEL:-$DEFAULT_CHANNEL}"
STABLE_VERSION="${stable.version}"
STABLE_COMMIT="${stable.commit}"
MAIN_VERSION="${main.version}"
MAIN_COMMIT="${main.commit}"
INSTALL_ROOT="\${ROSCLAW_INSTALL_ROOT:-$HOME/.local/share/rosclaw}"
BIN_DIR="\${ROSCLAW_BIN_DIR:-$HOME/.local/bin}"
WORKSPACE="\${ROSCLAW_HOME:-$HOME/.rosclaw}"
REPOSITORY="\${ROSCLAW_REPOSITORY:-${releaseManifest.repository}}"
SOURCE_DIR="$INSTALL_ROOT/source"
VENV_DIR="$INSTALL_ROOT/venv"
WRAPPER_PATH="$BIN_DIR/rosclaw"
CREATED_ROOT=0
CREATED_WRAPPER=0
MIN_DISK_MB=2048

info() { printf '[INFO] %s\\n' "$1"; }
fail() { printf '[ERROR] %s\\n' "$1" >&2; exit 1; }

usage() {
    cat <<'USAGE'
Usage: install.sh [--channel stable|main]

  stable  Fixed, evidence-backed Alpha snapshot (default on /get)
  main    Fixed snapshot of Main with the latest Native Agent capabilities
USAGE
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --channel)
            [ "$#" -ge 2 ] || fail "--channel requires stable or main"
            CHANNEL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *) fail "Unknown installer argument: $1" ;;
    esac
done

case "$CHANNEL" in
    stable)
        VERSION="$STABLE_VERSION"
        COMMIT="$STABLE_COMMIT"
        MATURITY="ALPHA"
        ;;
    main)
        VERSION="$MAIN_VERSION"
        COMMIT="$MAIN_COMMIT"
        MATURITY="EXPERIMENTAL"
        ;;
    *) fail "Unknown channel '$CHANNEL'; expected stable or main" ;;
esac

cleanup() {
    status=$?
    if [ "$status" -ne 0 ]; then
        [ "$CREATED_WRAPPER" -eq 1 ] && rm -f "$WRAPPER_PATH"
        [ "$CREATED_ROOT" -eq 1 ] && rm -rf "$INSTALL_ROOT"
    fi
    exit "$status"
}
trap cleanup EXIT

command_exists() { command -v "$1" >/dev/null 2>&1; }

check_python() {
    command_exists python3 || fail "Python 3.11, 3.12, or 3.13 is required."
    python3 - <<'PY'
import platform
import sys

supported = (3, 11) <= sys.version_info[:2] < (3, 14)
print(f"[INFO] Python: {platform.python_version()}")
if not supported:
    raise SystemExit("[ERROR] ROSClaw supports Python 3.11 through 3.13.")
PY
    python3 -m venv --help >/dev/null 2>&1 ||
        fail "The Python venv module is required (for Ubuntu: python3-venv)."
}

show_environment() {
    info "Channel: $CHANNEL"
    info "Pinned commit: $COMMIT"
    info "Operating system: $(uname -s)"
    info "CPU architecture: $(uname -m)"
    check_python
    disk_path="$INSTALL_ROOT"
    while [ ! -e "$disk_path" ]; do
        parent=$(dirname "$disk_path")
        if [ "$parent" = "$disk_path" ]; then disk_path="$HOME"; break; fi
        disk_path="$parent"
    done
    available_kb=$(df -Pk "$disk_path" | awk 'NR == 2 {print $4}')
    available_mb=$((available_kb / 1024))
    info "Available disk: $available_mb MB"
    [ "$available_mb" -ge "$MIN_DISK_MB" ] ||
        fail "At least $MIN_DISK_MB MB of free disk is required."
}

guard_existing_install() {
    if command_exists rosclaw; then
        existing=$(rosclaw --version 2>/dev/null || printf 'unknown version')
        fail "Existing ROSClaw CLI detected ($existing). This installer will not overwrite it."
    fi
    [ ! -e "$INSTALL_ROOT" ] || fail "Install directory already exists: $INSTALL_ROOT"
    if [ -e "$WRAPPER_PATH" ] || [ -L "$WRAPPER_PATH" ]; then
        fail "CLI wrapper path already exists: $WRAPPER_PATH"
    fi
    if [ -e "$WORKSPACE" ]; then
        info "Existing workspace detected and preserved: $WORKSPACE"
    else
        info "Workspace will be created only by: rosclaw firstboot"
    fi
}

checkout_verified_source() {
    command_exists git || fail "git is required."
    mkdir -p "$INSTALL_ROOT" "$BIN_DIR"
    CREATED_ROOT=1

    info "Fetching the pinned ROSClaw source snapshot..."
    git init -q "$SOURCE_DIR"
    git -C "$SOURCE_DIR" remote add origin "$REPOSITORY"
    git -C "$SOURCE_DIR" fetch -q --depth 1 origin "$COMMIT"
    git -C "$SOURCE_DIR" checkout -q --detach FETCH_HEAD
    actual=$(git -C "$SOURCE_DIR" rev-parse HEAD)
    [ "$actual" = "$COMMIT" ] ||
        fail "Source verification failed: expected $COMMIT, received $actual"
    info "Source commit verified: $actual"
}

install_rosclaw() {
    checkout_verified_source
    info "Creating isolated Python environment..."
    python3 -m venv "$VENV_DIR"
    "$VENV_DIR/bin/python" -m pip install --no-cache-dir --upgrade pip
    "$VENV_DIR/bin/python" -m pip install --no-cache-dir "$SOURCE_DIR"

    cat > "$WRAPPER_PATH" <<'WRAPPER'
#!/usr/bin/env bash
export ROSCLAW_HOME="\${ROSCLAW_HOME:-$HOME/.rosclaw}"
exec "__ROSCLAW_EXECUTABLE__" "$@"
WRAPPER
    CREATED_WRAPPER=1
    sed -i "s|__ROSCLAW_EXECUTABLE__|$VENV_DIR/bin/rosclaw|" "$WRAPPER_PATH"
    chmod 0755 "$WRAPPER_PATH"

    installed=$("$WRAPPER_PATH" --version)
    [ "$installed" = "rosclaw $VERSION" ] ||
        fail "Installed CLI version does not match $VERSION: $installed"
}

print_result() {
    printf '\\nROSClaw CLI: installed\\n'
    printf 'Channel: %s\\n' "$CHANNEL"
    printf 'Version: %s\\n' "$VERSION"
    printf 'Commit: %s\\n' "$COMMIT"
    printf 'Runtime maturity: %s\\n' "$MATURITY"
    printf 'Default mode: OFFLINE\\nHardware actions: DISABLED\\n'
    if ! printf '%s' ":$PATH:" | grep -q ":$BIN_DIR:"; then
        printf 'Add to PATH: export PATH="%s:$PATH"\\n' "$BIN_DIR"
    fi
    printf 'Next: %s/rosclaw firstboot\\n' "$BIN_DIR"
}

main() {
    printf 'ROSClaw %s (%s, %s) installer\\n' "$VERSION" "$CHANNEL" "$MATURITY"
    show_environment
    guard_existing_install
    install_rosclaw
    CREATED_ROOT=0
    CREATED_WRAPPER=0
    print_result
}

main
`;
}

function installerResponse(channel: ReleaseChannel) {
  return new NextResponse(buildInstaller(channel), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("channel");
  return installerResponse(requested === "main" ? "main" : "stable");
}
