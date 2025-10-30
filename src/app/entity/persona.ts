export interface Persona {
  idPersona?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string | null;
  idGenero: number;
  direccion: string | null;
  telefono: string | null;
  correoElectronico: string | null;
  idEstadoCivil: number;
  idTipoDocumento?: number;
  numeroDocumento?: string;
  fechaCreacion: string | null;
  usuarioCreacion: string | null;
  fechaModificacion: string | null;
  usuarioModificacion: string | null;
}
