export const LOAD_RXS = 'rxs/LOAD_RXS';
export const CREATE_RX = 'rxs/CREATE_RX';
export const UPDATE_RX = 'rxs/UPDATE_RX';
export const REMOVE_RX = 'rxs/REMOVE_RX';

export const loadRxs = (rxs) => ({
  type: LOAD_RXS,
  rxs
});

export const createRx = (rx) => ({
  type: CREATE_RX,
  rx
});

export const editRx = (rx) => ({
  type: UPDATE_RX,
  rx
});

export const removeRx = (rxId) => ({
  type: REMOVE_RX,
  rxId
});

export const getRxs = () => async dispatch => {
    const response = await fetch(`/api/requests`)
  
    if(response.ok){
      const rxs = await response.json()
      dispatch(loadRxs(rxs))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const getCurrentUsersRxs = () => async dispatch => {
    const response = await fetch(`/api/requests/current`)
  
    if(response.ok){
      const rxs = await response.json()
      dispatch(loadRxs(rxs))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const addRx = (rx) => async dispatch => {
    const response = await fetch(`/api/requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rx)
    })

    if(response.ok){
        const rx = await response.json()
        dispatch(createRx(rx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const acceptRx = (rxId) => async dispatch => {
    const response = await fetch(`/api/requests/${rxId}/accept`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.ok){
        const rx = await response.json()
        dispatch(editRx(rx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const declineRx = (rxId) => async dispatch => {
    const response = await fetch(`/api/requests/${rxId}/decline`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(response.ok){
        const rx = await response.json()
        dispatch(editRx(rx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const updateRx = (rxId, rx) => async dispatch => {
    const response = await fetch(`/api/requests/${rxId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rx)
    })
  
    if(response.ok){
        const rx = await response.json()
        dispatch(editRx(rx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const deleteRx = (rxId) => async dispatch => {
    const response = await fetch(`/api/requests/${rxId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
  
    if(response.ok){
        dispatch(removeRx(rxId))
    }else{
        const errors = await response.json()
        return errors
    }
}

const rxsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_RXS: {
      const rxsState = {};
      if(action.rxs.Requests.length){
          action.rxs.Requests.forEach((rx) => {
            rxsState[rx.id] = rx;
          });
      }
      return rxsState;
    }
    case CREATE_RX:
      return { ...state, [action.rx.id]: action.rx };
    case UPDATE_RX:
      return { ...state, [action.rx.id]: action.rx };
    case REMOVE_RX: {
      const newState = { ...state };
      delete newState[action.rxId];
      return newState;
    }
    default:
      return state;
  }
};

export default rxsReducer;
