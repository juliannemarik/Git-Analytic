const router = require('express').Router()
module.exports = router
const axios = require('axios')
const octokit = require('@octokit/rest')()
const dateFormat = require('dateformat')

// CLIENT ID AND SECRET
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

// PRE-DEFINE HELPER FUNCTIONS
let contributorFilter
let pullFilter
let dateFilter
let commitFilter

// ALL CONTRIBUTORS TO A REPOSITORY
router.get('/:owner/:repo/stats/contributors', async(req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/stats/contributors?client_id=${clientId}&&client_secret=${clientSecret}`
    const {data: contributors} = await axios.get(url)
    const filteredContributors = contributorFilter(contributors)
    res.json(filteredContributors)
  } catch (err) {
    next(err)
  }
})


// ALL COMMITS FROM A REPOSITORY
router.get('/:owner/:repo/commits', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?client_id=${clientId}&&client_secret=${clientSecret}`

    let response = await axios.get(url)
    let {data} = response
    while (octokit.hasNextPage(response) && data.length <= 500) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }
    const filteredCommits = commitFilter(data)

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
    const until = req.params.until

    const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&&until=${until}&&client_id=${clientId}&&client_secret=${clientSecret}`

    let response = await axios.get(url)
    let {data} = response
    while (octokit.hasNextPage(response)) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    const filteredCommits = commitFilter(data)

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
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&&client_id=${clientId}&&client_secret=${clientSecret}`

    let response = await axios.get(url)
    let {data} = response
    while (octokit.hasNextPage(response) && data.length <= 500) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }
    const filteredPulls = pullFilter(data)

    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})

// PULLS FROM A REPOSITORY BY DATE
router.get('/:owner/:repo/pulls/:since/:until', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const since = req.params.since
    const until = req.params.until
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&&client_id=${clientId}&&client_secret=${clientSecret}`

    let response = await axios.get(url)
    let {data} = response
    let toggle = [null, null]

    while (
      octokit.hasNextPage(response) &&
      data.length <= 500 &&
      toggle[0] === toggle[1]
    ) {
      toggle[0] = toggle[1]
      response = await octokit.getNextPage(response)
      data = dateFilter(data, response, since, until, toggle)
    }
    if (data[0].created_at > until) {
      data = data.slice(30)
    }
    const filteredPulls = pullFilter(data)
    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})

// -------------------------------------------------------------------------
// ROUTE HELPER FUNCTIONS

// 0. FILTER NECESSARY DATA FROM CONTRIBUTORS
contributorFilter = data => {
  const filteredContributors = []
  data.forEach(contributor => {
    filteredContributors.push({
      totalCommits: contributor.total,
      login: contributor.author.login,
      avatar: contributor.author.avatar_url
    })
  })
  return filteredContributors
}

// 1. FILTER NECESSARY DATA FROM COMMITS
commitFilter = data => {
  const filteredCommits = []
  data.forEach(commit => {
    if (commit.commit.committer.name !== 'GitHub') {
      filteredCommits.push({
        message: commit.commit.message,
        date: dateFormat(
          commit.commit.committer.date,
          'mmmm d, yyyy, HH:MM:ss'
        ),
        time: `January 1, 2000, ${dateFormat(
          commit.commit.committer.date,
          'HH:MM:ss'
        )}`,
        userName: commit.author.login,
        userEmail: commit.commit.committer.email,
        // userAvatarUrl: commit.committer.avatar_url
      })
    }
  })
  return filteredCommits
}

// 2. FILTER NECESSARY DATA FROM PULLS
pullFilter = data => {
  const filteredPulls = []
  data.forEach(pull => {
    filteredPulls.push({
      title: pull.title,
      userName: pull.user.login,
      // userAvatarUrl: pull.user.avatar_url,
      dateCreated: dateFormat(pull.created_at, 'mmmm d, yyyy, HH:MM:ss'),
      timeCreated: `January 1, 2000, ${dateFormat(
        pull.created_at,
        'HH:MM:ss'
      )}`,
      dateClosed: dateFormat(pull.closed_at, 'mmmm d, yyyy, HH:MM:ss'),
      timeClosed: `January 1, 2000, ${dateFormat(pull.closed_at, 'HH:MM:ss')}`
    })
  })
  return filteredPulls
}

// 3. FILTER PULLS BY DATE
let trueCount = 0
let falseCount = 0
dateFilter = (data, response, since, until, toggle) => {
  if (
    response.data[0].created_at > since &&
    response.data[response.data.length - 1].created_at <= until
  ) {
    if ((toggle[0] === null && toggle[1] === null) || trueCount <= 1) {
      toggle[0] = true
      trueCount += 1
    }
    data = data.concat(response.data)
    toggle[1] = true
  } else {
    if ((toggle[0] === null && toggle[1] === null) || falseCount <= 1) {
      toggle[0] = false
      falseCount += 1
    }
    toggle[1] = false
  }
  return data
}
