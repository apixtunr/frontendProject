import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoPersona } from '../entity/documentoPersona';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoPersonaService {
  private apiUrl = `${environment.apiUrl}/api/documentos-persona`; // Ajustada la URL base según el backend

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
