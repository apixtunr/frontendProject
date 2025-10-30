export interface Genero {
  idgenero: number;
  nombre: string;
  fechaCreacion: Date | string; // Permitir tanto Date como string
  usuarioCreacion: string;
  fechaModificacion?: Date | string | undefined; // Permitir tanto Date como string, opcional
  usuarioModificacion?: string | undefined; // Opcional
}