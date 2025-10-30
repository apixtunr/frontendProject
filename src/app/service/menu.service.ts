import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../entity/menu';

// src/app/services/estructura-menu.service.ts

@Injectable({ providedIn: 'root' })
export class EstructuraMenuService {
  private apiUrl = 'http://localhost:8080/api/estructura_menu';

  constructor(private http: HttpClient) {}

  getEstructuraMenu(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
