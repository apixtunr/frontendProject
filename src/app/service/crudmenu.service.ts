import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../entity/menu';

@Injectable({ providedIn: 'root' })
export class CrudmenuService {
	private apiUrl = 'http://localhost:8080/api';

	constructor(private http: HttpClient) {}

	getMenus(): Observable<Menu[]> {
		return this.http.get<Menu[]>(`${this.apiUrl}/list_menu`);
	}

	createMenu(menu: Menu): Observable<Menu> {
		return this.http.post<Menu>(`${this.apiUrl}/create_menu`, menu);
	}

	updateMenu(id: number, menu: Menu): Observable<Menu> {
		return this.http.put<Menu>(`${this.apiUrl}/update_menu/${id}`, menu);
	}

	deleteMenu(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/delete_menu/${id}`);
	}
}
