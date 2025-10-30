import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../entity/tipoDocumento';
import { TipoDocumentoService } from '../../service/tipodocumento.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudtipodocumento',
  standalone: false,
  templateUrl: './crudtipodocumento.component.html',
  styleUrls: ['./crudtipodocumento.component.css'],
})
export class CrudtipodocumentoComponent implements OnInit {
  permisosTipoDocumento: RolOpcion | undefined;
  isEditMode: boolean = false;

  loading = true;
  error = '';
  tiposDocumento: TipoDocumento[] = [];

  tipoDocumento: TipoDocumento = {
    idTipoDocumento: null,
    nombre: '',
    fechaCreacion: null,
    usuarioCreacion: '',
    fechaModificacion: null,
    usuarioModificacion: '',
  };

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(7, idRole).subscribe((permiso) => {
      this.permisosTipoDocumento = permiso;
    });

    this.tipoDocumentoService.getTiposDocumento().subscribe({
      next: (data) => {
        this.tiposDocumento = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar tipos de documento';
        this.loading = false;
      },
    });
  }

  private getUsuarioLogueado(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.nombre || 'system';
  }

  onSubmit() {
    const payload: TipoDocumento = {
      ...this.tipoDocumento,
      fechaCreacion: this.tipoDocumento.fechaCreacion
        ? new Date(this.tipoDocumento.fechaCreacion)
        : null,
      fechaModificacion: this.tipoDocumento.fechaModificacion
        ? new Date(this.tipoDocumento.fechaModificacion)
        : null,
    };

    // Crear
    if (payload.idTipoDocumento == null) {
      payload.idTipoDocumento = null;
      payload.fechaCreacion = new Date();
      payload.usuarioCreacion = this.getUsuarioLogueado();
      payload.fechaModificacion = null;
      this.tipoDocumentoService.createTipoDocumento(payload).subscribe({
        next: () => {
          alert('Tipo de documento creado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => {
          this.error = 'Error al crear tipo de documento';
        },
      });
    } else {
      payload.fechaModificacion = new Date();
      payload.usuarioModificacion = this.getUsuarioLogueado();
      this.tipoDocumentoService.updateTipoDocumento(payload.idTipoDocumento!, payload).subscribe({
        next: () => {
          alert('Tipo de documento actualizado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => {
          this.error = 'Error al actualizar tipo de documento';
        },
      });
    }
  }

  onEdit(tipoDocumento: TipoDocumento) {
    this.tipoDocumento = { ...tipoDocumento };
    this.isEditMode = true;
  }

  onDelete(idTipoDocumento: number) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de documento?')) return;

    this.tipoDocumentoService.deleteTipoDocumento(idTipoDocumento).subscribe({
      next: () => {
        alert('Tipo de documento eliminado correctamente.');
        this.ngOnInit();
      },
      error: () => {
        alert('Error al eliminar tipo de documento.');
      },
    });
  }

  onReset() {
    this.tipoDocumento = {
      idTipoDocumento: null,
      nombre: '',
      fechaCreacion: null,
      usuarioCreacion: '',
      fechaModificacion: null,
      usuarioModificacion: '',
    };
    this.isEditMode = false;
  }
}
