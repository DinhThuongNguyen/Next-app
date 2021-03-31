import { useCallback, useReducer, useEffect, useState } from "react";
import Axios from "../../Axios/methodApi.js";
import route from "next/router";
import { signOut } from "next-auth/client";

let logoutTimer;

const accountReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        accountId: action.payload.id,
        name: action.payload.name,
        avatar: action.payload.avatar,
        role: action.payload.role,
      };

    case "loginWith":
    return {
        ...state,
        ggLogin: action.payload.ggLogin,
        fbLogin: action.payload.fbLogin,
      };
    case "update":
      return{
        ...state,
        idUpdate: action.payload.idUpdate,
        TTupdate: action.payload.TT
      }
    case "getIdBlog": 
      return {
        ...state,
        idBlog: action.payload.idBlog
      }  

    default:
      throw new Error();
  }
};

const initialState = {
  accountId: null,
  role: null,
  name: null,
  avatar: null,
  idUpdate: null,
  TTupdate: false,
  idBlog: null
};

const logoutAccount = async () => {
  try {
    const result1 = await Axios.get("/account/logout");
    route.push("/login");
  } catch (error) {
    console.log({ error });
  }
  signOut({redirect: false })
};

export const UseAuth = () => {
  const [valueAccount, dispatch] = useReducer(accountReducer, initialState);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const getIdBlog = useCallback((idBlog) => {
    dispatch({
      type: "getIdBlog",
      payload: {
        idBlog: idBlog
      }
    });
  }, []);

  const login = useCallback((accountId, role, name, avatar, expirationDate) => {
    dispatch({
      type: "login",
      payload: {
        id: accountId,
        name: name,
        avatar: avatar,
        role: role,
      },
    });

    const tokenExpirationDates =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 8);
    setTokenExpirationDate(tokenExpirationDates);

    if (!localStorage.getItem("account")) {
      localStorage.setItem(
        "account",
        JSON.stringify({
          vhy: accountId,
          timer: tokenExpirationDates.toISOString(),
        })
      );
    }
  }, []);

  const update = useCallback((trangThaiUpdate, idUpdate) => {
    dispatch({
      type:"update", payload: {
        TT: trangThaiUpdate,
        idUpdate: idUpdate
      }
    })
  })

  const logout = useCallback(() => {
    dispatch({
      type: "login",
      payload: {
        id: null,
        //token: null,
        name: null,
        avatar: null,
        role: null,
      },
    });

    dispatch({
      type: "loginWith",
      payload: {
        ggLogin: false,
        fbLogin: false,
      },
    });

    setTokenExpirationDate(null);
    localStorage.removeItem("account");
    logoutAccount();
  }, []);

  

  useEffect(() => {
    if (tokenExpirationDate) {
      const remainingTime = tokenExpirationDate - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, tokenExpirationDate]);

  return { valueAccount, login, logout, update, getIdBlog};
};
