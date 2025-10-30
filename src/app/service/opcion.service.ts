import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Opcion } from '../entity/opcion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionService {
  private apiBase = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}


  getOpciones(): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${this.apiBase}/list_opcion`);
  }

  createOpcion(opcion: Opcion): Observable<Opcion> {
    return this.http.post<Opcion>(`${this.apiBase}/create_opcion`, opcion);
  }

  updateOpcion(id: number, opcion: Opcion): Observable<Opcion> {
    return this.http.put<Opcion>(`${this.apiBase}/update_opcion/${id}`, opcion);
  }

  deleteOpcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/delete_opcion/${id}`);
  }

  getOpcionesPorMenu(idMenu: number): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${this.apiBase}/opciones_por_menu/${idMenu}`);
  }

  createOpcionDTO(opcion: Opcion): Observable<Opcion> {
    return this.http.post<Opcion>(`${this.apiBase}/create_opcion_dto`, opcion);
  }

  updateOpcionDTO(id: number, opcion: Opcion): Observable<Opcion> {
    return this.http.put<Opcion>(`${this.apiBase}/update_opcion_dto/${id}`, opcion);
  }
}
