import { BACKEND_URL } from "../config";
import axios from "axios";

export default axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { "Content-Type": "application/json" },
});
