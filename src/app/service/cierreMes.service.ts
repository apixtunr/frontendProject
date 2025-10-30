import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// La interfaz CierreMesResponse sigue siendo útil si tu backend *eventualmente*
// envía un JSON. Pero para esta API, estamos tratando un string.
// Si el backend SIEMPRE envía solo un string, puedes eliminar esta interfaz
// y simplemente usar Observable<string>. Por ahora la mantenemos pero la ignoramos.
export interface CierreMesResponse {
  mensaje: string;
  fechaCierre?: string;
  estado?: 'EXITOSO' | 'FALLIDO';
}

@Injectable({
  providedIn: 'root'
})
export class CierreMesService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  cerrarMes(nombreUsuario: string): Observable<string> { // <--- CAMBIO CLAVE AQUÍ: Observable<string>
    let params = new HttpParams().set('usuario', nombreUsuario);

    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json' // Esto solo aplica a lo que ENVIAS, no a lo que recibes.
                                            // No es estrictamente necesario para GETs o POSTs con body vacío.
      }),
      params: params,
      responseType: 'text' as 'json' // <--- CAMBIO CLAVE AQUÍ: responseType: 'text'
    };

    // Cambia el tipo genérico de post a Observable<string> para que Angular sepa que esperamos un string
    return this.http.post<string>(`${this.apiUrl}/api/cierre-mes`, {}, httpOptions); // <--- CAMBIO CLAVE AQUÍ: post<string>
  }
}