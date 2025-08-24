#!/bin/bash
MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"
source "$MAIN_DIR/modules/ask_consent.sh"

function get_unconfigured_settings {
    local -n envs=$1   # reference to array of envs
    local path=$2      # path is just a string now
    local label=$3

    local unconfigured=()

    for env in "${envs[@]}"; do
        if ! grep -qF "$env" "$path" 2>/dev/null; then
            echo "$env unconfigured"
            unconfigured+=("$env")
        fi
    done

    # Return array by name reference
    # Usage: get_unconfigured_variables my_envs "$HOSTS_PATH" "Backend" result_array
    if [[ -n $4 ]]; then
        local -n _result=$4
        _result=("${unconfigured[@]}")
    else
        # Default: print for debugging
        printf '%s\n' "${unconfigured[@]}"
    fi
}
