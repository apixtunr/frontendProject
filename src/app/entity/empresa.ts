export interface Empresa {
  idEmpresa?: number;
  nombre: string;
  direccion: string;
  nit: string;
  passwordCantidadMayusculas: number;
  passwordCantidadMinusculas: number;
  passwordCantidadCaracteresEspeciales: number;
  passwordCantidadCaducidadDias: number;
  passwordLargo: number;
  passwordIntentosAntesDeBloquear: number;
  passwordCantidadNumeros: number;
  passwordCantidadPreguntasValidar: number;
  fechaCreacion: string | null;
  usuarioCreacion: string | null;
  fechaModificacion: string | null;
  usuarioModificacion: string | null;
}


