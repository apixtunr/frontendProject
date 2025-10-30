import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../entity/role';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl + '/api/list_role');
  }

  // Eliminar un rol
  deleteRole(idRole: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_role/${idRole}`);
  }

  // Actualizar un rol
  updateRole(role: Role): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/update_role/${role.idRole}`, role);
  }

  // Crear un rol
  createRole(role: Role): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/create_role`, role);
  }

  // Buscar un rol por ID
  getRoleById(idRole: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/api/get_role/${idRole}`);
  }
}
