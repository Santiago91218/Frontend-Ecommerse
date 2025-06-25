import axios, { AxiosResponse } from "axios";
import { IPrecio } from "../types/IPrecio";

const precioService = import.meta.env.VITE_URL_PRECIO;

export class ServicePrecio {
  private baseURL: string;

  constructor() {
    this.baseURL = precioService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async crearPrecio(precio: IPrecio): Promise<IPrecio> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<IPrecio> = await axios.post(url, precio, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
  public async editarPrecio(precio: IPrecio): Promise<IPrecio> {
    const url = `${this.baseURL}/${precio.id}`;
    const response: AxiosResponse<IPrecio> = await axios.put(url, precio, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}
