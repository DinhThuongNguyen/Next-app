import axiosClient from "./axiosClient";

const headerNormal = { "Content-type": "application/json" };
const headerFile = {
  "Content-type": "multipart/form-data",
  "Accept": "application/json",
};

const methodApi = {
  getAccount: (params) => {
    const url = `/account/${params}`;
    //const url = "/account";
    return axiosClient({
      method: "get",
      url: url,
    });
  },

  get: (url) => {
    return axiosClient.get(url);
  },
  getById: (url, data) => {
    return axiosClient({
      method: "get",
      data: data,
    });
  },
  post: (url, data) => {
    return axiosClient({
      method: "post",
      url: url,
      data: data,
      headers: headerNormal,
    });
  },
  postFile: (url, data) => {
    return axiosClient({
      method: "post",
      url: url,
      data: data,
      headers: headerNormal,
    });
  },
  patch: (url, data) => {
    return axiosClient({
      method: "patch",
      url: url,
      data: data,
      header: headerNormal,
    });
  },
  deleteOne: (url) => {
    return axiosClient({
      method: "delete",
      url: url,
    });
  },
  deleteTwo: (url, data) => {
    return axiosClient({
      method: "delete",
      url: url,
      data: data,
    });
  },
};

export default methodApi;
