export interface Usuario {
  idUsuario: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  idStatusUsuario: number;
  password: string;
  idGenero: number;
  ultimaFechaIngreso: string;
  intentosDeAcceso: number;
  sesionActual: string;
  ultimaFechaCambioPassword: string;
  correoElectronico: string;
  requiereCambiarPassword: number;
  fotografia: string | null;
  telefonoMovil: string;
  idSucursal: number;
  pregunta: string;
  respuesta: string;
  idRole: number;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}
