import axios from "axios";
import { IUsuario } from "../types/IUsuario";

const API = import.meta.env.VITE_URL_LOGIN;

interface ILoginRequest {
  email: string;
  contrasenia: string;
}
interface ILoginResponse {
  usuario: IUsuario;
  token: string;
}

export const loginService = async (
  data: ILoginRequest
): Promise<ILoginResponse> => {
  try {
    const res = await axios.post<ILoginResponse>(API, data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Error en loginService:",
      error.response?.data || error.message
    );
    throw error;
  }
};
