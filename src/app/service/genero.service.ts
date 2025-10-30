import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from '../entity/genero';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeneroService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGeneros(): Observable<Genero[]> {
    return this.http.get<Genero[]>(`${this.apiUrl}/api/list_genero`);
  }

  createGenero(genero: Genero): Observable<Genero> {
    return this.http.post<Genero>(`${this.apiUrl}/api/create_genero`, genero);
  }

  updateGenero(idGenero: number, genero: Genero): Observable<Genero> {
    return this.http.put<Genero>(`${this.apiUrl}/api/update_genero/${idGenero}`, genero);
  }

  deleteGenero(idGenero: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_genero/${idGenero}`);
  }
}