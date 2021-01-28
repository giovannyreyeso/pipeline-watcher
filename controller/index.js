const axios = require('axios');
const cron = require('node-cron');
let projects = [];
cron.schedule(process.env.CRON_JOB_TAB, () => {
    console.info(`Checking status of all pipelines at ${process.env.CRON_JOB_TAB}`);
    checkStatus();
    if (projects.length <= 0) {
        console.info(`0 Projects to check...`);
    }
});
async function checkPipeline(data) {
    const pipelineStatus = await getJobStatus(data.projectId, data.pipelineId);
    if (pipelineStatus.status === 'running' || pipelineStatus.status === 'pending' || pipelineStatus.status === 'created') {
        projects.push({
            projectId: data.projectId,
            projectName: data.projectName,
            pipelineId: data.pipelineId,
            status: pipelineStatus.status,
            ref: pipelineStatus.ref,
            hook: data.hook
        });
        console.info(`The project ${data.projectName} was registered the actual pipeline status is ${pipelineStatus.status}`);
        return;
    }
    console.info(`Can't register the project ${data.projectName} the actual pipeline status is ${pipelineStatus.status}`);
}
async function getJobStatus(projectId, pipelineId) {
    let jobs = [];
    try {
        const options = {
            url: `${process.env.GITLAB_HOST}/api/v4/projects/${projectId}/pipelines/${pipelineId}`,
            headers: {
                'PRIVATE-TOKEN': process.env.GITLAB_PRIVATE_TOKEN
            },
            method: 'GET'
        }
        const axiosResponse = await axios(options);
        jobs = axiosResponse.data;
    } catch (error) {
        console.error(error);
    }
    return jobs;
}
async function checkStatus() {
    let messageToHook = process.env.MESSAGE_TO_HOOK;
    for (let i = 0; i < projects.length; i++) {
        let jobStatusNew = await getJobStatus(projects[i].projectId, projects[i].pipelineId);
        if (jobStatusNew.status != projects[i].status) {
            messageToHook = messageToHook.replace('%p', projects[i].projectName);
            messageToHook = messageToHook.replace('%m', getStatusName(jobStatusNew.status));
            messageToHook = messageToHook.replace('%r', projects[i].ref);
            messageToHook = messageToHook.replace('%a', jobStatusNew.user.name);
            sendMessageToHook(projects[i], messageToHook);
            projects.splice(i, 1);
        }
    }
}

function sendMessageToHook(project, message) {
    if (!project.hook)
        return;
    const hook = project.hook;
    axios.post(hook, {
        text: message
    }, {
        headers: {
            'Content-type': 'application/json'
        }
    });
}

function getStatusName(status) {
    switch (status) {
        case 'created': return process.env.CREATED_MESSAGE;
        case 'preparing': return process.env.PREPARING_MESSAGE
        case 'pending': return process.env.PENDING_MESSAGE
        case 'running': return process.env.RUNNING_MESSAGE
        case 'success': return process.env.SUCCESS_MESSAGE
        case 'failed': return process.env.FAILED_MESSAGE
        case 'canceled': return process.env.CANCELED_MESSAGE
        case 'skipped': return process.env.SKIPPED_MESSAGE
        default: return process.env.NOT_STATUS_MESSAGE
    }
}
module.exports = {
    checkPipeline
}