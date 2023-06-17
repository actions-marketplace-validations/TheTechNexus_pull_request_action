import { Octokit } from "@octokit/rest";
import {
  getPullRequestDetails,
  getLabelsFromFileName,
  updatePullRequestLables,
} from "./pull_request";
import { pingTelegramOnPullRequest } from "./telegram";
import * as core from "@actions/core";

const GITHUB_API_BASE_URL = "https://api.github.com";

async function run() {
  const owner = core.getInput("owner", { required: true });

  const repo = core.getInput("repo", { required: true });

  const pull_number = core.getInput("pr_number", { required: true });

  const github_api_key = core.getInput("github_api_key", { required: true });

  const telegram_chat_id = core.getInput("telegram_chat_id", {
    required: false,
  });

  const telegram_bot_token = core.getInput("telegram_bot_token", {
    required: false,
  });

  const octokit = new Octokit({
    auth: github_api_key,
    baseUrl: GITHUB_API_BASE_URL,
  });

  const pull_request = await getPullRequestDetails({
    owner,
    repo,
    pull_number: +pull_number,
    octokit,
  });

  if (telegram_bot_token && telegram_chat_id && pull_request) {
    pingTelegramOnPullRequest({
      telegram_bot_token,
      telegram_chat_id,
      pull_request,
    });
  }

  const labels: string[] = await getLabelsFromFileName({
    owner,
    repo,
    pull_number: +pull_number,
    branch_name: pull_request.head.ref,
    octokit,
  });

  await updatePullRequestLables({
    owner,
    repo,
    pull_number: +pull_number,
    labels: labels,
    octokit,
  });
}

run();
