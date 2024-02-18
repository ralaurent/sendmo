export const LOAD_TXS = 'txs/LOAD_TXS';
export const CREATE_TX = 'txs/CREATE_TX';
export const UPDATE_TX = 'txs/UPDATE_TX';
export const REMOVE_TX = 'txs/REMOVE_TX';

export const loadTxs = (txs) => ({
  type: LOAD_TXS,
  txs
});

export const createTx = (tx) => ({
  type: CREATE_TX,
  tx
});

export const editTx = (tx) => ({
  type: UPDATE_TX,
  tx
});

export const removeTx = (txId) => ({
  type: REMOVE_TX,
  txId
});

export const getTxs = () => async dispatch => {
    const response = await fetch(`/api/transactions`)
  
    if(response.ok){
      const txs = await response.json()
      dispatch(loadTxs(txs))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const getCurrentUsersTxs = () => async dispatch => {
    const response = await fetch(`/api/transactions/current`)
  
    if(response.ok){
      const txs = await response.json()
      dispatch(loadTxs(txs))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const getCurrentUsersPublicTxs = () => async dispatch => {
    const response = await fetch(`/api/transactions/public`)
  
    if(response.ok){
      const txs = await response.json()
      dispatch(loadTxs(txs))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const addTx = (tx) => async dispatch => {
    const response = await fetch(`/api/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tx)
    })

    if(response.ok){
        const tx = await response.json()
        dispatch(createTx(tx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const updateTx = (txId, tx) => async dispatch => {
    const response = await fetch(`/api/transactions/${txId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tx)
    })
  
    if(response.ok){
        const tx = await response.json()
        dispatch(editTx(tx))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const deleteTx = (txId) => async dispatch => {
    const response = await fetch(`/api/transactions/${txId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
  
    if(response.ok){
        dispatch(removeTx(txId))
    }else{
        const errors = await response.json()
        return errors
    }
}

const txsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_TXS: {
      const txsState = {};
      if(action.txs.Transactions.length){
          action.txs.Transactions.forEach((tx) => {
            txsState[tx.id] = tx;
          });
      }
      return txsState;
    }
    case CREATE_TX:
      return { ...state, [action.tx.id]: action.tx };
    case UPDATE_TX:
      return { ...state, [action.tx.id]: action.tx };
    case REMOVE_TX: {
      const newState = { ...state };
      delete newState[action.txId];
      return newState;
    }
    default:
      return state;
  }
};

export default txsReducer;
