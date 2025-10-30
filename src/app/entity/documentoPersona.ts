export interface DocumentoPersona {
  idtipodocumento: number;
  idpersona: number;
  nodocumento: string;
  nombreTipoDocumento?: string; // opcional, para mostrar en la tabla
  fechacreacion: string;
  usuariocreacion: string;
  fechamodificacion?: string;
  usuariomodificacion?: string;
}
