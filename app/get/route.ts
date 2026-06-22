import { NextResponse } from "next/server";

const BASH_SCRIPT = `#!/bin/bash
#
# ROSClaw OS Kernel Installer
# curl -sSL https://rosclaw.io/get | bash
#

set -e

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
RESET='\\033[0m'

# Print functions
info() {
    echo "\${CYAN}[INFO]\${RESET} \$1"
}

warn() {
    echo "\${YELLOW}[WARN]\${RESET} \$1"
}

error() {
    echo "\${RED}[ERROR]\${RESET} \$1"
    exit 1
}

success() {
    echo "\${GREEN}[OK]\${RESET} \$1"
}

# Check dependencies
check_dependencies() {
    info "Checking dependencies..."

    # Check for python3
    if ! command -v python3 &> /dev/null; then
        error "python3 is required but not installed. Please install Python 3.8+ first."
    fi
    success "python3 found: \$(python3 --version)"

    # Check for git
    if ! command -v git &> /dev/null; then
        error "git is required but not installed. Please install Git first."
    fi
    success "git found: \$(git --version | head -n1)"

    # Check for pip
    if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
        warn "pip not found. Will attempt to use ensurepip or system package manager."
    else
        success "pip found"
    fi
}

# Create directories
setup_directories() {
    info "Setting up ROSClaw directories..."

    ROSCLAW_HOME="\${HOME}/.rosclaw"
    ROSCLAW_BIN="\${ROSCLAW_HOME}/bin"
    ROSCLAW_LIB="\${ROSCLAW_HOME}/lib"

    mkdir -p "\${ROSCLAW_BIN}" "\${ROSCLAW_LIB}"
    success "Created ~/.rosclaw/ directory structure"
}

# Install rosclaw
install_core() {
    info "Installing rosclaw..."

    # For now, clone from GitHub (will be pip installable in v0.2.0)
    ROSCLAW_URL="https://github.com/ros-claw/rosclaw.git"
    ROSCLAW_DIR="\${HOME}/.rosclaw/lib/rosclaw"

    if [ -d "\${ROSCLAW_DIR}" ]; then
        info "rosclaw already exists. Updating..."
        cd "\${ROSCLAW_DIR}"
        git pull --quiet || warn "Failed to update rosclaw"
    else
        info "Cloning rosclaw repository..."
        git clone --quiet "\${ROSCLAW_URL}" "\${ROSCLAW_DIR}" || \\
            error "Failed to clone rosclaw. Check your internet connection."
    fi

    # Install dependencies
    info "Installing Python dependencies..."
    cd "\${ROSCLAW_DIR}"

    PIP_INSTALL="pip3 install -q -e ."
    if ! pip3 install --dry-run pip &>/dev/null 2>&1; then
        PIP_INSTALL="pip3 install -q -e . --break-system-packages"
        warn "PEP668 externally-managed environment detected; using --break-system-packages"
    fi

    if command -v pip3 &> /dev/null; then
        $PIP_INSTALL 2>/dev/null || warn "pip3 install failed. You may need to install manually."
    elif command -v pip &> /dev/null; then
        pip install -q -e . 2>/dev/null || pip install -q -e . --break-system-packages 2>/dev/null || \\
            warn "pip install failed. You may need to install manually."
    fi

    success "rosclaw installed"
}

# Create wrapper script
create_wrapper() {
    info "Creating rosclaw CLI wrapper..."

    WRAPPER_PATH="\${HOME}/.rosclaw/bin/rosclaw"

    cat > "\${WRAPPER_PATH}" << 'WRAPPER_EOF'
#!/bin/bash
# ROSClaw CLI Wrapper

export ROSCLAW_HOME="\${HOME}/.rosclaw"

# Prefer installed entry point; fallback to python3 -m rosclaw
if command -v rosclaw &> /dev/null; then
    exec rosclaw "$@"
else
    exec python3 -m rosclaw "$@"
fi
WRAPPER_EOF

    chmod +x "\${WRAPPER_PATH}"
    success "Created rosclaw CLI at \${WRAPPER_PATH}"
}

# Configure e-URDF-Zoo and workspace
configure_workspace() {
    info "Configuring workspace..."

    ROSCLAW_DIR="\${HOME}/.rosclaw/lib/rosclaw"
    ZOO_SOURCE="\${ROSCLAW_DIR}/e-urdf-zoo"
    ZOO_TARGET="\${HOME}/.rosclaw/e-urdf-zoo"
    WORKSPACE_DIR="\${HOME}/.rosclaw"

    # Link e-URDF-Zoo
    if [[ -d "$ZOO_SOURCE" ]]; then
        rm -f "$ZOO_TARGET"
        ln -s "$ZOO_SOURCE" "$ZOO_TARGET" 2>/dev/null || cp -r "$ZOO_SOURCE" "$ZOO_TARGET"
        success "e-URDF-Zoo linked at $ZOO_TARGET"
    fi

    # Create default rosclaw.yaml if not exists
    if [[ ! -f "\${WORKSPACE_DIR}/rosclaw.yaml" ]]; then
        cat > "\${WORKSPACE_DIR}/rosclaw.yaml" <<EOF
workspace_dir: \${WORKSPACE_DIR}
eurdf_zoo_path: \${ZOO_TARGET}
runtime:
  default_robot: ur5e
  enable_firewall: true
  enable_sandbox: true
  enable_memory: true
  enable_practice: true
memory:
  backend: seekdb
  data_dir: \${WORKSPACE_DIR}/memory
practice:
  episodes_dir: \${WORKSPACE_DIR}/episodes
  max_episode_history: 1000
logging:
  level: INFO
  dir: \${WORKSPACE_DIR}/logs
EOF
        success "Created \${WORKSPACE_DIR}/rosclaw.yaml"
    fi
}

# Verify installation
verify_install() {
    info "Verifying installation..."

    export PATH="\${HOME}/.rosclaw/bin:\${PATH}"

    # Check rosclaw command
    if ! command -v rosclaw &>/dev/null && ! python3 -m rosclaw --version &>/dev/null; then
        warn "rosclaw command not found. You may need to restart your terminal."
        return
    fi

    # Run doctor
    DOCTOR_OUTPUT=$(rosclaw doctor 2>&1) || true
    echo "$DOCTOR_OUTPUT"

    ISSUE_COUNT=$(echo "$DOCTOR_OUTPUT" | grep -c "❌" || true)
    if [[ "$ISSUE_COUNT" -eq 0 ]]; then
        success "All health checks passed."
    else
        warn "Installed with $ISSUE_COUNT warnings. Run 'rosclaw doctor' for details."
    fi
}

# Add to PATH
add_to_path() {
    info "Checking PATH configuration..."

    SHELL_RC=""
    if [[ "$SHELL" == *"bash"* ]]; then
        SHELL_RC="\${HOME}/.bashrc"
    elif [[ "$SHELL" == *"zsh"* ]]; then
        SHELL_RC="\${HOME}/.zshrc"
    elif [[ "$SHELL" == *"fish"* ]]; then
        SHELL_RC="\${HOME}/.config/fish/config.fish"
    else
        SHELL_RC="\${HOME}/.profile"
    fi

    PATH_LINE='export PATH="\${HOME}/.rosclaw/bin:\${PATH}"'

    if ! grep -q "rosclaw/bin" "\${SHELL_RC}" 2>/dev/null; then
        echo "" >> "\${SHELL_RC}"
        echo "# ROSClaw CLI" >> "\${SHELL_RC}"
        echo "\${PATH_LINE}" >> "\${SHELL_RC}"
        success "Added rosclaw to PATH in \${SHELL_RC}"
        warn "Please run: source \${SHELL_RC}"
    else
        info "rosclaw already in PATH"
    fi
}

# Print banner
print_banner() {
    echo ""
    echo "\${GREEN}═══════════════════════════════════════════════════════\${RESET}"
    echo "\${GREEN}  ✓ ROSClaw v1.0.0 Installed Successfully!\${RESET}"
    echo "\${GREEN}═══════════════════════════════════════════════════════\${RESET}"
    echo ""
    echo "  Quick Start:"
    echo "    \${CYAN}rosclaw --help\${RESET}      Show all commands"
    echo "    \${CYAN}rosclaw doctor\${RESET}      Health diagnosis"
    echo "    \${CYAN}rosclaw init\${RESET}        Initialize workspace"
    echo "    \${CYAN}rosclaw robot list\${RESET}  List robots"
    echo "    \${CYAN}rosclaw run\${RESET}         Start runtime"
    echo ""
    echo "  Documentation: https://docs.rosclaw.io"
    echo "  Community:     https://discord.gg/E6nPCDu6KJ"
    echo ""
    echo "\${CYAN}  Ground Once. Validate Always. Evolve Continuously. 🦞\${RESET}"
    echo ""
}

# Main installation
main() {
    info "Starting ROSClaw v1.0.0 installation..."
    info "This will install ROSClaw to ~/.rosclaw/"
    echo ""

    check_dependencies
    setup_directories
    install_core
    configure_workspace
    create_wrapper
    add_to_path
    verify_install

    print_banner
}

main "$@"
`;

export async function GET() {
  return new NextResponse(BASH_SCRIPT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
