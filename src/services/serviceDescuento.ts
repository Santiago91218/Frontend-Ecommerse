import axios, { AxiosResponse } from "axios";
import { IDescuento } from "../types/IDescuento";

const descuentoService = import.meta.env.VITE_URL_DESCUENTO;

export class ServiceDescuento {
  private baseURL: string;

  constructor() {
    this.baseURL = descuentoService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async crearDescuento(descuento: IDescuento): Promise<IDescuento> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<IDescuento> = await axios.post(
      url,
      descuento,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  public async editarDescuento(descuento: IDescuento): Promise<IDescuento> {
    const url = `${this.baseURL}/${descuento.id}`;
    const response: AxiosResponse<IDescuento> = await axios.put(
      url,
      descuento,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }
}
