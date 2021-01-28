# Pipeline Watcher for Gitlab

pipeline-watcher is a custom api for watch status of pipeline in gitlab continuos integration, now you can watch and send message to hook when a pipeline change status.

  - it's simple, just deploy the api
  - modify before_script in .gitlab-ci.yaml and registre the pipeline to pipeline-watchera


**Table of Contents**   
1. [Notes](#notes)
2. [How use it](#how-use-it)
3. [How run it](#how-run-it)
4. [Env vars](#env-vars)

# How use it?<a name="how-use-it"></a>

Please modify your .gitlab-ci.yaml in before_script for execute curl to send the data to pipeline-watcher
  ```yaml
before_script:
    - curl -X POST -H 'Content-type: application/json' --data '{"projectId": "'"$CI_PROJECT_ID"'", "pipelineId": "'"$CI_PIPELINE_ID"'", "projectName":"'"$CI_PROJECT_NAME"'", "hook":"slack-hook" }' http://your-pipeline-watcher-host:3000/register
```
The $CI env vars is taken from continuous integration of gitlab2

# Notes<a name="notes"></a>
"hook" refeerer to slack hook channel or / google chat for example:

```url
https://hooks.slack.com/services/fake/fake/fake
```
or

```url
https://chat.googleapis.com/v1/spaces/fake/messages?key=fake-fake&token=fake-fake-fake%3D
```

For security reason must provide a env var from gitlab continuous integration in the project

# How run it? (Building custom Docker image) <a name="how-run-it"></a>
First modify env.dev with your data and use docker build
```bash
docker build . --tag pipeline-watcher:latest
```
# Using the docker hub image
```bash
docker pull pipeline-watcher:latest
```
Then you can use the new docker image
```bash
docker run -p 3000:3000 --name pipeline-watcher pipeline-watcher:latest
```

# You can customize the message (Environment variables)<a name="env-vars"></a>
- MESSAGE_TO_HOOK=The pipeline in the project %p %m in the branch %r created by %a
- CRON_JOB_TAB=* * * * *
- GITLAB_HOST=https://yourgilab.domain.com
- GITLAB_PRIVATE_TOKEN=your-private-token
- RUNNING_MESSAGE=is running
- CREATED_MESSAGE=was created
- PREPARING_MESSAGE=is preparing
- PENDING_MESSAGE=is pending
- SUCCESS_MESSAGE=was success
- FAILED_MESSAGE=was failed
- CANCELED_MESSAGE=was canceled
- SKIPPED_MESSAGE=was skipped
- NOT_STATUS_MESSAGE=the pipeline not have a message

This env variables can custumize in dev.env file also you can pass it to docker run command

## To pass env vars to docker run command
```bash
docker run \
-e GITLAB_HOST=https://yourgitlab.host.com  \
-e GITLAB_PRIVATE_TOKEN=yourprivate-token \
-p 3000:3000 --name pipeline-watcher pipeline-watcher:latest
```

# Bugs
If you find a bug please feel free to open a new issue with the details of the bug

# Contributing
Have a good idea for this project? You can join!, just download the code and send merge request