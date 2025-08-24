#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source "$MAIN_DIR/modules/colors.sh"

function ask_consent {
    while true; do
        echo -ne "${PURPLE}$1${ENDCOLOR} [${GREEN}s${ENDCOLOR}/${RED}N${ENDCOLOR}]: "
        read -r ans

        case "${ans,,}" in
            "s") return 0 ;;
            "n") return 1 ;;
            *)
                echo "Must answer with 's' or 'n'"
                sleep 1
                ;;
        esac
    done
}