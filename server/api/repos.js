const router = require('express').Router()
module.exports = router
const axios = require('axios')
const octokit = require('@octokit/rest')()
const dateFormat = require('dateformat')

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
          date: dateFormat(
            commit.commit.committer.date,
            'mmmm d, yyyy, HH:MM:ss'
          ),
          time: `January 1, 2000, ${dateFormat(
            commit.commit.committer.date,
            'HH:MM:ss'
          )}`,
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

    const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&&until=${until}`

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
          date: dateFormat(
            commit.commit.committer.date,
            'mmmm d, yyyy, HH:MM:ss'
          ),
          time: `January 1, 2000, ${dateFormat(
            commit.commit.committer.date,
            'HH:MM:ss'
          )}`,
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
    while (octokit.hasNextPage(response) && data.length <= 500) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    const filteredPulls = []
    data.forEach(pull => {
      filteredPulls.push({
        title: pull.title,
        userAvatarUrl: pull.user.avatar_url,
        dateCreated: dateFormat(pull.created_at, 'mmmm d, yyyy, HH:MM:ss'),
        timeCreated: `January 1, 2000, ${dateFormat(
          pull.created_at,
          'HH:MM:ss'
        )}`,
        dateClosed: dateFormat(pull.closed_at, 'mmmm d, yyyy, HH:MM:ss'),
        timeClosed: `January 1, 2000, ${dateFormat(pull.closed_at, 'HH:MM:ss')}`
      })
    })

    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})

let trueCount = 0
let falseCount = 0
const dateFilter = (data, response, since, until, toggle) => {
  if (
    response.data[0].created_at > since &&
    response.data[response.data.length - 1].created_at <= until
  ) {
    if ((toggle[0] === null && toggle[1] === null) || trueCount <= 1 ) {
      toggle[0] = true
      trueCount += 1
      console.log("TRUE COUNT", trueCount)
    }
    console.log('ADDED')
    data = data.concat(response.data)
    toggle[1] = true
  } else {
    if ((toggle[0] === null && toggle[1] === null) || falseCount <= 1) {
      toggle[0] = false
      falseCount += 1
      console.log("FALSE COUNT", falseCount)
    }
    toggle[1] = false
  }
  return data
}

const pullFilter = data => {
  const filteredPulls = []
  data.forEach(pull => {
    filteredPulls.push({
      title: pull.title,
      userAvatarUrl: pull.user.avatar_url,
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

// PULLS FROM A REPOSITORY BY DATE
router.get('/:owner/:repo/pulls/:since/:until', async (req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const since = req.params.since
    const until = req.params.until

    console.log('SINCE ---->', since)
    console.log('UNTIL ---->', until)

    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`

    let response = await axios.get(
      `${url}&&client_id=${clientId}&&client_secret=${clientSecret}`
    )
    let {data} = response
    let toggle = [null, null]

    while (octokit.hasNextPage(response) && data.length <= 500 &&toggle[0] === toggle[1]) {
      console.log('TOGGLE', toggle)

      toggle[0] = toggle[1]
      response = await octokit.getNextPage(response)

      console.log('START RESPONSE', response.data[0].created_at, response.data[0].created_at > since)
      console.log(
        'END RESPONSE',
        response.data[response.data.length - 1].created_at, response.data[response.data.length - 1].created_at <= until
      )
      data = dateFilter(data, response, since, until, toggle)
    }
    console.log("DATA SLICE CHECK", data[0].created_at, data[0].created_at > until)
    if(data[0].created_at > until) {
      console.log("SLICED")
      data = data.slice(30)
    }
    const filteredPulls = pullFilter(data)
    res.send(filteredPulls)
  } catch (err) {
    next(err)
  }
})
