import axios from "axios";

const API_ORDEN = import.meta.env.VITE_URL_ORDEN;

export interface OrdenDetalleRequest {
  productoId: number;
  cantidad: number;
}

export interface OrdenRequest {
  usuario: { id: number };
  direccionEnvio: { id: number };
  total: number;
  detalles: {
    producto: { id: number };
    cantidad: number;
  }[];
}

export const confirmarOrden = async (orden: OrdenRequest) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${API_ORDEN}`, orden, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const getOrdenesPorUsuario = async (id: number) => {
  const token = localStorage.getItem("token");
  const url = `${API_ORDEN}/usuario/${id}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
