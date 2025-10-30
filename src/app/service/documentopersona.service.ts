import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoPersona } from '../entity/documentoPersona';

@Injectable({
  providedIn: 'root'
})
export class DocumentoPersonaService {
  private apiUrl = 'http://localhost:8080/api/documentos-persona'; // Ajustada la URL base según el backend

  constructor(private http: HttpClient) { }

  getAllByPersona(idPersona: number): Observable<DocumentoPersona[]> {
    return this.http.get<DocumentoPersona[]>(`${this.apiUrl}/persona/${idPersona}`);
  }

  getById(idTipo: number, idPersona: number): Observable<DocumentoPersona> {
    return this.http.get<DocumentoPersona>(`${this.apiUrl}/${idTipo}/${idPersona}`);
  }

  create(documento: DocumentoPersona): Observable<DocumentoPersona> {
    return this.http.post<DocumentoPersona>(`${this.apiUrl}/crear`, documento);
  }

  update(idTipo: number, idPersona: number, documento: DocumentoPersona): Observable<DocumentoPersona> {
    return this.http.put<DocumentoPersona>(`${this.apiUrl}/${idTipo}/${idPersona}`, documento);
  }

  delete(idTipo: number, idPersona: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idTipo}/${idPersona}`);
  }
}
