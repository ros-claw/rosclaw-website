import { NextResponse } from "next/server";
import { release } from "@/content/product-status";

const BASH_SCRIPT = `#!/usr/bin/env bash
#
# ROSClaw isolated installer
# curl -sSL https://rosclaw.io/get | bash
#

set -Eeuo pipefail

VERSION="${release.version}"
MATURITY="${release.maturity.toUpperCase()}"
INSTALL_ROOT="\${ROSCLAW_INSTALL_ROOT:-$HOME/.local/share/rosclaw}"
BIN_DIR="\${ROSCLAW_BIN_DIR:-$HOME/.local/bin}"
WORKSPACE="\${ROSCLAW_HOME:-$HOME/.rosclaw}"
REPOSITORY="\${ROSCLAW_REPOSITORY:-https://github.com/ros-claw/rosclaw.git}"
SOURCE_DIR="$INSTALL_ROOT/source"
VENV_DIR="$INSTALL_ROOT/venv"
WRAPPER_PATH="$BIN_DIR/rosclaw"
CREATED_ROOT=0
CREATED_WRAPPER=0
MIN_DISK_MB=2048

info() {
    printf '[INFO] %s\\n' "$1"
}

fail() {
    printf '[ERROR] %s\\n' "$1" >&2
    exit 1
}

cleanup() {
    status=$?
    if [ "$status" -ne 0 ]; then
        if [ "$CREATED_WRAPPER" -eq 1 ]; then
            rm -f "$WRAPPER_PATH"
        fi
        if [ "$CREATED_ROOT" -eq 1 ]; then
            rm -rf "$INSTALL_ROOT"
        fi
    fi
    exit "$status"
}
trap cleanup EXIT

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

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
    info "Operating system: $(uname -s)"
    info "CPU architecture: $(uname -m)"
    check_python
    disk_path="$INSTALL_ROOT"
    while [ ! -e "$disk_path" ]; do
        parent=$(dirname "$disk_path")
        if [ "$parent" = "$disk_path" ]; then
            disk_path="$HOME"
            break
        fi
        disk_path="$parent"
    done
    available_kb=$(df -Pk "$disk_path" | awk 'NR == 2 {print $4}')
    available_mb=$((available_kb / 1024))
    info "Available disk: $available_mb MB"
    if [ "$available_mb" -lt "$MIN_DISK_MB" ]; then
        fail "At least $MIN_DISK_MB MB of free disk is required for the isolated install."
    fi
    if command_exists docker; then
        info "Docker: available"
    else
        info "Docker: not found (optional)"
    fi
    if command_exists ros2; then
        info "ROS 2: available"
    else
        info "ROS 2: not found (optional)"
    fi
    if command_exists nvidia-smi; then
        info "GPU: NVIDIA runtime detected"
    else
        info "GPU: not detected (optional)"
    fi
}

guard_existing_install() {
    if command_exists rosclaw; then
        existing=$(rosclaw --version 2>/dev/null || printf 'unknown version')
        fail "Existing ROSClaw CLI detected ($existing). This installer will not overwrite it."
    fi
    if [ -e "$INSTALL_ROOT" ]; then
        fail "Install directory already exists: $INSTALL_ROOT"
    fi
    if [ -e "$WRAPPER_PATH" ] || [ -L "$WRAPPER_PATH" ]; then
        fail "CLI wrapper path already exists and will not be overwritten: $WRAPPER_PATH"
    fi
    if [ -e "$WORKSPACE" ]; then
        info "Existing workspace detected and preserved: $WORKSPACE"
    else
        info "Workspace will be created only by: rosclaw firstboot"
    fi
}

install_rosclaw() {
    command_exists git || fail "git is required."
    mkdir -p "$INSTALL_ROOT" "$BIN_DIR"
    CREATED_ROOT=1

    info "Cloning ROSClaw source..."
    git clone --depth 1 --branch main "$REPOSITORY" "$SOURCE_DIR"

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
        fail "Installed CLI version does not match expected release $VERSION: $installed"
}

print_result() {
    printf '\\n'
    printf 'ROSClaw CLI: installed\\n'
    printf 'Version: %s\\n' "$VERSION"
    printf 'Runtime maturity: %s\\n' "$MATURITY"
    printf 'Default mode: OFFLINE\\n'
    printf 'Hardware actions: DISABLED\\n'
    printf 'Workspace: preserved until firstboot\\n'
    if ! printf '%s' ":$PATH:" | grep -q ":$BIN_DIR:"; then
        printf 'Add to PATH: export PATH="%s:$PATH"\\n' "$BIN_DIR"
    fi
    printf 'Next: %s/rosclaw firstboot\\n' "$BIN_DIR"
}

main() {
    printf 'ROSClaw %s (%s) installer\\n' "$VERSION" "$MATURITY"
    show_environment
    guard_existing_install
    install_rosclaw
    CREATED_ROOT=0
    CREATED_WRAPPER=0
    print_result
}

main "$@"
`;

export async function GET() {
  return new NextResponse(BASH_SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
