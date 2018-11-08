import axios from 'axios'

// ACTION TYPES
const GET_COMMITS = 'GET_COMMITS'

// INITIAL STATE
const initialState = {
  commits: [],
  pulls: []
}

// ACTION CREATORS
const getCommits = commits => ({type: GET_COMMITS, commits})

// THUNK CREATORS
export const fetchCommits = (owner, repo) => async dispatch => {
  try {
    const {data: commits} = await axios.get(`api/repos/${owner}/${repo}/commits`)
    dispatch(getCommits(commits))
  } catch (err) {
    console.error(err)
  }
}

// HANDLERS
const handlers = {
  [GET_COMMITS]: (state, action) => {
    return {...state, commits: action.commits}
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

