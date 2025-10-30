import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      return true;
    } else {
      return this.router.parseUrl('/loginusuarios');
    }
  }
}
