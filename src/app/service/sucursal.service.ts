import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../entity/sucursal';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SucursalService {
	private apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getSucursales(): Observable<Sucursal[]> {
		return this.http.get<Sucursal[]>(this.apiUrl + '/api/list_sucursal');
	}

  deleteSucursal(idSucursal: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/delete_sucursal/${idSucursal}`);
  }

  updateSucursal(sucursal: Sucursal): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/update_sucursal/${sucursal.idSucursal}`, sucursal);
  }

  createSucursal(sucursal: Sucursal): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/create_sucursal`, sucursal);
  }
}
