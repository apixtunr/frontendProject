import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../entity/persona';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===== PERSONAS =====
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl + '/api/list_persona');
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/api/create_persona`, persona);
  }


  updatePersona(idPersona: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(
      `${this.apiUrl}/api/update_persona/${idPersona}`,
      persona
    );
  }

  deletePersona(idPersona: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/delete_persona/${idPersona}`
    );
  }

}
