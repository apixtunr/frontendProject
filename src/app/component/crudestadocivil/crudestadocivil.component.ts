import { Component, OnInit } from '@angular/core';
import { EstadoCivil } from '../../entity/estadoCivil';
import { EstadoCivilService } from '../../service/estadocivil.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudestadocivil',
  standalone: false,
  templateUrl: './crudestadocivil.component.html',
  styleUrls: ['./crudestadocivil.component.css'],
})
export class CrudestadocivilComponent implements OnInit {
  permisosEstadoCivil: RolOpcion | undefined;
  isEditMode: boolean = false;

  loading = true;
  error = '';
  estadosCiviles: EstadoCivil[] = [];

  estadoCivil: EstadoCivil = {
    idEstadoCivil: null,
    nombre: '',
    fechaCreacion: null,
    usuarioCreacion: '',
    fechaModificacion: null,
    usuarioModificacion: '',
  };

  constructor(
    private estadoCivilService: EstadoCivilService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(6, idRole).subscribe((permiso) => {
      this.permisosEstadoCivil = permiso;
    });

    this.estadoCivilService.getEstadosCiviles().subscribe({
      next: (data) => {
        this.estadosCiviles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar estados civiles';
        this.loading = false;
      },
    });
  }

  private getUsuarioLogueado(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.nombre || 'system';
  }

  onSubmit() {
    const payload: EstadoCivil = {
      ...this.estadoCivil,
      fechaCreacion: this.estadoCivil.fechaCreacion
        ? new Date(this.estadoCivil.fechaCreacion)
        : null,
      fechaModificacion: this.estadoCivil.fechaModificacion
        ? new Date(this.estadoCivil.fechaModificacion)
        : null,
    };

    // CREAR
    if (payload.idEstadoCivil == null) {
      payload.idEstadoCivil = null;
      payload.fechaCreacion = new Date();
      payload.usuarioCreacion = this.getUsuarioLogueado();
      payload.fechaModificacion = null;

      this.estadoCivilService.createEstadoCivil(payload).subscribe({
        next: () => {
          alert('✅ Estado civil creado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: (err) => {
          console.error('❌ Error al crear:', err);
          this.error = 'Error al crear estado civil';
        },
      });
    }

    // ACTUALIZAR
    else {
      payload.fechaModificacion = new Date();
      payload.usuarioModificacion = this.getUsuarioLogueado();

      this.estadoCivilService.updateEstadoCivil(payload).subscribe({
        next: () => {
          alert('✅ Estado civil actualizado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: (err) => {
          console.error('❌ Error al actualizar:', err);
          this.error = 'Error al actualizar estado civil';
        },
      });
    }
  }

  onEdit(e: EstadoCivil) {
    this.estadoCivil = { ...e };
    this.isEditMode = true;
  }

  onDelete(idEstadoCivil: number) {
    if (!confirm('¿Seguro que deseas eliminar este estado civil?')) return;

    this.estadoCivilService.deleteEstadoCivil(idEstadoCivil).subscribe({
      next: () => {
        alert('Estado civil eliminado correctamente.');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('❌ Error al eliminar:', err);
        alert('Error al eliminar estado civil.');
      },
    });
  }

  onReset() {
    this.estadoCivil = {
      idEstadoCivil: null,
      nombre: '',
      fechaCreacion: null,
      usuarioCreacion: '',
      fechaModificacion: null,
      usuarioModificacion: '',
    };
    this.isEditMode = false;
  }
}
