#!/bin/bash

MAIN_DIR=$(dirname "$(realpath "$0")")

source $MAIN_DIR/colors.sh

BANNER1=$(cat << "EOF"
  d8,                      d8b d8b                             
 `8P           d8P         88P 88P                d8P          
            d888888P      d88 d88              d888888P        
  88b 88bd88b ?88' d8888b 888 888   d8888b d8888b?88' d888b8b  
  88P 88P' ?8b88P d8b_,dP ?88 ?88  d8b_,dPd8P' `P88P d8P' ?88  
 d88 d88   88P88b 88b      88b 88b 88b    88b    88b 88b  ,88b 
d88'd88'   88b`?8b`?888P'   88b 88b`?888P'`?888P'`?8b`?88P'`88b
                                                             
     
EOF
)

BANNER2=$(cat << "EOF"
                                                             
                            ,d8888bd8,                                            d8,                  
                            88P'  `8P                                        d8P `8P                   
                         d888888P                                         d888888P                     
 d8888b d8888b   88bd88b   ?88'    88b d888b8b  ?88   d8P  88bd88b d888b8b  ?88'  88b d8888b   88bd88b 
d8P' `Pd8P' ?88  88P' ?8b  88P     88Pd8P' ?88  d88   88   88P'  `d8P' ?88  88P   88Pd8P' ?88  88P' ?8b
88b    88b  d88 d88   88P d88     d88 88b  ,88b ?8(  d88  d88     88b  ,88b 88b  d88 88b  d88 d88   88P
`?888P'`?8888P'd88'   88bd88'    d88' `?88P'`88b`?88P'?8bd88'     `?88P'`88b`?8bd88' `?8888P'd88'   88b
                                             )88                                                       
                                            ,88P                                                       
                                        `?8888P    
EOF
)

echo -e "${GREEN}${BANNER1}${ENDCOLOR}"
echo -e "${WHITE}${BANNER2}${ENDCOLOR}"