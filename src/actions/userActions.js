import { LOGOUT, SIGN, LOGIN } from "../types";
import { helpHttp } from "../services/helpHttp";
import {
  URL_USER_CREATE,
  URL_USER_LOGIN,
  URL_USER_DELETE,
} from "../Assets/url_api";
import { list } from "./gamesActions";

export const sign =
  (name, email, password, setAlert, setShow, setForm, initialForm) =>
  async (dispatch) => {
    try {
      const res = await helpHttp().post(URL_USER_CREATE, {
        headers: {
          "Content-Type": "application/json",
        },
        body: { name, email, password },
      });

      if (res.error) {
        throw res.error;
      } else {
        const { id, email, token } = res;
        setAlert({ success: true, message: `Welcome to GameBack ${email}` });
        setShow(true);
        setTimeout(() => {
          setAlert({ success: false, message: null });
          setShow(false);
          dispatch({ type: SIGN, payload: { id, email, token } });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ id, email, token })
          );
          dispatch(list(id, token));
        }, 1200);
        setForm(initialForm);
      }
    } catch (err) {
      setShow(true);
      setAlert({ error: true, message: err });
      setTimeout(() => {
        setAlert({ error: false, message: false });
        setShow(false);
      }, 1200);
    }
  };

export const login =
  (email, password, setAlert, setShow, setForm, initialForm) =>
  async (dispatch) => {
    try {
      const res = await helpHttp().post(URL_USER_LOGIN, {
        headers: { "Content-Type": "application/json" },
        body: { email, password },
      });
      // console.log(res)
      if (res.error) {
        throw res.error;
      } else {
        const { id, email, token } = res;
        setAlert({ success: true, message: `Sign In ${email}` });
        setShow(true);

        setTimeout(() => {
          setAlert({ success: false, message: null });
          setShow(false);
          dispatch({ type: LOGIN, payload: { id, email, token } });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ id, email, token })
          );
          dispatch(list(id, token));
        }, 1200);

        setForm(initialForm);
      }
    } catch (err) {
      setShow(true);
      setAlert({ error: true, message: err });
      setTimeout(() => {
        setAlert({ error: false, message: false });
        setShow(false);
      }, 1200);
    }
  };

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const deleteUser =
  (token, id, setMessage, handlerShowConfirm, logout, logoutGames) =>
  async (dispatch) => {
    try {
      const res = await helpHttp().del(URL_USER_DELETE + "/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.error) {
        throw res.error;
      } else {
        const { message } = res;
        setMessage("Deleting user...come back soon 😊!");
        setTimeout(() => {
          setMessage("");
          handlerShowConfirm();
          localStorage.removeItem("userInfo");
          localStorage.removeItem("games");
          dispatch(logout());
          dispatch(logoutGames());
        }, 1700);
      }
    } catch (err) {
      setMessage("Sorry, try again later...😢");
      setTimeout(() => {
        setMessage("");
        handlerShowConfirm();
      }, 1700);
    }
  };
