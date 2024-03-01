export const LOAD_USERS = 'users/LOAD_USERS';

export const loadUsers = (users) => ({
  type: LOAD_USERS,
  users
});

export const getUsers = () => async dispatch => {
    const response = await fetch(`/api/users`)
  
    if(response.ok){
      const users = await response.json()
      dispatch(loadUsers(users))
    }else{
        const errors = await response.json()
        return errors
    }
}

const usersReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAD_USERS: {
        const usersState = {};
        if(action.users.Users.length){
            action.users.Users.forEach((user) => {
              usersState[user.id] = user;
            });
        }
        return usersState;
      }
      default:
        return state;
    }
  };
  
  export default usersReducer;