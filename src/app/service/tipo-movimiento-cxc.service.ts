import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { TipoMovimientoCxc } from "../entity/tipo-movimiento-cxc";

@Injectable({
  providedIn: "root",
})
export class TipoMovimientoCxcService {
  private apiUrl = "http://localhost:8080/api/tipo-movimiento-cxc";

  constructor(private http: HttpClient) {}

  getTiposMovimientoCxc(): Observable<TipoMovimientoCxc[]> {
    // El backend devuelve objetos con la propiedad `id`. Mapeamos a `idTipoMovimientoCxc` para la UI.
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(items => items.map(item => this.fromApi(item)))
    );
  }

  getTipoMovimientoCxc(id: number): Observable<TipoMovimientoCxc> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(item => this.fromApi(item)));
  }

  createTipoMovimientoCxc(tipoMovimiento: TipoMovimientoCxc): Observable<TipoMovimientoCxc> {
    const apiObj = this.toApi(tipoMovimiento);
    return this.http.post<any>(`${this.apiUrl}/crear`, apiObj).pipe(map(item => this.fromApi(item)));
  }

  updateTipoMovimientoCxc(tipoMovimiento: TipoMovimientoCxc): Observable<TipoMovimientoCxc> {
    const apiObj = this.toApi(tipoMovimiento);
    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${tipoMovimiento.idTipoMovimientoCxc}`,
      apiObj
    ).pipe(map(item => this.fromApi(item)));
  }

  deleteTipoMovimientoCxc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  // --- Helpers para mapear entre API <-> Frontend model ---
  private fromApi(apiObj: any): TipoMovimientoCxc {
    return {
      idTipoMovimientoCxc: apiObj?.id ?? apiObj?.idTipoMovimientoCxc ?? 0,
      nombre: apiObj?.nombre ?? '',
      operacionCuentaCorriente: apiObj?.operacionCuentaCorriente ?? 1,
      fechaCreacion: apiObj?.fechaCreacion ?? apiObj?.fechacreacion ?? '',
      usuarioCreacion: apiObj?.usuarioCreacion ?? apiObj?.usuariocreacion ?? '',
      fechaModificacion: apiObj?.fechaModificacion ?? apiObj?.fechamodificacion ?? '',
      usuarioModificacion: apiObj?.usuarioModificacion ?? apiObj?.usuariomodificacion ?? ''
    };
  }

  private toApi(model: TipoMovimientoCxc): any {
    return {
      id: model.idTipoMovimientoCxc || undefined,
      nombre: model.nombre,
      operacionCuentaCorriente: model.operacionCuentaCorriente,
      fechaCreacion: model.fechaCreacion,
      usuarioCreacion: model.usuarioCreacion,
      fechaModificacion: model.fechaModificacion,
      usuarioModificacion: model.usuarioModificacion
    };
  }
}
