import axiosClient from "./axiosClient";

const methodApi = {
  getAccount: (params) => {
    const url = `/account/${params}`;
    //const url = "/account";
    return axiosClient({
      method: "get",
      url: url
    });
  },

  get: (url) => {
    return axiosClient.get(url); 
  },
  getById: (url, data) => {
    return axiosClient({
      method: "get",
      data: data
    })
  },
  post:(url, data) => {
    return axiosClient.post(url, data);
  },
  patch:(url, data) => {
    return axiosClient({
      method: "patch",
      url: url,
      data: data,
    });
  },
  deleteOne:(url) => {
    return axiosClient({
      method: "delete",
      url: url,
    })
  },
  deleteTwo:(url, data) => {
    return axiosClient({
      method: "delete",
      url: url,
      data: data
    })
  }
}

export default methodApi;