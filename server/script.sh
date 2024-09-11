#!/bin/bash

run_test_3G() {
    local delay=$1
    local total_runs=$2

    sudo dnctl pipe 1 config delay "${delay}ms" bw 384Kbit/s
    echo "dummynet in from any to any pipe 1" | sudo pfctl -f -
    sudo pfctl -e
    TOTAL_RUNS=${total_runs} npm run test-client
    yes | sudo pfctl -d
    yes | sudo dnctl flush
}

run_tes_5G() {
    local delay=$1
    local total_runs=$2

    sudo dnctl pipe 1 config delay "${delay}ms"
    echo "dummynet in from any to any pipe 1" | sudo pfctl -f -
    sudo pfctl -e
    TOTAL_RUNS=${total_runs} npm run test-client
    yes | sudo pfctl -d
    yes | sudo dnctl flush
}

TOTAL_RUNS=5 npm run test-client

run_test_3G 500 1
run_test_3G 1000 1
run_tes_5G 2000 1
run_tes_5G 3000 1
run_tes_5G 4000 1
run_tes_5G 5000 1
run_tes_5G 6000 1
run_tes_5G 7000 1