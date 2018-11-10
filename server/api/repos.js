const router = require('express').Router()
module.exports = router
const axios = require('axios')
const octokit = require('@octokit/rest')()
const dateFormat = require('dateformat');

// CLIENT ID AND SECRET
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

// ALL COMMITS FROM A REPOSITORY
router.get('/:owner/:repo/commits', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?`

    let response = await axios.get(
      `${url}&&client_id=${clientId}&&client_secret=${clientSecret}`
    )
    let {data} = response
    while (octokit.hasNextPage(response) && data.length <= 500) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    const filteredCommits = []
    data.forEach(commit => {
      if (commit.commit.committer.name !== 'GitHub') {
        filteredCommits.push({
          message: commit.commit.message,
          date: dateFormat(commit.commit.committer.date, "mmmm d, yyyy, HH:MM:ss"),
          time: `January 1, 2000, ${dateFormat(commit.commit.committer.date, "HH:MM:ss")}`,
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

// COMMITS FROM A REPOSITORY BY DATE
router.get('/:owner/:repo/commits/:since/:until', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const since = req.params.since
    const until = req.param.until

    const url = `https://api.github.com/repos/${owner}/${repo}/commits?${since}&&${until}`

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
          date: dateFormat(commit.commit.committer.date, "mmmm d, yyyy, HH:MM:ss"),
          time: `January 1, 2000, ${dateFormat(commit.commit.committer.date, "HH:MM:ss")}`,
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


// ALL PULL REQUESTS FROM A REPOSITORY
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
        dateCreated: dateFormat(pull.created_at, "mmmm d, yyyy, HH:MM:ss"),
        timeCreated: `January 1, 2000, ${dateFormat(pull.created_at, "HH:MM:ss")}`,
        dateClosed: dateFormat(pull.closed_at, "mmmm d, yyyy, HH:MM:ss"),
        timeClosed: `January 1, 2000, ${dateFormat(pull.closed_at, "HH:MM:ss")}`,
      })
    })

    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})
