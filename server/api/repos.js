const router = require('express').Router()
module.exports = router
const axios = require('axios')

// CLIENT ID AND SECRET
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

// COMMITS FROM A REPOSITORY
router.get('/:owner/:repo/commits', async(req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`

    const {data: commits} = await axios.get(`${url}&&client_id=${clientId}&&client_secret=${clientSecret}`)

      const filteredCommits = []
      commits.forEach(commit => {
      if(commit.commit.committer.name !== 'GitHub'){
        filteredCommits.push({
          message: commit.commit.message,
          date: commit.commit.committer.date,
          commiterName: commit.commit.committer.name,
          commiterEmail: commit.commit.committer.email,
          authorAvatarUrl: commit.committer.avatar_url
        })
      }
    })

    res.send(filteredCommits)
  } catch (err) {
    next(err)
  }
})

// PULL REQUESTS FROM A REPOSITORY
router.get('/:owner/:repo/pulls', async(req, res, next) => {
  try {
    const owner = req.params.owner
    const repo = req.params.repo
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`

    const {data: pullRequests} = await axios.get(`${url}&&client_id=${clientId}&&client_secret=${clientSecret}`)
    res.send(pullRequests)
  } catch (err) {
    next(err)
  }
})
