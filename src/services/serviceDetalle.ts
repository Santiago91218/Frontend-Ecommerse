import axios, { AxiosResponse } from "axios";
import { IDetalle } from "../types/detalles/IDetalle";
import { IDetalleDTO } from "../types/detalles/IDetalleDTO";
const detalleService = import.meta.env.VITE_URL_DETALLE;

export class ServiceDetalle {
  private baseURL: string;

  constructor() {
    this.baseURL = detalleService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getDetalleById(idDetalle: number) {
    const url = `${this.baseURL}/${idDetalle}`;
    const response = await axios.get(url);

    return response.data;
  }

  public async getDetalles() {
    const url = `${this.baseURL}`;
    const response = await axios.get(url);
    return response.data;
  }

  public async getDetallesDTO() {
    const url = `${this.baseURL}/DTO`;
    const response = await axios.get(url);
    return response.data;
  }

  public async getDetallesGeneroProduct(
    generoProduct: string
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseURL}/genero-producto?generoProducto=${generoProduct}`;
    const response = await axios.get(url);

    return response.data;
  }

  public async getProductosRelacionados(
    tipoProducto: string,
    generoProduct: string,
    id: number
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseURL}/relacionados?tipo=${tipoProducto}&genero=${generoProduct}&id=${id}`;
    const response = await axios.get(url);
    return response.data;
  }

  public async getProductosDestacados(): Promise<IDetalleDTO[]> {
    const url = `${this.baseURL}/destacados`;
    const response = await axios.get(url);
    return response.data;
  }

  public async getDetallesPorProducto(productoId: number): Promise<IDetalle[]> {
    const url = `${this.baseURL}/${productoId}/detalles`;
    const response = await axios.get(url);

    return response.data;
  }

  public async crearDetalle(detalle: any): Promise<AxiosResponse<any>> {
    const url = `${this.baseURL}`;
    const response = await axios.post(url, detalle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarDetalle(
    id: number,
    detalle: any
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseURL}/${id}`;
    const response = await axios.put(url, detalle, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarDetalle(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
