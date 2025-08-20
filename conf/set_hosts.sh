#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"
source "$MAIN_DIR/modules/ask_consent.sh"
source "$MAIN_DIR/modules/get_unconfigured_settings.sh"

HOSTS_MSG="Configuring intellecta hosts!"

echo -e "${YELLOW}************************************************************${ENDCOLOR}"
echo -e "${GREEN}${HOSTS_MSG^^}${ENDCOLOR}"
echo -e "${YELLOW}************************************************************${ENDCOLOR}"


HOSTS=("api.intellecta" "files.intellecta")
HOSTS_PATH="/etc/hosts"

function set_hosts {
    local -n to_configure=$1

    for host in "${to_configure[@]}"; do
        echo "127.0.0.1 $host" | sudo tee -a "$HOSTS_PATH" &>/dev/null
    done

    echo -e "${GREEN}Hosts updated successfully!${ENDCOLOR}"
}

if ask_consent "Would you like to configure the needed Intellecta hosts?"; then
    echo -e "${YELLOW}SUDO privileges are required to configure the project hosts${ENDCOLOR}"
    sudo -v
else
    exit 0
fi

if sudo [ -e "$HOSTS_PATH" ]; then
    missing_hosts=()
    get_unconfigured_settings HOSTS "$HOSTS_PATH" "Hosts" missing_hosts
    if [[ "${#missing_hosts[@]}" -eq 0 ]]; then
        echo -e "${GREEN}ALL HOSTS ARE SET."
    elif ask_consent "You have ${missing_hosts[@]} unconfigured hosts. Configure them?"; then
        set_envs missing_hosts "$HOSTS_PATH"
    fi
else
    echo -e "${RED}The /etc/hosts file was not found${ENDCOLOR}"
    exit 1
fi
