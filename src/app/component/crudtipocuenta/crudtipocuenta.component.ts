import { Component, OnInit } from '@angular/core';
import { TipoCuenta } from '../../entity/tipoCuenta';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';
import { TipoCuentaService } from '../../service/tipocuenta.service';


@Component({
  selector: 'app-crudtipocuenta',
  standalone: false,
  templateUrl: './crudtipocuenta.component.html',
  styleUrls: ['./crudtipocuenta.component.css'],
})
export class CrudTipoCuentaComponent implements OnInit {
  permisosTipoCuenta: RolOpcion | undefined;
  isEditMode: boolean = false;

  loading = true;
  error = '';
  tiposCuenta: TipoCuenta[] = [];

  tipoCuenta: TipoCuenta = {
    idTipoCuenta: null,
    nombre: '',
    fechaCreacion: null,
    usuarioCreacion: '',
    fechaModificacion: null,
    usuarioModificacion: '',
  };

  constructor(
    private tipoCuentaService: TipoCuentaService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;

    this.permisoService.getPermisos(9, idRole).subscribe((permiso) => {
      this.permisosTipoCuenta = permiso;
    });

    this.tipoCuentaService.getTiposCuenta().subscribe({
      next: (data: TipoCuenta[]) => {
        this.tiposCuenta = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar tipos de cuenta';
        this.loading = false;
      },
    });
  }

  private getUsuarioLogueado(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?.nombre || 'system';
  }

  onSubmit() {
    const payload: TipoCuenta = {
      ...this.tipoCuenta,
      fechaCreacion: this.tipoCuenta.fechaCreacion
        ? new Date(this.tipoCuenta.fechaCreacion)
        : null,
      fechaModificacion: this.tipoCuenta.fechaModificacion
        ? new Date(this.tipoCuenta.fechaModificacion)
        : null,
    };

    // Crear
    if (payload.idTipoCuenta == null) {
      payload.idTipoCuenta = null;
      payload.fechaCreacion = new Date();
      payload.usuarioCreacion = this.getUsuarioLogueado();
      payload.fechaModificacion = null;
      this.tipoCuentaService.createTipoCuenta(payload).subscribe({
        next: () => {
          alert('Tipo de cuenta creado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => (this.error = 'Error al crear tipo de cuenta'),
      });
    } else {
      payload.fechaModificacion = new Date();
      payload.usuarioModificacion = this.getUsuarioLogueado();
      this.tipoCuentaService.updateTipoCuenta(payload).subscribe({
        next: () => {
          alert('Tipo de cuenta actualizado correctamente.');
          this.ngOnInit();
          this.onReset();
        },
        error: () => (this.error = 'Error al actualizar tipo de cuenta'),
      });
    }
  }

  onEdit(tipoCuenta: TipoCuenta) {
    this.tipoCuenta = { ...tipoCuenta };
    this.isEditMode = true;
  }

  onDelete(idTipoCuenta: number) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de cuenta?')) return;

    this.tipoCuentaService.deleteTipoCuenta(idTipoCuenta).subscribe({
      next: () => {
        alert('Tipo de cuenta eliminado correctamente.');
        this.ngOnInit();
      },
      error: () => alert('Error al eliminar tipo de cuenta.'),
    });
  }

  onReset() {
    this.tipoCuenta = {
      idTipoCuenta: null,
      nombre: '',
      fechaCreacion: null,
      usuarioCreacion: '',
      fechaModificacion: null,
      usuarioModificacion: '',
    };
    this.isEditMode = false;
  }
}
