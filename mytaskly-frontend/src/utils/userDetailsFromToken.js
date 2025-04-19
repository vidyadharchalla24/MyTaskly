import { jwtDecode } from "jwt-decode";

export const userDetailsFromToken = ()=>{
    try {
        const token = localStorage.getItem("token");
        return jwtDecode(token);
    } catch (error) {
        console.log(error);
    }
}