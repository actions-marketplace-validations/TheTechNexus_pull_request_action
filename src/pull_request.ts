import { Octokit } from "@octokit/rest";
import * as fs from "fs";

export async function getPullRequestDetails({
  owner,
  repo,
  pull_number,
  octokit,
}: {
  owner: string;
  repo: string;
  pull_number: number;
  octokit: Octokit;
}) {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number,
  });

  return pullRequest;
}

export async function getLabelsFromFileName({
  owner,
  repo,
  pull_number,
  branch_name,
  octokit,
}: {
  owner: string;
  repo: string;
  pull_number: number;
  branch_name: string;
  octokit: Octokit;
}): Promise<string[]> {
  const { data: pullRequestFiles } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number,
  });

  const moduleNames = pullRequestFiles.map((file) => {
    return file.filename.split("/").at(-2) ?? "";
  });

  const fileExtensions: string[] = pullRequestFiles.map((file) => {
    return file.filename.split(".").at(-1) ?? "";
  });

  const uniqueModuleNames = [...new Set(moduleNames)];
  const uniqueFileExtensions = [...new Set(fileExtensions)];

  const labels = uniqueModuleNames.concat(uniqueFileExtensions);

  if (branch_name.split("/").length > 1 && branch_name.split("/").at(0)) {
    const branch_type = branch_name.split("/").at(0);

    if (branch_type === "fix") {
      labels.push("Bug");
    } else if (branch_type === "feat") {
      labels.push("enhancement");
    } else {
      labels.push(branch_type as string);
    }
  }

  fs.writeFileSync("pull_request_files.json", JSON.stringify(labels));

  return labels;
}

export async function updatePullRequestLables({
  owner,
  repo,
  pull_number,
  labels,
  octokit,
}: {
  owner: string;
  repo: string;
  pull_number: number;
  labels: string[];
  octokit: Octokit;
}) {
  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: pull_number,
    labels,
  });
}
