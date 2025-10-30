export interface RegistroMovimientoRequest {
  idPersona: number;
  idSldCuenta: number; // Este será el idSaldoCuenta de tu CuentaDto
  idTM: number;       // Este será el idTipoMovimientoCxc de tu TipoMovimientoCxcDto
  fecha: string;
  monto: number;
  descripcion: string;
  user: string;
}