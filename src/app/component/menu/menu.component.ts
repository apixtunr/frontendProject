import { Component, OnInit } from '@angular/core';
import { EstructuraMenuService } from '../../service/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  estructuraMenu: any[] = [];
  usuarioActual: any = null;

  // Variables para controlar el estado de los menús
  moduloAbierto: number | null = null;
  menuAbierto: number | null = null;

  constructor(
    private estructuraMenuService: EstructuraMenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.cargarEstructuraMenu();
  }

  obtenerUsuarioActual(): void {
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      this.usuarioActual = JSON.parse(usuarioStorage);
      console.log('Usuario actual:', this.usuarioActual);
    } else {
      this.router.navigate(['/loginusuarios']);
    }
  }

  cargarEstructuraMenu(): void {
    this.estructuraMenuService.getEstructuraMenu().subscribe(data => {
      this.estructuraMenu = data;
    });
  }

  // Obtener solo el módulo de Seguridad (idModulo = 1)
  getModuloSeguridad(): any {
    return this.estructuraMenu.find(modulo => modulo.idModulo === 1);
  }

  // Verificar permisos para opciones
  puedeVerOpcion(opcion: any, idMenu: number): boolean {
    if (!this.usuarioActual) return false;

    const rolUsuario = this.usuarioActual.rol || this.usuarioActual.idrole;

    // Si el menú es "Acciones" (idMenu = 2), solo admin (rol = 1) puede ver
    if (idMenu === 2) {
      return rolUsuario === 1;
    }

    return true;
  }

  // Obtener opciones visibles para un menú
  getOpcionesVisibles(menu: any): any[] {
    if (!menu.opciones) return [];
    return menu.opciones.filter((opcion: any) => this.puedeVerOpcion(opcion, menu.idMenu));
  }

  toggleModulo(idModulo: number): void {
    this.moduloAbierto = this.moduloAbierto === idModulo ? null : idModulo;
    this.menuAbierto = null;
  }

  toggleMenu(idMenu: number): void {
    this.menuAbierto = this.menuAbierto === idMenu ? null : idMenu;
  }

  logout(): void {
    localStorage.removeItem("usuario");
    this.router.navigate(['/loginusuarios']);
  }

  // Verificar si es admin
  esAdmin(): boolean {
    const rolUsuario = this.usuarioActual?.rol || this.usuarioActual?.idrole;
    return rolUsuario === 1;
  }
}
