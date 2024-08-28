#!/bin/bash
source THECODE.sh #Contains the functions

ERROR=false
# is_process_running "xtts_api_server" || ERROR=true
is_process_running "bjornulf_xtts_server" || ERROR=true
is_process_running "minio" || ERROR=true
is_process_running "postgresql" || ERROR=true
$ERROR && error && exit 1

bun run build && success && bun run start || error
