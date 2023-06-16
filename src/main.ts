import {debug, getInput, setFailed} from '@actions/core'
import {context} from '@actions/github'
import {GitHubService} from './github-services'
import {validateCommitMessages, validatePrTitle} from './handle-pull-request-change'

async function run(): Promise<void> {
  try {
    const titleCommits = getInput('title-commits')
    const githubToken = getInput('token', {required: true})

    debug('Inputs received')

    const eventName = context.eventName

    debug(`Event='${eventName}'`)

    if (eventName !== 'pull_request') {
      setFailed(`Only pull_request events are supported. Event was: ${eventName}`)
      return
    }

    const gitHubService = new GitHubService(githubToken)
    const pullRequestNumber = context.payload?.pull_request?.number || 0
    if (!pullRequestNumber) {
      setFailed('Pull request number is missing in github event payload')
      return
    }

    if (titleCommits === 'title' || titleCommits === 'both') {
      const pullTitle = await gitHubService.getPullRequestTitle(
        context.repo.owner,
        context.repo.repo,
        pullRequestNumber
      )
      validatePrTitle(pullTitle)
    }

    if (titleCommits === 'commits' || titleCommits === 'both') {
      const commitMessages = await gitHubService.getPullRequestCommitMessages(
        context.repo.owner,
        context.repo.repo,
        pullRequestNumber
      )
      validateCommitMessages(commitMessages)
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed('Unknown error occurred')
    }
  }
}

run()
