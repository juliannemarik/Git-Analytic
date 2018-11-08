const router = require('express').Router()
module.exports = router
const axios = require('axios')
const octokit = require('@octokit/rest')()

// CLIENT ID AND SECRET
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

// COMMITS FROM A REPOSITORY
router.get('/:owner/:repo/commits', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`

    let response = await axios.get(
      `${url}&&client_id=${clientId}&&client_secret=${clientSecret}`
    )
    let {data} = response
    while (octokit.hasNextPage(response)) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    const filteredCommits = []
    data.forEach(commit => {
      if (commit.commit.committer.name !== 'GitHub') {
        filteredCommits.push({
          message: commit.commit.message,
          date: commit.commit.committer.date,
          userName: commit.commit.committer.name,
          userEmail: commit.commit.committer.email,
          userAvatarUrl: commit.committer.avatar_url
        })
      }
    })

    res.send(filteredCommits)
  } catch (err) {
    next(err)
  }
})

// PULL REQUESTS FROM A REPOSITORY
router.get('/:owner/:repo/pulls', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`

    let response = await axios.get(
      `${url}&&client_id=${clientId}&&client_secret=${clientSecret}`
    )
    let {data} = response
    while (octokit.hasNextPage(response)) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    const filteredPulls = []
    data.forEach((pull) => {
      filteredPulls.push({
        title: pull.title,
        userAvatarUrl: pull.user.avatar_url,
        dataCreated: pull.created_at,
        dateClosed: pull.closed_at
      })
    })

    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})
