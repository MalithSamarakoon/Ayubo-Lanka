import axios from "axios";

const axiosInstance = axios.create({

	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true, 

	baseURL:  "http://localhost:5000/api" ,
	withCredentials: true, // send cookies to the server
 b2c6a573197a45c710c738d5892571900cb52a80
});

export default axiosInstance;