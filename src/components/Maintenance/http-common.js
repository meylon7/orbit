import axios from "axios";
import sysIPAddress from "../../location";
const url = ''
export default axios.create({
  baseURL: "https://" + sysIPAddress + url,
  headers: {
    "Content-type": "application/json",
  },
});
