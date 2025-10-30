import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolOpcion, RolOpcionDTO } from '../entity/rolopcion';
import { Opcion } from '../entity/opcion';


@Injectable({ providedIn: 'root' })
export class RolOpcionService {
  private apiUrl = 'http://localhost:8080/roleopcion';

  constructor(private http: HttpClient) {}

  // Obtener permisos actuales por idRole
  getPermisosPorRol(idRole: number): Observable<RolOpcion[]> {
    return this.http.get<RolOpcion[]>(`${this.apiUrl}/permisos/${idRole}`);
  }

  // Guardar o actualizar un permiso
  guardarRoleOpcion(roleOpciones: RolOpcionDTO[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/guardar`, roleOpciones);
}
  
  // Obtener todas las opciones
  getOpciones(): Observable<Opcion[]> {
    return this.http.get<Opcion[]>('http://localhost:8080/opcion/list');
  }
}