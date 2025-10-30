import { Component, OnInit } from '@angular/core';
import { Role } from '../../entity/role';
import { RoleService } from '../../service/role.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudrole',
  standalone: false,
  templateUrl: './crudrole.component.html',
  styleUrls: ['./crudrole.component.css'],
})
export class CrudroleComponent implements OnInit {
  permisosRole: RolOpcion | undefined;
  isEditMode: boolean = false;
  constructor(private roleService: RoleService, private permisoService: PermisoService) {}

  loading = true;
  error = '';
  roles: Role[] = []; // lista de roles
  role: Role = {
    idRole: null,
    nombre: '',
    fechacreacion: null,
    usuariocreacion: '',
    fechamodificacion: null,
    usuariomodificacion: '',
  };

  ngOnInit(): void {
    // Obtener permisos para roles (idOpcion=5)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(5, idRole).subscribe(permiso => {
      this.permisosRole = permiso;
    });
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar roles';
        this.loading = false;
      },
    });
  }

  private getUsuarioLogueado(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.nombre || 'system'; // fallback en caso de que no exista
  }

  onSubmit() {
    const payload: Role = {
      ...this.role,
      fechacreacion: this.role.fechacreacion ? new Date(this.role.fechacreacion) : null,
      fechamodificacion: this.role.fechamodificacion ? new Date(this.role.fechamodificacion) : null,
    };

    // Crear
    if (payload.idRole == null) {
      payload.idRole = null;
      payload.fechacreacion = new Date();
      payload.usuariocreacion = this.getUsuarioLogueado(); // ✅ se toma de localStorage
      payload.fechamodificacion = null;
      this.roleService.createRole(payload).subscribe({
        next: () => {
          alert('Rol creado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => {
          this.error = 'Error al crear rol';
        },
      });
    }
    // Actualizar
    else {
      payload.fechamodificacion = new Date();
      payload.usuariomodificacion = this.getUsuarioLogueado(); // ✅ se toma de localStorage
      this.roleService.updateRole(payload).subscribe({
        next: () => {
          alert('Rol actualizado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => {
          this.error = 'Error al actualizar rol';
        },
      });
    }
  }

  onEdit(role: Role) {
    this.role = { ...role };
  this.isEditMode = true;
  }

  onDelete(idRole: number) {
  if (!confirm('¿Seguro que deseas eliminar este rol?')) return;

  this.roleService.deleteRole(idRole).subscribe({
    next: () => {
      alert('Rol eliminado correctamente.');
      this.ngOnInit();
    },
    error: (err) => {
      const errorMessage: string = err.error?.message || err.error || err.message || '';

      if (errorMessage.includes('violates foreign key constraint') || errorMessage.includes('role_opcion_idrole_fkey')) {
        alert(' No se puede eliminar el rol porque tiene opciones asignadas.');
      } else {
        alert(' Error al eliminar rol.');
      }
    },
  });
}



  onReset() {
    this.role = {
      idRole: null,
      nombre: '',
      fechacreacion: null,
      usuariocreacion: '',
      fechamodificacion: null,
      usuariomodificacion: '',
    };
  this.isEditMode = false;
  }
}
