import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({providedIn: 'root'})
export class CambiarpasswordService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

   obtenerPregunta(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/preguntaseguridad/${idUsuario}`);
  }

  cambiarPassword(payload: { idUsuario: string, respuestaSeguridad: string, nuevaPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiarcontrasena`, payload);
  }

}
