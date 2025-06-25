import { create } from "zustand";
import { IDetalle } from "../types/detalles/IDetalle";

interface IDetalleStore {
  detalle: IDetalle[];
  detalleActivo: IDetalle | null;
  setDetalle: (detalle: IDetalle[]) => void;
  setDetalleActivo: (detalleActivo: IDetalle | null) => void;
}

export const detalleStore = create<IDetalleStore>((set) => ({
  detalle: [],
  detalleActivo: null,
  setDetalle: (detalle) => set(() => ({ detalle })),
  setDetalleActivo: (detalleActivo) => set(() => ({ detalleActivo })),
}));
