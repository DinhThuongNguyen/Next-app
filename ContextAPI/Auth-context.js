import {createContext} from 'react';

export const AuthContext = createContext ({
  accountId: null,
  role: null,
  name: null,
  avatar: null,
  idUpdate: null,
  idBlog: null,
  TTupdate: false,
  login: ()=>{},
  logout: ()=>{},
  update: () => {},
  getIdBlog: () => {}
}); 