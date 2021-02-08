#!/bin/bash
while getopts n:p:i:h:g: flag
do
    case "${flag}" in
        n) projectName=${OPTARG};;
        p) pipelineId=${OPTARG};;
        i) projectId=${OPTARG};;
        h) hook=${OPTARG};;
        g) gitlabhost=${OPTARG};;
    esac
done
curl -X POST -H 'Content-type: application/json' --data '{"projectId": "'"$projectId"'", "pipelineId": "'"$pipelineId"'", "projectName":"'"$projectName"'", "hook":"'"$hook"'" }' $gitlabhost
