import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoCivil } from '../entity/estadoCivil';

@Injectable({ providedIn: 'root' })
export class EstadoCivilService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getEstadosCiviles(): Observable<EstadoCivil[]> {
    return this.http.get<EstadoCivil[]>(`${this.apiUrl}/api/list_estado_civil`);
  }

  createEstadoCivil(estadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.http.post<EstadoCivil>(
      `${this.apiUrl}/api/create_estado_civil`,
      estadoCivil
    );
  }

  updateEstadoCivil(estadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.http.put<EstadoCivil>(
      `${this.apiUrl}/api/update_estado_civil/${estadoCivil.idEstadoCivil}`,
      estadoCivil
    );
  }

  deleteEstadoCivil(idEstadoCivil: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/delete_estado_civil/${idEstadoCivil}`
    );
  }
}
