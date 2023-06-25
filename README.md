# GitHub Action - PR Notification

This GitHub Action sends a notification to a Telegram group when a pull request (PR) is created or updated in a specified repository.

## Usage

To use this GitHub Action, follow these steps:

1. Create a new workflow file (e.g., `.github/workflows/pr-notification.yml`) in your repository.
2. Add the following content to the workflow file:

```yaml
name: PR Notification

on:
  pull_request:
    types:
      - opened
      - synchronize

jobs:
  pr-notification:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: PR Notification
        uses: TheTechNexus/pull_request_action@main
        with:
          owner: ${{ secrets.GITHUB_OWNER }}
          repo: ${{ secrets.GITHUB_REPOSITORY }}
          pull_number: ${{ github.event.pull_request.number }}
          github_api_key: ${{ secrets.GITHUB_API_KEY }}
          telegram_bot_token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          telegram_chat_id: ${{ secrets.TELEGRAM_CHAT_ID }}
