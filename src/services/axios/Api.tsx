import axios from "axios";

 
const userManagementApi = () => {

  return axios.create({

    // baseURL: "http://192.168.235.109:8083",
    baseURL: "http://35.194.28.27:",

  });

};

 

const vendorManagementApi = () => {

  return axios.create({
    // baseURL: "http://192.168.235.109:8084",
    baseURL: "http://34.30.0.99"
  });

};

const udsideManagementApi = () => {
  return axios.create({
    baseURL: "http://udside.rezos.io/udside-service",
    // baseURL: "http://172.168.1.32:8081/udside-service",
  });
};

export { userManagementApi, vendorManagementApi, udsideManagementApi };
