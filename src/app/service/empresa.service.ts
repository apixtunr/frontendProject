import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../entity/empresa';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
	private apiUrl = 'http://localhost:8080';

	constructor(private http: HttpClient) {}

	getEmpresas(): Observable<Empresa[]> {
		return this.http.get<Empresa[]>(this.apiUrl + '/api/list_empresa');
	}

  deleteEmpresa(nit: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_empresa/${nit}`);
  }

  updateEmpresa(empresa: Empresa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/update_empresa/${empresa.nit}`, empresa);
  }

  createEmpresa(empresa: Omit<Empresa, 'idEmpresa'>): Observable<Empresa> {
  return this.http.post<Empresa>(`${this.apiUrl}/api/create_empresa`, empresa);
}

}
