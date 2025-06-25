import axios, { AxiosResponse } from "axios";
import { IImagen } from "../types/IImagen";

const imagenService = import.meta.env.VITE_URL_IMAGEN;

export class ServiceImagen {
  private baseURL: string;

  constructor() {
    this.baseURL = imagenService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async crearImagen(imagen: IImagen): Promise<IImagen> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<IImagen> = await axios.post(url, imagen, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async obtenerImagenPorDetalle(imagenId: number): Promise<IImagen[]> {
    const url = `${this.baseURL}/detalle/${imagenId}`;
    const response: AxiosResponse<IImagen[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarImagen(id: number): Promise<IImagen> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<IImagen> = await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}
