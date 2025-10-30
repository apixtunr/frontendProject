export interface RolOpcionId {
  idRole: number;
  idOpcion: number;
}

export interface RolOpcion {
  id: RolOpcionId;
  alta: boolean;
  baja: boolean;
  cambio: boolean;
  imprimir: boolean;
  exportar: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface RolOpcionDTO {
  idRole: number;
  idOpcion: number;
  alta: boolean;
  baja: boolean;
  cambio: boolean;
  imprimir: boolean;
  exportar: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}