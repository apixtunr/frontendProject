import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../entity/usuario';
import { RolOpcion } from '../entity/rolopcion';
import { Role } from '../entity/role';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl + '/api/list_usuario');
  }

  deleteUsuario(idUsuario: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/delete_usuario/${idUsuario}`
    );
  }

  updateUsuario(idUsuario: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.apiUrl}/api/update_usuario/${usuario.idUsuario}`,
      usuario
    );
  }

  createUsuario(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/create_usuario`, usuario);
  }

  login(usuario: Usuario): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    // El backend retorna un objeto { success, message, usuario }
    return this.http.post<any>(
      this.apiUrl + '/api/login',
      usuario,
      httpOptions
    );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl + '/api/list_role');
  }

  actualizarRolUsuario(idUsuario: string, idRol: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/usuario/${idUsuario}/rol`,
      idRol,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
