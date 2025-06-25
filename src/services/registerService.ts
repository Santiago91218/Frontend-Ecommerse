import axios from "axios";

export interface IRegisterRequest {
  nombre: string;
  email: string;
  contrasenia: string;
  dni: number;
  rol: string;
}

export const registerService = async (data: IRegisterRequest) => {
  const response = await axios.post(import.meta.env.VITE_URL_REGISTRO, data);
  return response.data;
};
