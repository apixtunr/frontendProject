import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../entity/usuario';
import { Router } from '@angular/router';

@Component({
    selector: 'app-listusuarios',
    templateUrl: './listusuarios.component.html',
    styleUrls: ['./listusuarios.component.css'],
    standalone: false
})
export class ListusuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  error = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  //Método para redirigir a modulo de empresas
  onEmpresas() {
    this.router.navigate(['/crudempresas']);
  }

  //Método para redirigir a modulo de usuarios
  onUsuarios() {
    this.router.navigate(['/crudusuarios']);
  }

  //Método para redirigir a modulo de sucursales
  onSucursales() {
    this.router.navigate(['/crudsucursales']);
  }

  onRole() {
    this.router.navigate(['/crudrole']);
  }

  onOpcion() {
    this.router.navigate(['/opcion']);
  }
}
