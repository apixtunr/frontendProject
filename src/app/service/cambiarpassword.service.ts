import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class CambiarpasswordService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

   obtenerPregunta(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preguntaseguridad/${idUsuario}`);
  }

  cambiarPassword(payload: { idUsuario: string, respuestaSeguridad: string, nuevaPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiarcontrasena`, payload);
  }

}
