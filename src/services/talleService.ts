import axios, { AxiosResponse } from "axios";
import { ITalle } from "../types/ITalle";

const talleService = import.meta.env.VITE_URL_TALLE;

export class ServiceTalle {
  private baseURL: string;

  constructor() {
    this.baseURL = talleService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getTalles(): Promise<ITalle[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<ITalle[]> = await axios.get(url);
    return response.data;
  }

  public async getTalleById(id: number): Promise<ITalle> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ITalle> = await axios.get(url);
    return response.data;
  }

  public async crearTalle(talle: ITalle): Promise<ITalle> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<ITalle> = await axios.post(url, talle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarTalle(id: number, talle: ITalle): Promise<ITalle> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ITalle> = await axios.put(url, talle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarTalle(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
