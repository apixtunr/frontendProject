import { Component, OnInit } from '@angular/core';
import { Modulo } from '../../entity/modulo';
import { Menu } from '../../entity/menu';
import { ModuloService } from '../../service/modulo.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudmodulo',
  standalone: false,
  templateUrl: './crudmodulo.component.html',
  styleUrls: ['./crudmodulo.component.css'],
})
export class CrudmoduloComponent implements OnInit {
  permisosModulo: RolOpcion | undefined;
  isEditMode: boolean = false;
  loading = true;
  error = '';

  modulos: Modulo[] = [];
  menus: Menu[] = [];

  modulo: Modulo = {
    idModulo: null,
    nombre: '',
    ordenmenu: 0,
    fechacreacion: new Date(),
    usuariocreacion: '',
    fechamodificacion: new Date(),
    usuariomodificacion: '',
  };

  constructor(private moduloService: ModuloService, private permisoService: PermisoService) {}

  ngOnInit(): void {
    // Obtener permisos para módulo (idOpcion=6)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(6, idRole).subscribe(permiso => {
      this.permisosModulo = permiso;
    });
    this.loadModulos();
  }

  // Obtener el siguiente número de orden disponible
  private getNextOrden(): number {
    const ordenes = this.modulos
      .map(m => m.ordenmenu)
      .filter(n => n != null)
      .sort((a, b) => a - b);

    let next = 1;
    for (let ord of ordenes) {
      if (ord === next) {
        next++;
      } else {
        break; // encontramos un hueco
      }
    }
    return next;
  }

  // Cargar todos los módulos
  private loadModulos(): void {
    this.loading = true;
    this.error = '';

    this.moduloService.getModulos().subscribe({
      next: (data) => {
        this.modulos = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar módulos';
        this.loading = false;
      },
    });
  }
  private getUsuarioLogueado(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.nombre || 'system'; // fallback en caso de que no exista
  }
  // Crear o actualizar módulo
  onSubmit(): void {
    this.error = '';

    const payload: Modulo = {
      ...this.modulo,
      fechacreacion: this.modulo.fechacreacion
        ? new Date(this.modulo.fechacreacion)
        : new Date(),
      fechamodificacion: this.modulo.fechamodificacion
        ? new Date(this.modulo.fechamodificacion)
        : null,
    };

    if (payload.idModulo == null) {
      // Crear
      payload.ordenmenu = this.getNextOrden();
      payload.idModulo = null;
      payload.fechacreacion = new Date();
      payload.usuariocreacion = this.getUsuarioLogueado(); // ✅ se toma de localStorage
      payload.fechamodificacion = null;

      this.loading = true;
      this.moduloService.createModulo(payload).subscribe({
        next: () => {
          alert('Módulo creado correctamente.');
          this.onReset();
          this.loadModulos();
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear módulo';
          this.loading = false;
        },
      });
      return;
    }

    // Actualizar
    payload.fechamodificacion = new Date();
    payload.usuariomodificacion = this.getUsuarioLogueado(); // ✅ se toma de localStorage

    this.loading = true;
    this.moduloService.updateModulo(payload).subscribe({
      next: () => {
        alert('Módulo actualizado correctamente.');
        this.onReset();
        this.loadModulos();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al actualizar módulo';
        this.loading = false;
      },
    });
  }

  // Editar módulo
  onEdit(mod: Modulo): void {
    this.modulo = {
      ...mod,
      fechacreacion: mod.fechacreacion ? new Date(mod.fechacreacion) : null,
      fechamodificacion: mod.fechamodificacion
        ? new Date(mod.fechamodificacion)
        : null,
    };
  this.isEditMode = true;
  }

 // Eliminar módulo
onDelete(idModulo: number | null): void {
  this.error = '';
  if (idModulo == null) {
    this.error = 'ID de módulo inválido';
    return;
  }

  if (!confirm('¿Eliminar este módulo?')) return;

  this.loading = true;
  this.moduloService.deleteModulo(idModulo).subscribe({
    next: () => {
      alert('✅ Módulo eliminado correctamente.');
      this.loadModulos();
      this.loading = false;
    },
    error: (err) => {
      const errorMessage: string = err.error?.message || err.error || err.message || '';

      if (
        errorMessage.includes('violates foreign key constraint') ||
        errorMessage.includes('menu_idmodulo_fkey')
      ) {
        alert('No se puede eliminar el módulo porque tiene un menú asignado.');
      } else {
        alert('Error al eliminar módulo.');
      }

      this.loading = false;
    },
  });
}


  // Resetear formulario
  onReset(): void {
    this.modulo = {
      idModulo: null,
      nombre: '',
      ordenmenu: 0,
      fechacreacion: new Date(),
      usuariocreacion: '',
      fechamodificacion: new Date(),
      usuariomodificacion: '',
    };
    this.error = '';
  this.isEditMode = false;
  }
}
