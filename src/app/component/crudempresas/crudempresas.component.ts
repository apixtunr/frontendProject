import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../entity/empresa';
import { EmpresaService } from '../../service/empresa.service';
import { PermisoService } from '../../service/permisoservice';

@Component({
  selector: 'app-crudempresas',
  templateUrl: './crudempresas.component.html',
  styleUrls: ['./crudempresas.component.css'],
  standalone: false,
})
export class CrudempresasComponent implements OnInit {
  loading = true;
  error = '';
  empresas: Empresa[] = []; // lista de empresas
  empresa: Empresa = this.crearEmpresaVacia();
  isEditMode = false;

  permisosEmpresa: any = {};

  constructor(
    private empresaService: EmpresaService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data) => {
        this.empresas = data.sort((a: any, b: any) => a.idEmpresa - b.idEmpresa);
        this.loading = false;
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const idRole = usuario.rol; // <- así como lo envía el backend

        console.log('Usuario:', usuario);
        console.log('idRole:', idRole);
        if (idRole !== undefined && idRole !== null) {
          this.permisoService
            .getPermisos(1, idRole)
            .subscribe((permiso) => {
              this.permisosEmpresa = permiso || {};
            });
        } else {
          this.permisosEmpresa = {};
          // Opcional: muestra un mensaje de error o redirige al login
        }
      },
      error: () => {
        this.error = 'Error al cargar empresas';
        this.loading = false;
      },
    });
  }

  // Crear nueva empresa
  onSubmit() {
    // verificar si la empresa ya existe (NIT único)
    const existe = this.empresas.some(
      (e) => e.nit === this.empresa.nit && !this.isEditMode
    );
    if (existe) {
      alert('La empresa ya está creada.');
      return;
    }

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioCreacion = usuarioLocal.id || '';

    const payload = {
      ...this.empresa,
      idEmpresa: undefined,
      fechaCreacion: this.empresa.fechaCreacion
        ? this.formatDateTime(this.empresa.fechaCreacion)
        : this.formatDateTime(new Date().toISOString().split('T')[0]),
      fechaModificacion: null,
      usuarioCreacion,
      usuarioModificacion: null,
      passwordCantidadPreguntasValidar: 1,
    };

    this.empresaService.createEmpresa(payload).subscribe({
      next: () => {
        alert('Empresa guardada.');
        this.ngOnInit();
        this.onReset(); // limpiar formulario
      },
      error: () => {
        this.error = 'Error al guardar empresa.';
      },
    });
  }

  // Editar empresa (trae los datos al formulario)
  onEdit(emp: Empresa) {
    this.empresa = { ...emp }; // copia al form
    this.isEditMode = true; // ahora estamos editando
  }

  // Actualizar empresa existente
  onUpdate() {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioModificacion = usuarioLocal.id || '';

    const payload = {
      ...this.empresa,
      fechaModificacion: this.formatDateTime(
        new Date().toISOString().split('T')[0]
      ),
      usuarioModificacion,
    };

    this.empresaService.updateEmpresa(payload).subscribe({
      next: () => {
        alert('Empresa actualizada.');
        this.ngOnInit();
        this.onReset();
        this.isEditMode = false;
      },
      error: () => {
        this.error = 'Error al actualizar empresa.';
      },
    });
  }

  //Método para eliminar empresa
  onDelete(nit: string) {
    const confirmado = confirm('¿Estás seguro de eliminar esta empresa?');
    if (!confirmado) return;

    this.empresaService.deleteEmpresa(nit).subscribe({
      next: () => {
        alert('Empresa eliminada.');
        this.ngOnInit();
      },
      error: () => {
        this.error = 'Error al eliminar empresa.';
      },
    });
  }

  // Resetear formulario
  onReset() {
    this.empresa = this.crearEmpresaVacia();
    this.isEditMode = false; // volvemos al modo agregar
  }
  // Formatear fecha para enviar al backend
  formatDateTime(date: string): string {
    return date && !date.includes('T') ? date + 'T00:00:00' : date || '';
  }

  private crearEmpresaVacia(): Empresa {
    return {
      nombre: '',
      direccion: '',
      nit: '',
      fechaCreacion: '',
      fechaModificacion: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      passwordCantidadCaducidadDias: 0,
      passwordCantidadCaracteresEspeciales: 0,
      passwordCantidadMayusculas: 0,
      passwordCantidadMinusculas: 0,
      passwordCantidadNumeros: 0,
      passwordCantidadPreguntasValidar: 0,
      passwordIntentosAntesDeBloquear: 0,
      passwordLargo: 0,
    };
  }
}
