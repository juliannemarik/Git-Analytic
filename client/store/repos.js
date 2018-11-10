import axios from 'axios'

// ACTION TYPES
const SET_OWNER = 'SET_OWNER'
const SET_REPOSITORY = 'SET_REPOSITORY'
const SET_COMMITS = 'GET_COMMITS'
const SET_PULLS = 'SET_PULLS'

// INITIAL STATE
const initialState = {
  owner: '',
  repository: '',
  commits: [],
  pulls: []
}

// ACTION CREATORS
export const setOwner = owner => ({type: SET_OWNER, owner})
export const setRepository = repository => ({type: SET_REPOSITORY, repository})
const setCommits = commits => ({type: SET_COMMITS, commits})
const setPulls = pulls => ({type: SET_PULLS, pulls})

// THUNK CREATORS
export const fetchCommits = (owner, repo) => async dispatch => {
  try {
    const {data: commits} = await axios.get(`api/repos/${owner}/${repo}/commits`)
    dispatch(setCommits(commits))
  } catch (err) {
    console.error(err)
  }
}
export const fetchCommitsByDate = (owner, repo, since, until) => async dispatch => {
  try {
    const {data: commits} = await axios.get(`api/repos/${owner}/${repo}/commits/${since}/${until}`)
    dispatch(setCommits(commits))
  } catch (err) {
    console.error(err)
  }
}
export const fetchPulls = (owner, repo) => async dispatch => {
  try {
    const {data: pulls} = await axios.get(`api/repos/${owner}/${repo}/pulls`)
    dispatch(setPulls(pulls))
  } catch (err) {
    console.err(err)
  }
}

// HANDLERS
const handlers = {
  [SET_OWNER]: (state, action) => {
    return {...state, owner: action.owner}
  },
  [SET_REPOSITORY]: (state, action) => {
    return {...state, repository: action.repository}
  },
  [SET_COMMITS]: (state, action) => {
    return {...state, commits: action.commits}
  },
  [SET_PULLS]: (state, action) => {
    let pullRequests = []
    if(!action.pulls.length){
      pullRequests.push(null)
    } else {
      pullRequests = action.pulls
    }
    return {...state, pulls: pullRequests}
  }
}

// REDUCER
export default function (state = initialState, action) {
  if (!handlers.hasOwnProperty(action.type)) {
    return state
  } else {
    return handlers[action.type](state, action)
  }
}

