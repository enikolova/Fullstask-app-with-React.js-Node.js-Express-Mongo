
  export const addUser = (user) => ({
    type: "ADD_USER",
    payload: user
})

  export const removeUser = () => ({
    type: "REMOVE_USER",
    payload: null
})