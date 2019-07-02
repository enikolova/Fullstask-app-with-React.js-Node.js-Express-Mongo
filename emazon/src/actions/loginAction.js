export const closeLoginDialog = () => ({
  type: "CLOSE_LOGIN_DIALOG",
  payload: false
});

export const openLoginDialog = () => ({
  type: "OPEN_LOGIN_DIALOG",
  payload: true
});
