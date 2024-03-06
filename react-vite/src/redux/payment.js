export const LOAD_PAYMENT_METHODS = 'paymentMethods/LOAD_PAYMENT_METHODS';
export const CREATE_PAYMENT_METHOD = 'paymentMethods/CREATE_PAYMENT_METHOD';
export const UPDATE_PAYMENT_METHOD = 'paymentMethods/UPDATE_PAYMENT_METHOD';
export const REMOVE_PAYMENT_METHOD = 'paymentMethods/REMOVE_PAYMENT_METHOD';

export const loadPaymentMethods = (paymentMethods) => ({
  type: LOAD_PAYMENT_METHODS,
  paymentMethods
});

export const createPaymentMethod = (paymentMethod) => ({
  type: CREATE_PAYMENT_METHOD,
  paymentMethod
});

export const editPaymentMethod = (paymentMethod) => ({
  type: UPDATE_PAYMENT_METHOD,
  paymentMethod
});

export const removePaymentMethod = (paymentMethodId) => ({
  type: REMOVE_PAYMENT_METHOD,
  paymentMethodId
});

export const getPaymentMethod = () => async dispatch => {
    const response = await fetch(`/api/payments`)
  
    if(response.ok){
      const paymentMethods = await response.json()
      dispatch(loadPaymentMethods(paymentMethods))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const getPlaidPaymentMethod = () => async dispatch => {
    const response = await fetch(`/api/payments/plaid`)
  
    if(response.ok){
      const paymentMethods = await response.json()
      dispatch(loadPaymentMethods(paymentMethods))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const addPaymentMethod = (paymentMethod) => async dispatch => {
    const response = await fetch(`/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentMethod)
    })

    if(response.ok){
        const paymentMethod = await response.json()
        dispatch(createPaymentMethod(paymentMethod))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const updatePaymentMethod = (paymentMethodId, paymentMethod) => async dispatch => {
    const response = await fetch(`/api/payments/${paymentMethodId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentMethod)
    })
  
    if(response.ok){
        const paymentMethod = await response.json()
        dispatch(editPaymentMethod(paymentMethod))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const deletePaymentMethod = (paymentMethodId) => async dispatch => {
    const response = await fetch(`/api/payments/${paymentMethodId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
  
    if(response.ok){
        dispatch(removePaymentMethod(paymentMethodId))
    }else{
        const errors = await response.json()
        return errors
    }
}

const paymentMethodsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_PAYMENT_METHODS: {
      const paymentMethodsState = {};
      if(action.paymentMethods.Payments.accounts.length){
          action.paymentMethods.Payments.accounts.forEach((paymentMethod) => {
            paymentMethodsState[paymentMethod.account_id] = paymentMethod;
          });
      }
      return paymentMethodsState;
    }
    case CREATE_PAYMENT_METHOD:
      return { ...state, [action.paymentMethod.account_id]: action.paymentMethod };
    case UPDATE_PAYMENT_METHOD:
      return { ...state, [action.paymentMethod.account_id]: action.paymentMethod };
    case REMOVE_PAYMENT_METHOD: {
      const newState = { ...state };
      delete newState[action.paymentMethodId];
      return newState;
    }
    default:
      return state;
  }
};

export default paymentMethodsReducer;
