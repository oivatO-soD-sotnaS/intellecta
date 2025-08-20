#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"
source "$MAIN_DIR/modules/ask_consent.sh"

# Make needed files executable
chmod +x "$MAIN_DIR/modules/banner.sh"
chmod +x "$MAIN_DIR/set_envs.sh"
chmod +x "$MAIN_DIR/set_hosts.sh"
chmod +x "$MAIN_DIR/set_hosts.sh"
chmod +x "$MAIN_DIR/install_dependencies.sh"

# Display banner
$MAIN_DIR/modules/banner.sh
# Set hosts
$MAIN_DIR/set_hosts.sh
# Set environment variables
$MAIN_DIR/set_envs.sh
# Install project dependencies
$MAIN_DIR/install_dependencies.sh

CONGRATULATION_MSG="Congrats on completing the Intellecta project configuration!"

echo -e "${YELLOW}************************************************************${ENDCOLOR}"
echo -e "${GREEN}${CONGRATULATION_MSG^^}${ENDCOLOR}"
echo -e "${YELLOW}************************************************************${ENDCOLOR}"

if ask_consent "Start containers?"; then
  cd "$MAIN_DIR/../"
  sudo docker compose up --build  
fi