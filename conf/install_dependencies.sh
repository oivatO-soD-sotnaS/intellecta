#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"
source "$MAIN_DIR/modules/ask_consent.sh"

BACKEND_MSG="Installing project dependencies!"

echo -e "${YELLOW}************************************************************${ENDCOLOR}"
echo -e "${GREEN}${BACKEND_MSG^^}${ENDCOLOR}"
echo -e "${YELLOW}************************************************************${ENDCOLOR}"

# Backend dependencies
cd "$MAIN_DIR/../backend/api"

if ask_consent "Would you like to install the backend depencies?"; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Frontend dependencies
cd "$MAIN_DIR/../frontend"

if ask_consent "Would you like to install the frontend depencies?"; then
    npm i
fi