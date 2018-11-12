import axios from 'axios'

// ACTION TYPES
const SET_OWNER = 'SET_OWNER'
const SET_REPOSITORY = 'SET_REPOSITORY'
const SET_COMMITS = 'SET_COMMITS'
const SET_PULLS = 'SET_PULLS'
const SET_CONTRIBUTORS = 'SET_CONTRIBUTORS'
const TOGGLE_COMMITS = 'TOGGLE_COMMITS'
const TOGGLE_PULLS = 'TOGGLE_PULLS'
const RESET_DATA_VISIBILITY = 'RESET_DATA_VISIBILITY'

// INITIAL STATE
const initialState = {
  owner: '',
  repository: '',
  commits: {
    isFetching: false,
    array: [],
    visibility: true
  },
  pulls: {
    isFetching: false,
    array: [],
    visibility: true
  },
  contributors: {
    isFetching: false,
    array: []
  }
}

// ACTION CREATORS
export const setOwner = owner => ({type: SET_OWNER, owner})
export const setRepository = repository => ({type: SET_REPOSITORY, repository})
const setCommits = commits => ({type: SET_COMMITS, commits})
const setPulls = pulls => ({type: SET_PULLS, pulls})
const setContributors = contributors => ({type: SET_CONTRIBUTORS, contributors})
export const toggleCommits = (visibility) => ({type: TOGGLE_COMMITS, visibility})
export const togglePulls = (visibility) => ({type: TOGGLE_PULLS, visibility})
export const resetDataVisibility = () => ({type: RESET_DATA_VISIBILITY})

// THUNK CREATORS
export const fetchCommits = (owner, repo, commitObj) => async dispatch => {
  try {
    commitObj.isFetching = true
    const {data: commits} = await axios.get(
      `api/repos/${owner}/${repo}/commits`
    )
    dispatch(setCommits(commits))
  } catch (err) {
    console.error(err)
  }
}
export const fetchCommitsByDate = (owner, repo, since, until, commitObj) => async dispatch => {
  try {
    commitObj.isFetching = true
    const {data: commits} = await axios.get(
      `api/repos/${owner}/${repo}/commits/${since}/${until}`
    )
    dispatch(setCommits(commits))
  } catch (err) {
    console.error(err)
  }
}
export const fetchPulls = (owner, repo, pullObj) => async dispatch => {
  try {
    pullObj.isFetching = true
    const {data: pulls} = await axios.get(`api/repos/${owner}/${repo}/pulls`)
    dispatch(setPulls(pulls))
  } catch (err) {
    console.error(err)
  }
}
export const fetchPullsByDate = (owner, repo, since, until, pullObj) => async dispatch => {
  try {
    pullObj.isFetching = true
    const {data: pulls} = await axios.get(
      `api/repos/${owner}/${repo}/pulls/${since}/${until}`
    )
    dispatch(setPulls(pulls))
  } catch (err) {
    console.error(err)
  }
}
export const fetchContributors = (owner, repo, contributorObj) => async dispatch => {
  try {
    contributorObj.isFetching = true
    const {data: contributors} = await axios.get(`api/repos/${owner}/${repo}/stats/contributors`)
    dispatch(setContributors(contributors))
  } catch (err) {
    console.error(err)
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
    return {...state, commits: {isFetching: false, array: action.commits, visibility: true}}
  },
  [SET_PULLS]: (state, action) => {
    return {...state, pulls: {isFetching: false, array: action.pulls, visibility: true}}
  },
  [SET_CONTRIBUTORS]: (state, action) => {
    return {...state, contributors: {isFetching: false, array: action.contributors}}
  },
  [TOGGLE_COMMITS]: (state, action) => {
    return {...state, commits: {...state.commits, visibility: action.visibility}}
  },
  [TOGGLE_PULLS]: (state, action) => {
    return {...state, pulls: {...state.pulls, visibility: action.visibility}}
  },
  [RESET_DATA_VISIBILITY]: (state, action) => {
    return {...state, commits: {...state.commits, visibility: true}, pulls: {...state.pulls, visibility: true}}
  }
}

// REDUCER
export default function(state = initialState, action) {
  if (!handlers.hasOwnProperty(action.type)) {
    return state
  } else {
    return handlers[action.type](state, action)
  }
}
