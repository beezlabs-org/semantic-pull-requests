import {debug} from '@actions/core'
import {getOctokit} from '@actions/github'

export class GitHubService {
  private readonly octokit

  constructor(gitHubToken: string) {
    this.octokit = getOctokit(gitHubToken)
  }

  async getPullRequestTitle(
    repositoryOwner: string,
    repositoryName: string,
    pullRequestNumber: number
  ): Promise<string> {
    const pull = (
      await this.octokit.rest.pulls.get({
        owner: repositoryOwner,
        repo: repositoryName,
        pull_number: pullRequestNumber
      })
    ).data

    debug(`Pull request ${pullRequestNumber} includes the following body: ${JSON.stringify(pull)}`)

    return pull.title
  }

  async getPullRequestCommitMessages(
    repositoryOwner: string,
    repositoryName: string,
    pullRequestNumber: number
  ): Promise<string[]> {
    const responseBody = await this.octokit.paginate(this.octokit.rest.pulls.listCommits, {
      owner: repositoryOwner,
      repo: repositoryName,
      pull_number: pullRequestNumber
    })

    const commitMessages = responseBody.map(commit => commit.commit.message)

    debug(`Pull request ${pullRequestNumber} includes the following commit messages: ${JSON.stringify(commitMessages)}`)

    return commitMessages
  }
}
