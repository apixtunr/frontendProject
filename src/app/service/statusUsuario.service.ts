import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusUsuario } from '../entity/statusUsuario';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatusUsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStatusUsuarios(): Observable<StatusUsuario[]> {
    return this.http.get<StatusUsuario[]>(`${this.apiUrl}/api/list_estatus_usuario`);
  }

  createStatusUsuario(statusUsuario: StatusUsuario): Observable<StatusUsuario> {
    return this.http.post<StatusUsuario>(`${this.apiUrl}/api/create_estatus_usuario`, statusUsuario);
  }

  updateStatusUsuario(idStatusUsuario: number, statusUsuario: StatusUsuario): Observable<StatusUsuario> {
    return this.http.put<StatusUsuario>(`${this.apiUrl}/api/update_estatus_usuario/${idStatusUsuario}`, statusUsuario);
  }

  deleteStatusUsuario(idStatusUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_estatus_usuario/${idStatusUsuario}`);
  }
}