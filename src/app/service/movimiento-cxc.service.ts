import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoMovimientoCxcDto } from '../entity/tipo-movimiento-cxc.dto';
import { PersonaDto } from '../entity/persona.dto';
import { CuentaDto } from '../entity/cuenta.dto';
import { RegistroMovimientoRequest } from '../entity/registro-movimiento.request';
import { RegistroMovimientoResponse } from '../entity/registro-movimiento.response';

@Injectable({
  providedIn: 'root'
})
export class MovimientoCxcService {
  private baseUrl = 'http://localhost:8080/api'; // ❌ Quita el /v1

  constructor(private http: HttpClient) { }

  getTiposMovimientoCxc(): Observable<TipoMovimientoCxcDto[]> {
    return this.http.get<TipoMovimientoCxcDto[]>(`${this.baseUrl}/v1/tipo-movimiento-cxc`);
  }

  getPersonas(): Observable<PersonaDto[]> {
    // ✅ Ahora llama correctamente a /api/personas/simple
    return this.http.get<PersonaDto[]>(`${this.baseUrl}/personas/simple`);
  }

  getCuentasPorPersona(idPersona: number): Observable<CuentaDto[]> {
    // ✅ Corrige también este endpoint
    return this.http.get<CuentaDto[]>(`${this.baseUrl}/personas/${idPersona}/cuentas`);
  }

  registrarMovimiento(request: RegistroMovimientoRequest): Observable<RegistroMovimientoResponse> {
    return this.http.post<RegistroMovimientoResponse>(`${this.baseUrl}/v1/movimientos-cuenta`, request);
  }
}
