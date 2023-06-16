import {Commit, sync as parse} from 'conventional-commits-parser'
import {setFailed} from '@actions/core'

export function validatePrTitle(title: string): void {
  const result = parse(title)

  isSemantic(result, title)
}

export function validateCommitMessages(commitMessages: string[]): void {
  for (const commitMessage of commitMessages) {
    const result = parse(commitMessage)

    const valid = isSemantic(result, commitMessage)

    if (!valid) {
      break
    }
  }
}

function isSemantic(result: Commit, title: string): boolean {
  if (!result.type) {
    setFailed(
      `No release type found in pull request title "${title}". Add a prefix to indicate what kind of release this pull request corresponds to. For reference, see https://www.conventionalcommits.org/}`
    )
    return false
  }
  if (!result.subject) {
    setFailed(
      `No subject found in pull request title "${title}". Add a subject to indicate what this pull request corresponds to. For reference, see https://www.conventionalcommits.org/}`
    )
    return false
  }
  return true
}
