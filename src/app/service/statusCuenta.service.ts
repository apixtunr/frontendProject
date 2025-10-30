import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StatusCuenta } from '../entity/statusCuenta';

@Injectable({
  providedIn: 'root'
})
export class StatusCuentaService {
  private apiUrl = 'http://localhost:8080/api/statuscuenta';

  constructor(private http: HttpClient) {}

  getStatusCuentas(): Observable<StatusCuenta[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(items => {
        console.log('Status cuentas raw del backend:', items);
        const mapped = items.map(item => {
          const result = this.fromApi(item);
          console.log('Mapeo:', item, '->', result);
          return result;
        });
        console.log('Status cuentas mapeados:', mapped);
        return mapped;
      })
    );
  }

  getStatusCuenta(id: number): Observable<StatusCuenta> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(item => this.fromApi(item)));
  }

  createStatusCuenta(model: StatusCuenta): Observable<StatusCuenta> {
    const apiObj = this.toApi(model);
    return this.http.post<any>(`${this.apiUrl}/crear`, apiObj).pipe(map(item => this.fromApi(item)));
  }

  updateStatusCuenta(model: StatusCuenta): Observable<StatusCuenta> {
    const apiObj = this.toApi(model);
    return this.http.put<any>(`${this.apiUrl}/${model.idStatusCuenta}`, apiObj).pipe(map(item => this.fromApi(item)));
  }

  deleteStatusCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- Helpers para mapear entre API <-> Frontend model ---
  private fromApi(apiObj: any): StatusCuenta {
    return {
      idStatusCuenta: apiObj?.idstatuscuenta ?? apiObj?.idStatusCuenta ?? 0,
      descripcion: apiObj?.nombre ?? apiObj?.descripcion ?? '',
      fechaCreacion: apiObj?.fechacreacion ?? apiObj?.fechaCreacion ?? '',
      usuarioCreacion: apiObj?.usuariocreacion ?? apiObj?.usuarioCreacion ?? '',
      fechaModificacion: apiObj?.fechamodificacion ?? apiObj?.fechaModificacion ?? '',
      usuarioModificacion: apiObj?.usuariomodificacion ?? apiObj?.usuarioModificacion ?? ''
    };
  }

  private toApi(model: StatusCuenta): any {
    return {
      idstatuscuenta: model.idStatusCuenta || undefined,
      nombre: model.descripcion,
      fechacreacion: model.fechaCreacion,
      usuariocreacion: model.usuarioCreacion,
      fechamodificacion: model.fechaModificacion,
      usuariomodificacion: model.usuarioModificacion
    };
  }
}
