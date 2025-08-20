#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"
source "$MAIN_DIR/modules/ask_consent.sh"
source "$MAIN_DIR/modules/get_unconfigured_settings.sh"

BACKEND_MSG="Configuring backend environment variables!"

echo -e "${YELLOW}************************************************************${ENDCOLOR}"
echo -e "${GREEN}${BACKEND_MSG^^}${ENDCOLOR}"
echo -e "${YELLOW}************************************************************${ENDCOLOR}"

# Backend
BACKEND_ENV_STRINGS=("EMAIL_USERNAME" "EMAIL_PASSWORD" "EMAIL_SENDER" "JWT_SECRET_KEY" "JWT_ALGORITHM" "JWT_EXPIRATION_TIME")
BACKEND_ENV_PATH="$MAIN_DIR/../backend/.env"

# MySql
DB_ENV_STRINGS=("MYSQL_ROOT_PASSWORD" "MYSQL_DATABASE" "MYSQL_USER" "MYSQL_PASSWORD")
DB_ENV_PATH="$MAIN_DIR/../database/.env"

function set_envs {
    local -n to_configure=$1
    local path=$2

    for env in "${to_configure[@]}"; do
        echo -ne "${env^^}="
        read -r ans
        if grep -q "^${env^^}=" "$path" 2>/dev/null; then
            sed -i "s/^${env^^}=.*/${env^^}=$ans/" "$path" 2>/dev/null
        else
            echo "${env^^}=$ans" >> "$path"
        fi
    done
}

if [ -e "$BACKEND_ENV_PATH" ]; then    
    missing_backend_envs=()
    get_unconfigured_settings BACKEND_ENV_STRINGS "$BACKEND_ENV_PATH" "Backend" missing_backend_envs
    if [[ "${#missing_backend_envs[@]}" -eq 0 ]]; then
        if ask_consent "All backend variables are set. Re-configure them?"; then
            set_envs BACKEND_ENV_STRINGS "$BACKEND_ENV_PATH"
        fi
    elif ask_consent "You have ${#missing_backend_envs[@]} unconfigured backend variables. Configure them?"; then
        set_envs missing_backend_envs "$BACKEND_ENV_PATH"
    fi
elif ask_consent "Configure backend variables?"; then
  set_envs BACKEND_ENV_STRINGS "$BACKEND_ENV_PATH"
fi

if [ -e "$DB_ENV_PATH" ]; then
    missing_db_envs=()
    get_unconfigured_settings DB_ENV_STRINGS "$DB_ENV_PATH" "Database" missing_db_envs
    if [[ "${#missing_db_envs[@]}" -eq 0 ]]; then
        if ask_consent "All database variables are set. Re-configure them?"; then
            set_envs DB_ENV_STRINGS "$DB_ENV_PATH"
        fi
    elif ask_consent "You have ${#missing_db_envs[@]} unconfigured database variables. Configure them?"; then
        set_envs DB_ENV_STRINGS "$DB_ENV_PATH"
    fi
elif ask_consent "Configure database variables?"; then
  set_envs DB_ENV_STRINGS "$DB_ENV_PATH"
fi