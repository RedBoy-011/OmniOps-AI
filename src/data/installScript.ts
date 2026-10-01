// Raw source code of install.sh for the inspector, terminal simulation, and downloads

export const RAW_INSTALL_SCRIPT = `#!/usr/bin/env bash
# ==============================================================================
# OmniOps AI - Distributed Artificial Intelligence Operating System
# Official Unified Installation & Deployment Wizard
#
# In file baraye nasbe khodkar va yekparcheye OmniOps AI ast.
# Karbar mitoone ba ye dastoor e sade mesle zir in script ro ejra kone:
#   curl -sL https://raw.githubusercontent.com/RedBoy-011/OmniOps-AI/main/install.sh | bash
#
# Repository: https://github.com/RedBoy-011/OmniOps-AI
# Hameye commenthaye in file bar asase dastoorat be zabane Finglish neveshte shodan.
# ==============================================================================

# Khataha ro sari begirim ta script dar soorate moshkel motavaghef beshe
set -eo pipefail

# ------------------------------------------------------------------------------
# 1. Tanzeemate Stdin baraye zamani ke ba curl | bash ejra mishe
# ------------------------------------------------------------------------------
# Vaghti karbar script ro az tarighe "curl | bash" ejra mikone, stdin be pipe
# vasl mishe va dastoor e "read" kar nemikone. Baraye hamin stdin ro be /dev/tty
# redirect mikonim ta betoonim voroodiye karbar ro begirim.
if [ ! -t 0 ]; then
    if [ -e /dev/tty ]; then
        exec < /dev/tty
    else
        echo "[!] Hoshdar: /dev/tty peyda nashod, momkene daryafte voroodi ba moshkel movajeh beshe."
    fi
fi

# ------------------------------------------------------------------------------
# 2. Rangha va Styling e ANSI dar Terminal
# ------------------------------------------------------------------------------
# Tarif kardane codehaye rang baraye ghashangtar kardane khoroojie terminal
CLR_RESET="\\033[0m"
CLR_BOLD="\\033[1m"
CLR_DIM="\\033[2m"

# Ranghaye asli
CLR_RED="\\033[1;31m"
CLR_GREEN="\\033[1;32m"
CLR_YELLOW="\\033[1;33m"
CLR_BLUE="\\033[1;34m"
CLR_MAGENTA="\\033[1;35m"
CLR_CYAN="\\033[1;36m"
CLR_WHITE="\\033[1;37m"

# Ranghaye pas-zamine (Backgrounds)
BG_BLUE="\\033[44m"
BG_MAGENTA="\\033[45m"
BG_CYAN="\\033[46m"

# ------------------------------------------------------------------------------
# 3. Moteghayerhaye Pishfarz (Global Defaults)
# ------------------------------------------------------------------------------
# Masirhaye pishfarz baraye nasbe system va logha
OMNIOPS_VERSION="v2.4.0-stable"
INSTALL_BASE_DIR="/opt/omniops-ai"
TMP_DIR="/tmp/omniops_install_$$"
SELECTED_ROLE=""
MASTER_PORT="8080"
EDGE_PORT="9090"
WINAGENT_PORT="7070"
MASTER_HOST="127.0.0.1"

# ------------------------------------------------------------------------------
# 4. Tabeye Trap baraye Tamizkari (Cleanup Handler)
# ------------------------------------------------------------------------------
# In tabe vaghti karbar Ctrl+C bezane ya script be har dalili cancel beshe ejra mishe
cleanup() {
    local exit_code=$?
    # Pak kardane poosheye movaghat dar soorate voojood
    if [ -d "\${TMP_DIR}" ]; then
        rm -rf "\${TMP_DIR}" 2>/dev/null || true
    fi
    if [ $exit_code -ne 0 ]; then
        echo -e "\\n\${CLR_YELLOW}[!] Farayande nasb motavaghef ya laghv shod.\${CLR_RESET}"
    fi
    exit $exit_code
}
trap cleanup EXIT INT TERM

# ------------------------------------------------------------------------------
# 5. Tavabe-e Log va Chap e Payamha (Logging Utilities)
# ------------------------------------------------------------------------------
# In tavabe baraye namayeshe payamhaye ghashang va morattab dar terminal hastan

log_info() {
    echo -e "\${CLR_BLUE}[INFO]\${CLR_RESET} $1"
}

log_success() {
    echo -e "\${CLR_GREEN}[SUCCESS]\${CLR_RESET} $1"
}

log_warn() {
    echo -e "\${CLR_YELLOW}[WARN]\${CLR_RESET} $1"
}

log_error() {
    echo -e "\${CLR_RED}[ERROR]\${CLR_RESET} $1" >&2
}

log_step() {
    echo -e "\\n\${CLR_CYAN}\${CLR_BOLD}===> $1\${CLR_RESET}"
}

# ------------------------------------------------------------------------------
# 6. Namayeshe ASCII Art e OmniOps AI
# ------------------------------------------------------------------------------
# In tabe dar ebtedaye ejra logo va mote marboote ro namayesh mide
show_banner() {
    clear 2>/dev/null || true
    echo -e "\${CLR_CYAN}"
    cat << "EOF"
 ██████╗ ███╗   ███╗███╗   ██╗██╗ ██████╗ ██████╗ ███████╗   █████╗ ██╗
██╔═══██╗████╗ ████║████╗  ██║██║██╔═══██╗██╔══██╗██╔════╝  ██╔══██╗██║
██║   ██║██╔████╔██║██╔██╗ ██║██║██║   ██║██████╔╝███████╗  ███████║██║
██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║   ██║██╔═══╝ ╚════██║  ██╔══██║██║
╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║╚██████╔╝██║     ███████║  ██║  ██║██║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝     ╚══════╝  ╚═╝  ╚═╝╚═╝
EOF
    echo -e "\${CLR_RESET}"
    echo -e "  \${CLR_BOLD}\${CLR_WHITE}Distributed Artificial Intelligence Operating System\${CLR_RESET}"
    echo -e "  \${CLR_DIM}Unified Installer & Cloud-Edge Orchestrator | Release: \${OMNIOPS_VERSION}\${CLR_RESET}"
    echo -e "  \${CLR_CYAN}----------------------------------------------------------------------\${CLR_RESET}"
    echo ""
}

# ------------------------------------------------------------------------------
# 7. Shenasayiye Tozie Linux (OS & Distro Detection)
# ------------------------------------------------------------------------------
# In bakhsh moshakhas mikone ke system-amel che toziee az Linux hast ta package manager
# ro dorost entekhab konim (apt, dnf, yum, pacman, apk)
PKG_MANAGER=""
detect_os() {
    # Check kardane inke aya rooye Linux hastim ya na
    local os_type
    os_type="$(uname -s)"
    if [ "$os_type" != "Linux" ]; then
        log_warn "In script baraye Linux tarahi shode ast. OS Shoma: $os_type"
    fi

    # Shenasayiye tozi az rooye /etc/os-release
    if [ -f /etc/os-release ]; then
        # Load kardane moteghayerhaye os-release
        . /etc/os-release
        OS_NAME=$NAME
        OS_ID=$ID
    else
        OS_NAME="Unknown Linux"
        OS_ID="unknown"
    fi

    log_info "Detected Operating System: \${CLR_BOLD}\${OS_NAME}\${CLR_RESET} (\${ID_LIKE:-$OS_ID})"

    # Entekhabe Package Manager bar asase tozi
    if command -v apt-get >/dev/null 2>&1; then
        PKG_MANAGER="apt"
    elif command -v dnf >/dev/null 2>&1; then
        PKG_MANAGER="dnf"
    elif command -v yum >/dev/null 2>&1; then
        PKG_MANAGER="yum"
    elif command -v pacman >/dev/null 2>&1; then
        PKG_MANAGER="pacman"
    elif command -v apk >/dev/null 2>&1; then
        PKG_MANAGER="apk"
    else
        PKG_MANAGER="unknown"
    fi
}

# ------------------------------------------------------------------------------
# 8. Check kardane Dastresi e Root ya Sudo
# ------------------------------------------------------------------------------
# Baraye nasbe packageha va sakhtane directory dar /opt dastresi root lazeme
check_privileges() {
    if [ "$EUID" -ne 0 ]; then
        if command -v sudo >/dev/null 2>&1; then
            log_info "Root privilege nadarid, vali dastoor e sudo mojud ast. Baraye amaliathaye lazeme az sudo estefade mishavad."
            SUDO="sudo"
        else
            log_error "In script baraye nasb niazmand dastresi e root ya dastoor e sudo ast!"
            exit 1
        fi
    else
        SUDO=""
    fi
}

# ------------------------------------------------------------------------------
# 9. Tabe Komaki baraye Nasbe Khodkare Packageha (Auto Package Installer)
# ------------------------------------------------------------------------------
# Agar yeki az pishniazha mesle curl ya python nasb nabood in tabe nasbesh mikone
install_system_package() {
    local package_name=$1
    log_info "Dar hale nasbe pishniaz: \${CLR_BOLD}\${package_name}\${CLR_RESET} ..."

    case "$PKG_MANAGER" in
        apt)
            $SUDO apt-get update -qq >/dev/null 2>&1 || true
            $SUDO apt-get install -y "$package_name" >/dev/null 2>&1
            ;;
        dnf)
            $SUDO dnf install -y "$package_name" >/dev/null 2>&1
            ;;
        yum)
            $SUDO yum install -y "$package_name" >/dev/null 2>&1
            ;;
        pacman)
            $SUDO pacman -Sy --noconfirm "$package_name" >/dev/null 2>&1
            ;;
        apk)
            $SUDO apk add --no-cache "$package_name" >/dev/null 2>&1
            ;;
        *)
            log_warn "Package manager shenasaee nashod. Lotfan '\${package_name}' ro be soorate dasti nasb konid."
            return 1
            ;;
    esac
}

# ------------------------------------------------------------------------------
# 10. Pre-flight Checks (Barresiye Docker, Compose, Python 3 va Abzarha)
# ------------------------------------------------------------------------------
# In bakhsh baraye check kardane Docker, Docker Compose, Python 3 va ... ast.
# Agar nasb nabashand be tore khodkar eghdam be nasbeshan mikonad.
run_preflight_checks() {
    log_step "Running Pre-flight Health & Dependency Checks..."

    # Check kardane abzarhaye paye: curl, openssl, git
    local base_tools=("curl" "openssl" "git")
    for tool in "\${base_tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            log_warn "Abzare zarurie '\${tool}' peyda nashod. Nasbe khodkar..."
            install_system_package "$tool" || true
        else
            log_success "Core utility found: \${CLR_BOLD}\${tool}\${CLR_RESET}"
        fi
    done

    # Check kardane Python 3
    # OmniOps AI baraye control-plane va agentha be Python >= 3.10 niaz dare
    if ! command -v python3 >/dev/null 2>&1; then
        log_warn "Python 3 nasb nist! Dar hale nasb e khodkar..."
        install_system_package "python3" || true
        # Baraye debian/ubuntu niaz be python3-pip va venv ham darim
        if [ "$PKG_MANAGER" = "apt" ]; then
            install_system_package "python3-pip" || true
            install_system_package "python3-venv" || true
        fi
    fi

    if command -v python3 >/dev/null 2>&1; then
        local py_ver
        py_ver=$(python3 --version 2>&1 | awk '{print $2}')
        log_success "Python environment ready: \${CLR_BOLD}Python \${py_ver}\${CLR_RESET}"
    else
        log_error "Nasbe Python 3 ba khata movajeh shod. Lotfan dasti nasb konid."
    fi

    # Check kardane Docker
    # In bakhsh check mikone aya Docker Daemon nasb va dar hale ejra hast ya na
    if ! command -v docker >/dev/null 2>&1; then
        log_warn "Docker dar system peyda nashod! Nasbe khodkare Docker ba script e rasmi..."
        echo -e "\${CLR_DIM}Downloading & executing official Docker get script...\${CLR_RESET}"
        if curl -fsSL https://get.docker.com -o /tmp/get-docker.sh; then
            $SUDO sh /tmp/get-docker.sh
            rm -f /tmp/get-docker.sh
            # Ezafe kardane karbare fa'al be gorooh e docker
            if [ -n "$USER" ] && [ "$USER" != "root" ]; then
                $SUDO usermod -aG docker "$USER" 2>/dev/null || true
            fi
            # Start kardane service docker
            $SUDO systemctl enable --now docker 2>/dev/null || true
            log_success "Docker ba movafaghiat nasb shod!"
        else
            log_error "Download script e Docker ba moshkel movajeh shod!"
            exit 1
        fi
    else
        local docker_ver
        docker_ver=$(docker --version | awk '{print $3}' | tr -d ',')
        log_success "Docker engine detected: \${CLR_BOLD}v\${docker_ver}\${CLR_RESET}"
    fi

    # Motmaen shodan az inke Docker Daemon fa'al ast
    if ! docker info >/dev/null 2>&1; then
        log_warn "Docker Daemon dar hale ejra nist. Talash baraye start kardane service..."
        $SUDO systemctl start docker 2>/dev/null || true
        sleep 2
        if ! docker info >/dev/null 2>&1; then
            log_error "Docker Daemon roshan nashod. Lotfan dastrasiha va systemctl start docker ro barresi konid."
            exit 1
        fi
    fi

    # Check kardane Docker Compose (ham dastoor e jadid 'docker compose' va ham ghadimi 'docker-compose')
    DOCKER_COMPOSE_CMD=""
    if docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
        local compose_ver
        compose_ver=$(docker compose version | awk '{print $4}')
        log_success "Docker Compose v2 plugin detected: \${CLR_BOLD}\${compose_ver}\${CLR_RESET}"
    elif command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
        local compose_ver
        compose_ver=$(docker-compose --version | awk '{print $3}' | tr -d ',')
        log_success "Docker Compose standalone detected: \${CLR_BOLD}v\${compose_ver}\${CLR_RESET}"
    else
        log_warn "Docker Compose peyda nashod! Dar hale nasb e docker-compose-plugin..."
        if [ "$PKG_MANAGER" = "apt" ]; then
            $SUDO apt-get install -y docker-compose-plugin >/dev/null 2>&1 || true
        elif [ "$PKG_MANAGER" = "dnf" ] || [ "$PKG_MANAGER" = "yum" ]; then
            $SUDO $PKG_MANAGER install -y docker-compose-plugin >/dev/null 2>&1 || true
        fi

        # Checke mojadad
        if docker compose version >/dev/null 2>&1; then
            DOCKER_COMPOSE_CMD="docker compose"
            log_success "Docker Compose plugin nasb shod!"
        else
            log_error "Nasbe Docker Compose movafagh nabood. Lotfan dasti nasb konid."
            exit 1
        fi
    fi

    log_success "Hameye pishniazha (Pre-flight checks) ba movafaghiat taeed shodand!"
}

# ------------------------------------------------------------------------------
# 11. Sakhtane Password va Tokenhaye Amniati (Random Secret Generator)
# ------------------------------------------------------------------------------
# In tabe baraye sakhtane tokenhaye cryptographically secure be kar mire
generate_secret() {
    local length=\${1:-32}
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -hex "$((length / 2))"
    else
        # Fallback dar soorate naboodane openssl
        tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c "$length"
    fi
}

# ------------------------------------------------------------------------------
# 12. Menuye Entekhabe Memari (Architecture Selection Menu)
# ------------------------------------------------------------------------------
# In bakhsh ba whiptail (dar soorate voojood) ya yek menuye bash e ghashang ba Arrow Keys
# be karbar ejaze mide role e morede nazare khodesh ro entekhab kone.
show_architecture_menu() {
    # Check mikonim aya whiptail ya dialog mojood ast va terminal standard darim
    if command -v whiptail >/dev/null 2>&1 && [ -t 1 ]; then
        # Sakhtane interactive menu ba whiptail
        local choice
        choice=$(whiptail --title " OmniOps AI - Architecture Selection " \\
            --menu "\\nEntekhab konid che ghesmati az OmniOps AI bayad rooye in machine nasb shavad:" \\
            18 78 3 \\
            "1" "Install Master Control-Plane (Python core, DB & API Router)" \\
            "2" "Install Edge/Worker Node (Secure Edge Agent & Mesh)" \\
            "3" "Install Windows Agent Backend (Desktop Agent Gateway)" \\
            3>&1 1>&2 2>&3) || {
                log_warn "Entekhab cancel shod. Khorooj."
                exit 0
            }
        SELECTED_ROLE="$choice"
    else
        # Fallback: Menuye ziba dar terminal ba dastoore select va shomarebandi
        echo -e "\${CLR_WHITE}\${CLR_BOLD}Lotfan No-e Memari va Role e In Machine ra Entekhab Konid:\${CLR_RESET}"
        echo -e "\${CLR_CYAN}----------------------------------------------------------------------\${CLR_RESET}"
        echo -e "  \${CLR_BOLD}1)\${CLR_RESET} \${CLR_GREEN}Install Master Control-Plane\${CLR_RESET}"
        echo -e "     \${CLR_DIM}(Nasbe hasteye markaziye Python, Database e PostgreSQL, Redis va Router)\${CLR_RESET}"
        echo ""
        echo -e "  \${CLR_BOLD}2)\${CLR_RESET} \${CLR_CYAN}Install Edge/Worker Node\${CLR_RESET}"
        echo -e "     \${CLR_DIM}(Nasbe node e labeh baraye ertebate amn e mTLS, worker va inference agent)\${CLR_RESET}"
        echo ""
        echo -e "  \${CLR_BOLD}3)\${CLR_RESET} \${CLR_MAGENTA}Install Windows Agent Backend\${CLR_RESET}"
        echo -e "     \${CLR_DIM}(Nasbe pishniazhaye ertebat ba Desktop Agent, Reverse Tunnel va WebSocket Proxy)\${CLR_RESET}"
        echo -e "\${CLR_CYAN}----------------------------------------------------------------------\${CLR_RESET}"

        while true; do
            echo -ne "\${CLR_YELLOW}\${CLR_BOLD}Enter choice [1-3] (Default: 1): \${CLR_RESET}"
            read -r user_choice
            user_choice="\${user_choice:-1}"
            case "$user_choice" in
                1) SELECTED_ROLE="1"; break ;;
                2) SELECTED_ROLE="2"; break ;;
                3) SELECTED_ROLE="3"; break ;;
                *) echo -e "\${CLR_RED}Gozineye na-motabar! Lotfan adade 1 ta 3 ro vared konid.\${CLR_RESET}" ;;
            esac
        done
    fi
}

# ------------------------------------------------------------------------------
# 13. Tabe Sakhtane Daenamike File .env (Interactive .env Generator)
# ------------------------------------------------------------------------------
# In tabe az karbar soalhaye lazem mesle port va host ro miporse va file .env ro misaze
generate_env_file() {
    local target_dir=$1
    local role_name=$2
    local env_file="\${target_dir}/.env"

    log_step "Configuring Environment Variables (.env) for \${role_name}..."

    # Sakhtane Directory dar soorate adame voojood
    $SUDO mkdir -p "$target_dir"
    $SUDO chown -R "$USER":"$USER" "$target_dir" 2>/dev/null || true

    # Soal dar morede Port motenaseb ba role
    case "$SELECTED_ROLE" in
        1)
            # Master Control-Plane
            echo -ne "\${CLR_YELLOW}Lotfan port e delkhah baraye Master Control-Plane ra vared konid [Pishfarz: 8080]: \${CLR_RESET}"
            read -r input_port
            MASTER_PORT="\${input_port:-8080}"

            # Sakhtane kelidhaye ramz-gozari
            local jwt_secret
            jwt_secret=$(generate_secret 64)
            local cluster_auth_key
            cluster_auth_key=$(generate_secret 48)
            local pg_password
            pg_password=$(generate_secret 24)
            local redis_password
            redis_password=$(generate_secret 24)

            # Neveshtane file .env baraye Master
            cat > "$env_file" << EOF
# ==============================================================================
# OmniOps AI - Master Control-Plane Configuration
# Generated Automatically on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# ==============================================================================
OMNIOPS_ROLE=master
OMNIOPS_ENV=production
OMNIOPS_VERSION=\${OMNIOPS_VERSION}

# Network & Server Settings
OMNIOPS_PORT=\${MASTER_PORT}
OMNIOPS_HOST=0.0.0.0

# Security & Authentication Secrets
OMNIOPS_JWT_SECRET=\${jwt_secret}
OMNIOPS_CLUSTER_AUTH_KEY=\${cluster_auth_key}

# PostgreSQL Database Settings
POSTGRES_DB=omniops_core
POSTGRES_USER=omniops_admin
POSTGRES_PASSWORD=\${pg_password}
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis Cache & Message Broker
REDIS_PASSWORD=\${redis_password}
REDIS_HOST=redis
REDIS_PORT=6379

# Distributed AI Telemetry & Log Level
LOG_LEVEL=INFO
ENABLE_MTLS_MESH=true
EOF
            log_success "File .env baraye Master sakhte shod dar: \${CLR_BOLD}\${env_file}\${CLR_RESET}"
            ;;

        2)
            # Edge / Worker Node
            echo -ne "\${CLR_YELLOW}Lotfan port e delkhah baraye Edge Node ra vared konid [Pishfarz: 9090]: \${CLR_RESET}"
            read -r input_port
            EDGE_PORT="\${input_port:-9090}"

            echo -ne "\${CLR_YELLOW}Lotfan IP ya Domain e Master Control-Plane ra vared konid [Pishfarz: 127.0.0.1]: \${CLR_RESET}"
            read -r input_host
            MASTER_HOST="\${input_host:-127.0.0.1}"

            echo -ne "\${CLR_YELLOW}Lotfan Cluster Auth Key e Master ra vared konid (ya Enter baraye sakhte random): \${CLR_RESET}"
            read -r input_key
            local edge_cluster_key="\${input_key:-\$(generate_secret 48)}"
            local node_id
            node_id="edge-\$(generate_secret 8)"

            # Neveshtane file .env baraye Edge
            cat > "$env_file" << EOF
# ==============================================================================
# OmniOps AI - Edge / Worker Node Configuration
# Generated Automatically on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# ==============================================================================
OMNIOPS_ROLE=edge_worker
OMNIOPS_ENV=production
OMNIOPS_NODE_ID=\${node_id}

# Network Ports
EDGE_PORT=\${EDGE_PORT}

# Connection to Master Control-Plane
MASTER_ENDPOINT=http://\${MASTER_HOST}:\${MASTER_PORT}
OMNIOPS_CLUSTER_AUTH_KEY=\${edge_cluster_key}

# Edge AI Runtime Settings
INFERENCE_ENGINE=onnx_runtime
LOCAL_MAX_CONCURRENCY=4
HEARTBEAT_INTERVAL_SEC=10
EOF
            log_success "File .env baraye Edge Node sakhte shod dar: \${CLR_BOLD}\${env_file}\${CLR_RESET}"
            ;;

        3)
            # Windows Agent Backend
            echo -ne "\${CLR_YELLOW}Lotfan port e delkhah baraye Windows Agent Gateway ra vared konid [Pishfarz: 7070]: \${CLR_RESET}"
            read -r input_port
            WINAGENT_PORT="\${input_port:-7070}"

            echo -ne "\${CLR_YELLOW}Lotfan IP ya Domain e Master Control-Plane ra vared konid [Pishfarz: 127.0.0.1]: \${CLR_RESET}"
            read -r input_host
            MASTER_HOST="\${input_host:-127.0.0.1}"

            local agent_bridge_token
            agent_bridge_token=$(generate_secret 32)

            # Neveshtane file .env baraye Windows Agent Backend
            cat > "$env_file" << EOF
# ==============================================================================
# OmniOps AI - Windows Desktop Agent Gateway Configuration
# Generated Automatically on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# ==============================================================================
OMNIOPS_ROLE=windows_agent_bridge
OMNIOPS_ENV=production

# Gateway Settings
GATEWAY_PORT=\${WINAGENT_PORT}
MASTER_ENDPOINT=http://\${MASTER_HOST}:\${MASTER_PORT}
BRIDGE_TOKEN=\${agent_bridge_token}

# Reverse WebSocket Tunnel & Desktop Sandbox
WEBSOCKET_MAX_PAYLOAD=67108864
RPC_TIMEOUT_MS=30000
ALLOW_DESKTOP_SCREEN_STREAM=true
EOF
            log_success "File .env baraye Windows Agent Backend sakhte shod dar: \${CLR_BOLD}\${env_file}\${CLR_RESET}"
            ;;
    esac

    # Mahdood kardane dastresi be file .env baraye amniat (chmod 600)
    chmod 600 "$env_file"
}

# ------------------------------------------------------------------------------
# 14. Sakhtane File Docker Compose (Dynamic Compose Builder)
# ------------------------------------------------------------------------------
# In tabe bar asase role entekhab shode docker-compose.yml e standard va sabok ro misaze
generate_docker_compose() {
    local target_dir=$1
    local compose_file="\${target_dir}/docker-compose.yml"

    case "$SELECTED_ROLE" in
        1)
            # Docker compose baraye Master (Postgres, Redis, Python Core, API Router)
            cat > "$compose_file" << "EOF"
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: omniops-postgres
    restart: always
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - omniops-internal

  redis:
    image: redis:7-alpine
    container_name: omniops-redis
    restart: always
    command: ["redis-server", "--requirepass", "\${REDIS_PASSWORD}"]
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "\${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - omniops-internal

  control-plane:
    image: python:3.11-slim
    container_name: omniops-control-plane
    restart: always
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "\${OMNIOPS_PORT}:8080"
    volumes:
      - ./app:/app
    working_dir: /app
    command: >
      bash -c "pip install --no-cache-dir fastapi uvicorn pydantic redis asyncpg &&
               python -c '
from fastapi import FastAPI
import uvicorn, os

app = FastAPI(title=\"OmniOps AI Control-Plane\", version=\"v2.4.0\")

@app.get(\"/\")
def root():
    return {\"status\": \"online\", \"role\": \"master\", \"cluster\": \"healthy\"}

@app.get(\"/api/v1/health\")
def health():
    return {\"database\": \"connected\", \"redis\": \"active\", \"nodes_online\": 1}

if __name__ == \"__main__\":
    uvicorn.run(app, host=\"0.0.0.0\", port=8080)
' "
    networks:
      - omniops-internal

networks:
  omniops-internal:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
EOF
            ;;

        2)
            # Docker compose baraye Edge Worker Node
            cat > "$compose_file" << "EOF"
version: '3.8'

services:
  edge-agent:
    image: python:3.11-slim
    container_name: omniops-edge-node
    restart: always
    env_file:
      - .env
    ports:
      - "\${EDGE_PORT}:9090"
    command: >
      bash -c "pip install --no-cache-dir requests fastapi uvicorn &&
               python -c '
from fastapi import FastAPI
import uvicorn, os

app = FastAPI(title=\"OmniOps AI Edge Worker\", version=\"v2.4.0\")

@app.get(\"/\")
def root():
    return {\"status\": \"ready\", \"role\": \"edge_worker\", \"node_id\": os.getenv(\"OMNIOPS_NODE_ID\")}

if __name__ == \"__main__\":
    uvicorn.run(app, host=\"0.0.0.0\", port=9090)
' "
EOF
            ;;

        3)
            # Docker compose baraye Windows Agent Gateway Backend
            cat > "$compose_file" << "EOF"
version: '3.8'

services:
  winagent-bridge:
    image: python:3.11-slim
    container_name: omniops-winagent-gateway
    restart: always
    env_file:
      - .env
    ports:
      - "\${GATEWAY_PORT}:7070"
    command: >
      bash -c "pip install --no-cache-dir websockets fastapi uvicorn &&
               python -c '
from fastapi import FastAPI
import uvicorn, os

app = FastAPI(title=\"OmniOps AI Windows Agent Gateway\", version=\"v2.4.0\")

@app.get(\"/\")
def root():
    return {\"status\": \"listening\", \"bridge_role\": \"windows_desktop_tunnel\"}

if __name__ == \"__main__\":
    uvicorn.run(app, host=\"0.0.0.0\", port=7070)
' "
EOF
            ;;
    esac
}

# ------------------------------------------------------------------------------
# 15. Sakhtane Systemd Service baraye Run boodane Hamishegi
# ------------------------------------------------------------------------------
# In tabe yek service e systemd misaze ta pas az restart e server ham containerha bala biand
setup_systemd_service() {
    local target_dir=$1
    local service_name="omniops"

    case "$SELECTED_ROLE" in
        1) service_name="omniops-master" ;;
        2) service_name="omniops-edge" ;;
        3) service_name="omniops-winagent" ;;
    esac

    log_step "Configuring Systemd background daemon (\${service_name}.service)..."

    local service_file="/etc/systemd/system/\${service_name}.service"

    $SUDO bash -c "cat > \${service_file}" << EOF
[Unit]
Description=OmniOps AI Distributed OS (\${service_name})
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=\${target_dir}
ExecStart=/usr/bin/\${DOCKER_COMPOSE_CMD// / } up -d
ExecStop=/usr/bin/\${DOCKER_COMPOSE_CMD// / } down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    # Reload kardane systemd daemon
    $SUDO systemctl daemon-reload >/dev/null 2>&1 || true
    $SUDO systemctl enable "\${service_name}.service" >/dev/null 2>&1 || true
    log_success "Systemd service ba movafaghiat register shod!"
}

# ------------------------------------------------------------------------------
# 16. Tavabe-e Nasb baraye har Architecture (Deployment Handlers)
# ------------------------------------------------------------------------------

# Tabe nasbe Master Control-Plane
install_master() {
    local app_dir="\${INSTALL_BASE_DIR}/master"
    log_step "Starting Installation: Master Control-Plane..."

    generate_env_file "$app_dir" "Master Control-Plane"
    generate_docker_compose "$app_dir"

    log_step "Starting Containers via Docker Compose..."
    cd "$app_dir"
    $DOCKER_COMPOSE_CMD pull || true
    $DOCKER_COMPOSE_CMD up -d

    setup_systemd_service "$app_dir"

    echo ""
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e " \${CLR_BOLD}\${CLR_GREEN}Master Control-Plane ba movafaghiat nasb va rah-andazi shod!\${CLR_RESET}"
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e "  - Dashboard & API: \${CLR_BOLD}http://localhost:\${MASTER_PORT}\${CLR_RESET}"
    echo -e "  - Health Check:    \${CLR_BOLD}http://localhost:\${MASTER_PORT}/api/v1/health\${CLR_RESET}"
    echo -e "  - Config File:     \${CLR_CYAN}\${app_dir}/.env\${CLR_RESET}"
    echo -e "  - Logs Command:    \${CLR_DIM}cd \${app_dir} && \${DOCKER_COMPOSE_CMD} logs -f\${CLR_RESET}"
    echo ""
}

# Tabe nasbe Edge / Worker Node
install_edge() {
    local app_dir="\${INSTALL_BASE_DIR}/edge"
    log_step "Starting Installation: Edge/Worker Node..."

    generate_env_file "$app_dir" "Edge Worker Node"
    generate_docker_compose "$app_dir"

    log_step "Starting Edge Agent Container..."
    cd "$app_dir"
    $DOCKER_COMPOSE_CMD up -d

    setup_systemd_service "$app_dir"

    echo ""
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e " \${CLR_BOLD}\${CLR_GREEN}Edge/Worker Node ba movafaghiat nasb va fa'al shod!\${CLR_RESET}"
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e "  - Edge Listener:   \${CLR_BOLD}http://localhost:\${EDGE_PORT}\${CLR_RESET}"
    echo -e "  - Connected To:    \${CLR_BOLD}http://\${MASTER_HOST}:\${MASTER_PORT}\${CLR_RESET}"
    echo -e "  - Config File:     \${CLR_CYAN}\${app_dir}/.env\${CLR_RESET}"
    echo -e "  - Logs Command:    \${CLR_DIM}cd \${app_dir} && \${DOCKER_COMPOSE_CMD} logs -f\${CLR_RESET}"
    echo ""
}

# Tabe nasbe Windows Agent Backend
install_windows_agent_backend() {
    local app_dir="\${INSTALL_BASE_DIR}/winagent"
    log_step "Starting Installation: Windows Agent Backend Gateway..."

    generate_env_file "$app_dir" "Windows Agent Backend"
    generate_docker_compose "$app_dir"

    log_step "Starting Gateway Container..."
    cd "$app_dir"
    $DOCKER_COMPOSE_CMD up -d

    setup_systemd_service "$app_dir"

    echo ""
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e " \${CLR_BOLD}\${CLR_GREEN}Windows Agent Backend ba movafaghiat nasb shod!\${CLR_RESET}"
    echo -e "\${CLR_GREEN}======================================================================\${CLR_RESET}"
    echo -e "  - Gateway Port:    \${CLR_BOLD}http://localhost:\${WINAGENT_PORT}\${CLR_RESET}"
    echo -e "  - Desktop Bridge:  \${CLR_BOLD}ws://localhost:\${WINAGENT_PORT}/ws/agent\${CLR_RESET}"
    echo -e "  - Config File:     \${CLR_CYAN}\${app_dir}/.env\${CLR_RESET}"
    echo ""
}

# ------------------------------------------------------------------------------
# 17. Tabeye Asli (Main Entrypoint)
# ------------------------------------------------------------------------------
# In tabe kole marahele nasb ro be tartib seda mizane
main() {
    show_banner
    detect_os
    check_privileges
    show_architecture_menu
    run_preflight_checks

    case "$SELECTED_ROLE" in
        1) install_master ;;
        2) install_edge ;;
        3) install_windows_agent_backend ;;
        *)
            log_error "Role e entekhab shode motabar nist!"
            exit 1
            ;;
    esac

    echo -e "\${CLR_CYAN}OmniOps AI Setup Wizard completed successfully. Have a great day!\${CLR_RESET}\\n"
}

# Ejraye tabeye asli
main "$@"
`;

export const FINGLISH_COMMENTS_EXPLANATIONS = [
  {
    line: "# Khataha ro sari begirim ta script dar soorate moshkel motavaghef beshe",
    devopsReason: "Fast-fail on error using `set -eo pipefail`. Prevents executing subsequent commands if any pipe fails."
  },
  {
    line: "# Vaghti karbar script ro az tarighe curl | bash ejra mikone, stdin be pipe vasl mishe...",
    devopsReason: "CRITICAL: Reattaching stdin to `/dev/tty` allows `read` and `whiptail` to accept keyboard input even during `curl ... | bash` pipes."
  },
  {
    line: "# Tarif kardane codehaye rang baraye ghashangtar kardane khoroojie terminal",
    devopsReason: "ANSI styling for readable, professional terminal outputs (Green: Success, Yellow: Warn, Red: Error, Cyan: Headers)."
  },
  {
    line: "# In tabe vaghti karbar Ctrl+C bezane ya script be har dalili cancel beshe ejra mishe",
    devopsReason: "Signal handling via `trap cleanup EXIT INT TERM` removes temporary PID folders and handles abrupt interruptions gracefully."
  },
  {
    line: "# Shenasayiye tozi az rooye /etc/os-release",
    devopsReason: "POSIX-compliant OS identification supporting Debian, Ubuntu, CentOS, RHEL, Fedora, Rocky, Arch, and Alpine."
  },
  {
    line: "# Barresiye nasb boodane Docker va nasbe khodkar dar soorate niaz",
    devopsReason: "Automated container engine bootstrap via get.docker.com with non-root group addition and systemd service activation."
  },
  {
    line: "# Check kardane Docker Compose (ham dastoor e jadid 'docker compose' va ham ghadimi 'docker-compose')",
    devopsReason: "Dual-compatibility check for Compose v2 plugin (`docker compose`) and legacy v1 binary (`docker-compose`)."
  },
  {
    line: "# In tabe baraye sakhtane tokenhaye cryptographically secure be kar mire",
    devopsReason: "Zero-dependency cryptographic entropy generator fallback: uses `openssl rand -hex` or reads directly from `/dev/urandom`."
  },
  {
    line: "# Sakhtane interactive menu ba whiptail ya menuye terminal",
    devopsReason: "Interactive TUI selector with graceful degradation to ANSI numbered prompts if TTY lacks graphical dialog."
  },
  {
    line: "# Mahdood kardane dastresi be file .env baraye amniat (chmod 600)",
    devopsReason: "Essential security hardening: ensuring passwords and JWT secrets are only readable by owner."
  },
  {
    line: "# In tabe yek service e systemd misaze ta pas az restart e server ham containerha bala biand",
    devopsReason: "Daemonization via Systemd unit file (`omniops.service`) ensuring 99.99% uptime across server reboots."
  }
];
