import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CuentaDto {
  idsaldocuenta: number;
  idpersona: number;
  idsucursal?: number;
  idtiposaldocuenta?: number;
  idstatuscuenta?: number;
  saldoanterior?: number;
  debitos?: number;
  creditos?: number;
  fechacreacion?: string;
  usuariocreacion?: string;
  fechamodificacion?: string;
}

export interface CreateCuentaRequest {
  idpersona: number;
  idstatuscuenta: number; // Long en backend, pero JavaScript maneja como number
  idtiposaldocuenta: number;
  saldoanterior?: number; // BigDecimal en backend
  debitos?: number; // BigDecimal en backend  
  creditos?: number; // BigDecimal en backend
  fechacreacion?: string; // Date en backend, se envía como ISO string
  usuariocreacion?: string;
}

export interface DocumentoPersona {
  idtipodocumento: number;
  idpersona: number;
  nodocumento?: string;
  nombreTipoDocumento?: string;
  fechacreacion?: string;
  usuariocreacion?: string;
  fechamodificacion?: string;
  usuariomodificacion?: string;
}

export interface TipoSaldoCuenta {
  idtiposaldocuenta: number;
  nombre: string;
  fechacreacion: string;
  usuariocreacion: string;
  fechamodificacion?: string;
  usuariomodificacion?: string;
}

export interface StatusCuenta {
  idstatuscuenta: number;
  nombre: string;
  fechacreacion: string;
  usuariocreacion: string;
  fechamodificacion?: string;
  usuariomodificacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiBase = 'http://localhost:8080/api';
  private base = `${this.apiBase}/saldo-cuentas`;

  constructor(private http: HttpClient) { }

  // Método para obtener nombre completo de persona por ID
  obtenerNombrePersonaPorId(idPersona: number): Observable<string> {
    return this.http.get(`http://localhost:8080/${idPersona}`, { responseType: 'text' });
  }

  // Método para obtener documentos de una persona
  obtenerDocumentosPersona(idPersona: number): Observable<DocumentoPersona[]> {
    return this.http.get<DocumentoPersona[]>(`${this.apiBase}/documentos-persona/persona/${idPersona}`);
  }

  // Métodos adicionales para gestión de cuentas
  listByPersona(idPersona: number): Observable<CuentaDto[]> {
    return this.http.get<CuentaDto[]>(`${this.base}/persona/${idPersona}`);
  }

  getById(id: number): Observable<CuentaDto> {
    return this.http.get<CuentaDto>(`${this.base}/${id}`);
  }

  calcularSaldo(id: number): Observable<{ saldoActual: number }> {
    return this.http.get<{ saldoActual: number }>(`${this.base}/${id}/calcular`);
  }

  // Crear nueva cuenta
  createCuenta(cuenta: CreateCuentaRequest): Observable<CuentaDto> {
    return this.http.post<CuentaDto>(this.base, cuenta);
  }

  // Listar todas las cuentas
  listAllCuentas(): Observable<CuentaDto[]> {
    return this.http.get<CuentaDto[]>(this.base);
  }

  // Actualizar cuenta
  updateCuenta(id: number, cuenta: CreateCuentaRequest): Observable<CuentaDto> {
    return this.http.put<CuentaDto>(`${this.base}/${id}`, cuenta);
  }

  // Eliminar cuenta
  deleteCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Recalcular saldo (persistir cambios)
  recalcularSaldo(id: number, usuario?: string): Observable<CuentaDto> {
    const params = usuario ? `?usuario=${usuario}` : '';
    return this.http.post<CuentaDto>(`${this.base}/${id}/recalcular${params}`, {});
  }

  // Obtener documentos de una persona
  getDocumentosByPersona(idPersona: number): Observable<DocumentoPersona[]> {
    return this.http.get<DocumentoPersona[]>(`${this.apiBase}/documentos-persona/persona/${idPersona}`);
  }

  // Obtener tipos de saldo cuenta desde la base de datos
  getTiposSaldoCuenta(): Observable<TipoSaldoCuenta[]> {
    return this.http.get<TipoSaldoCuenta[]>(`${this.apiBase}/tipos-saldo-cuenta`);
  }

  // Obtener status de cuenta desde la base de datos
  getStatusCuenta(): Observable<StatusCuenta[]> {
    return this.http.get<StatusCuenta[]>(`http://localhost:8080/api/statuscuenta`);
  }
}
