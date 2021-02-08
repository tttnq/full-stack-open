let timeoutID

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.content
  
    default:
      return state
  }
}

export const setNotification = (content, time) => {
  console.log(timeoutID)
  clearTimeout(timeoutID)
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      content
    })
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        content: ''
      })
    }, time * 1000)
    
  }

}

export default reducer