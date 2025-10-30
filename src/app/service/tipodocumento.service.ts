import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../entity/tipoDocumento';

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ===== TIPOS DE DOCUMENTO =====
  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.apiUrl + '/api/list_tipo_documento');
  }

  createTipoDocumento(tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(`${this.apiUrl}/api/create_tipo_documento`, tipoDocumento);
  }

  updateTipoDocumento(idTipoDocumento: number, tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.put<TipoDocumento>(
      `${this.apiUrl}/api/update_tipo_documento/${idTipoDocumento}`,
      tipoDocumento
    );
  }

  deleteTipoDocumento(idTipoDocumento: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/delete_tipo_documento/${idTipoDocumento}`
    );
  }
}