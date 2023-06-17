import axios from "axios";

export async function pingTelegramOnPullRequest({
  telegram_bot_token,
  telegram_chat_id,
  pull_request,
}: {
  telegram_bot_token: string;
  telegram_chat_id: string;
  pull_request: any;
}) {
  if (pull_request?.user?.login?.toLowerCase().includes("dependabot[bot]")) {
    return;
  }

  if (pull_request?.title?.toLowerCase().includes("wip")) {
    return;
  }

  const sendMessage = [];

  sendMessage.push(`🔥 New Pull Request Alert! 🔥`);
  sendMessage.push(`Project: ${pull_request?.base?.repo.name}`);
  sendMessage.push(`Title: ${pull_request?.title}`);
  sendMessage.push(`Author: ${pull_request?.user.login}`);
  let reviewers = "Reviewers: ";

  for (const reviewer of pull_request.requested_reviewers) {
    reviewers += reviewer.login + ", ";
  }

  sendMessage.push(reviewers);
  sendMessage.push(`Link: ${pull_request?.html_url}`);

  const telegramText = sendMessage.join("\n");

  const telegramApiUrl = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage?chat_id=${telegram_chat_id}&text=${encodeURIComponent(
    telegramText
  )}`;

  axios.get(telegramApiUrl);
}
