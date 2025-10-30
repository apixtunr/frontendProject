import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Interfaces para la consulta de saldos
export interface ConsultaSaldoRequest {
  idCliente?: number;
  idCuenta?: number;
  nombre?: string;
  apellido?: string;
}

// Interface que coincide con la entidad del backend
export interface SaldoCuentaEntity {
  idsaldocuenta: number;
  idpersona: number;
  idstatuscuenta?: number;
  idtiposaldocuenta?: number;
  saldoanterior?: number;
  debitos?: number;
  creditos?: number;
  fechacreacion?: string;
  usuariocreacion?: string;
  fechamodificacion?: string;
  usuariomodificacion?: string;
}

export interface DetalleSaldoDto {
  idCuenta: number;
  idPersona: number;
  nombreCompleto: string;
  nombreTipoSaldo: string;
  saldoInicial: number;
  debitos: number; // Cargos
  creditos: number; // Abonos
  saldoFinal: number; // SaldoActual = SaldoInicial + Debitos - Creditos
  fechaUltimaActualizacion: string;
  estado: string;
}

export interface ResultadoConsultaDto {
  persona: {
    idPersona: number;
    nombreCompleto: string;
  };
  cuentas: DetalleSaldoDto[];
  totalSaldos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaSaldoService {
  private apiBase = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Consultar saldo por ID de cliente
  consultarPorIdCliente(idCliente: number): Observable<SaldoCuentaEntity[]> {
    return this.http.get<SaldoCuentaEntity[]>(`${this.apiBase}/saldo-cuentas/persona/${idCliente}`);
  }

  // Consultar saldo por ID de cuenta específica
  consultarPorIdCuenta(idCuenta: number): Observable<SaldoCuentaEntity> {
    return this.http.get<SaldoCuentaEntity>(`${this.apiBase}/saldo-cuentas/${idCuenta}`);
  }

  // Consultar saldo por nombre y apellido
  consultarPorNombreApellido(nombre: string, apellido: string): Observable<SaldoCuentaEntity[]> {
    return this.http.get<SaldoCuentaEntity[]>(`${this.apiBase}/saldo-cuentas/consultar-por-nombre`, 
      { params: { nombre, apellido } }
    ).pipe(
      map(res => res || [])
    );
  }

  // Obtener nombre de persona por ID
  obtenerNombrePersona(idPersona: number): Observable<string> {
    return this.http.get(`http://localhost:8080/${idPersona}`, { responseType: 'text' });
  }

  // Obtener todos los tipos de saldo
  obtenerTiposSaldoCuenta(): Observable<TipoSaldoCuenta[]> {
    return this.http.get<TipoSaldoCuenta[]>(`${this.apiBase}/tipos-saldo-cuenta`);
  }

  // Obtener todos los status de cuenta  
  obtenerStatusCuenta(): Observable<StatusCuenta[]> {
    return this.http.get<StatusCuenta[]>(`${this.apiBase}/statuscuenta`);
  }

  // Método unificado para cualquier tipo de consulta
  consultarSaldo(request: ConsultaSaldoRequest): Observable<any> {
    if (request.idCliente) {
      return this.consultarPorIdCliente(request.idCliente);
    } else if (request.idCuenta) {
      return this.consultarPorIdCuenta(request.idCuenta);
    } else if (request.nombre && request.apellido) {
      return this.consultarPorNombreApellido(request.nombre, request.apellido);
    } else {
      throw new Error('Debe proporcionar al menos un criterio de búsqueda válido');
    }
  }
}

// Interfaces para tipos y status (reutilizadas del servicio de cuenta)
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
