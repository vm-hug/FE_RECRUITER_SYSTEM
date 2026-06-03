import axios from "axios";

const aiAxiosClient = axios.create({
  baseURL: "http://localhost:8005",
});

export default aiAxiosClient;
