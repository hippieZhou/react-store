import decode from "jwt-decode";

const JWT = "store_token_id";

const setToken = (token) => {
  return localStorage.setItem(JWT, token);
};

const getToken = () => {
  return localStorage.getItem(JWT);
};

const isLogin = () => {
  const jwtToken = getToken();
  return !!jwtToken && !isTokenExpired(jwtToken);
};

const isTokenExpired = (token) => {
  try {
    const _info = decode(token);
    if (_info.exp < Date.now() / 1000) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const getUser = () => {
  const jwtToken = getToken();
  if (isLogin()) {
    const user = decode(jwtToken);
    return user;
  } else {
    return null;
  }
};

const logout = () => {
  localStorage.removeItem(JWT);
};

global.auth = {
  setToken,
  getToken,
  getUser,
  logout,
  isLogin,
};
