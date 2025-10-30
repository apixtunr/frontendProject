export interface TipoDocumento {
  idTipoDocumento?: number | null;
  nombre: string;
  fechaCreacion: Date | null;
  usuarioCreacion: string | null;
  fechaModificacion: Date | null;
  usuarioModificacion: string | null;
}
