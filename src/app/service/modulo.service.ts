import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../entity/modulo';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Obtener todos los módulos
  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/api/list_modulo`);
  }

  // Crear un módulo
  createModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(`${this.apiUrl}/api/create_modulo`, modulo);
  }

  // Actualizar un módulo
  updateModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/api/update_modulo/${modulo.idModulo}`, modulo);
  }

  // Eliminar un módulo
  deleteModulo(idModulo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_modulo/${idModulo}`);
  }

  // Obtener un módulo por ID (opcional, útil para editar)
  getModuloById(idModulo: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/api/modulo/${idModulo}`);
  }
}
