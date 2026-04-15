import { login, logout, me, register } from "./auth.controller.js";

const registerUser = register;
const loginUser = login;
const logoutUser = logout;
const getSessionUser = me;

export { getSessionUser, loginUser, logoutUser, registerUser };
