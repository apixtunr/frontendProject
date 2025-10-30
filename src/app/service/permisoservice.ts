import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolOpcion } from '../entity/rolopcion';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080';

  getPermisos(idOpcion: number, idRole: number): Observable<RolOpcion | undefined> {
    return this.http.get<RolOpcion[]>(`${this.apiUrl}/roleopcion/permisos/${idRole}`).pipe(
      map((permisos: RolOpcion[]) => permisos.find(p => p.id.idOpcion === idOpcion))
    );
  }
}