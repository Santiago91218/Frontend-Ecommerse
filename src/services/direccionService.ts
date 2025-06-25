import axios from "axios";
import { IDireccion } from "../types/IDireccion";

const API_URL = `${import.meta.env.VITE_URL_BACKEND}`;

type DireccionParaCrear = Omit<IDireccion, "id" | "usuarios"> & {
  usuario: { id: number };
};

export const getDireccionesPorUsuario = async (
  usuarioId: number
): Promise<IDireccion[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/usuarios/${usuarioId}/direcciones`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const crearDireccion = async (
  direccion: DireccionParaCrear
): Promise<IDireccion> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/direcciones`, direccion, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
