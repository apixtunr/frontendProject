import { TipoCuenta } from './../entity/tipoCuenta';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoCuentaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTiposCuenta(): Observable<TipoCuenta[]> {
    return this.http.get<TipoCuenta[]>(`${this.apiUrl}/api/list_tipo_cuenta`);
  }

  createTipoCuenta(tipoCuenta: TipoCuenta): Observable<TipoCuenta> {
    return this.http.post<TipoCuenta>(`${this.apiUrl}/api/create_tipo_cuenta`, tipoCuenta);
  }

  updateTipoCuenta(tipoCuenta: TipoCuenta): Observable<TipoCuenta> {
    return this.http.put<TipoCuenta>(
      `${this.apiUrl}/api/update_tipo_cuenta/${tipoCuenta.idTipoCuenta}`,
      tipoCuenta
    );
  }

  deleteTipoCuenta(idTipoCuenta: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_tipo_cuenta/${idTipoCuenta}`);
  }
}
