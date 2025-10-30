import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpcionService } from '../../service/opcion.service';
import { CrudmenuService } from '../../service/crudmenu.service';
import { Modulo } from '../../entity/modulo';
import { ModuloService } from '../../service/modulo.service';
import { Opcion } from '../../entity/opcion';
import { Menu } from '../../entity/menu';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudopciones',
  standalone: false,
  templateUrl: './crudopciones.component.html',
  styleUrl: './crudopciones.component.css'
})
export class CrudopcionesComponent implements OnInit {
  permisosOpcion: RolOpcion | undefined;
  opciones: Opcion[] = [];
  menus: Menu[] = [];
  modulos: Modulo[] = [];
  opcionForm!: FormGroup;
  editando: boolean = false;
  idEditando: number | null = null;
  error = '';

  constructor(
    private opcionService: OpcionService,
    private crudmenuService: CrudmenuService,
    private fb: FormBuilder,
    private router: Router,
    private moduloService: ModuloService,
    private permisoService: PermisoService
  ) {}
  regresarAlMenu() {
    this.router.navigate(['/menu']); // Cambia '/menu' por la ruta real de tu menú principal si es diferente
  }

  ngOnInit(): void {
    this.opcionForm = this.fb.group({
      idMenu: ['', Validators.required],
      nombre: ['', Validators.required],
      // pagina: ['', Validators.required], // Campo eliminado, ahora lo maneja el backend
      descripcion: [''],
      url: [''],
      fechaCreacion: [''],
      usuarioCreacion: [''],
      fechaModificacion: [''],
      usuarioModificacion: ['']
    });
    this.cargarOpciones();
    this.crudmenuService.getMenus().subscribe({
      next: (data) => this.menus = data,
      error: () => this.error = 'Error al cargar menús'
    });
    // Obtener permisos para opciones (idOpcion=8)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(8, idRole).subscribe(permiso => {
      this.permisosOpcion = permiso;
    });
    this.moduloService.getModulos().subscribe({
      next: (data) => this.modulos = data,
      error: () => this.error = 'Error al cargar módulos'
    });
  }

  cargarOpciones() {
    this.opcionService.getOpciones().subscribe({
      next: (data) => this.opciones = data,
      error: () => this.error = 'Error al cargar opciones'
    });
  }

  onSubmit() {
    if (this.opcionForm.invalid) {
      this.opcionForm.markAllAsTouched();
      return;
    }
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nombreUsuario = usuario?.nombre || 'system';

    // Asignar orden automáticamente (puedes cambiar la lógica si lo deseas)
    const idMenuSeleccionado = this.opcionForm.value.idMenu;
    const opcionesDeMenu = this.opciones.filter(o => o.idMenu == idMenuSeleccionado);
    const ordenmenu = opcionesDeMenu.length + 1; // Esto puede generar duplicados si hay eliminaciones

    // El campo 'pagina' ya no se utiliza ni se envía desde el frontend
    const opcion: Opcion = {
      ...this.opcionForm.value,
      ordenmenu,
      fechaCreacion: new Date().toISOString(),
      usuarioCreacion: nombreUsuario,
      fechaModificacion: '',
      usuarioModificacion: ''
      // pagina: '', // Ya no se envía, el backend lo asigna por defecto
    };
    // Usar el endpoint DTO en el servicio
    this.opcionService.createOpcionDTO(opcion).subscribe({
      next: () => {
        this.cargarOpciones();
        this.onReset();
        alert('Opción creada correctamente');
      },
      error: () => this.error = 'Error al crear opción'
    });
  }

  onEdit(opcion: Opcion) {
    this.editando = true;
    this.idEditando = opcion.idOpcion;
    this.opcionForm.patchValue(opcion);
  }

  onUpdate() {
    if (this.opcionForm.invalid || this.idEditando == null) return;
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nombreUsuario = usuario?.nombre || 'system';

    // Calcular ordenmenu igual que en onSubmit
    const idMenuSeleccionado = this.opcionForm.value.idMenu;
    const opcionesDeMenu = this.opciones.filter(o => o.idMenu == idMenuSeleccionado);
    const ordenmenu = opcionesDeMenu.length + 1; // O usa el valor actual si lo prefieres

    const opcion: Opcion = {
      ...this.opcionForm.value,
      ordenmenu, // <-- Asegúrate de incluirlo
      fechaModificacion: new Date().toISOString(),
      usuarioModificacion: nombreUsuario
    };
    this.opcionService.updateOpcionDTO(this.idEditando, opcion).subscribe({
      next: () => {
        this.cargarOpciones();
        this.onReset();
        alert('Opción actualizada correctamente');
      },
      error: () => this.error = 'Error al actualizar opción'
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Seguro que desea eliminar esta opción?')) return;

    this.opcionService.deleteOpcion(id).subscribe({
      next: () => {
        this.cargarOpciones();
        alert('Opción eliminada correctamente');
      },
      error: (err) => {
        const errorMessage: string = err.error?.message || err.error || err.message || '';

        if (
          errorMessage.includes('violates foreign key constraint') ||
          errorMessage.includes('role_opcion_idopcion_fkey')
        ) {
          alert('No se puede eliminar la opción porque tiene permisos asociados. Elimine primero los permisos.');
        } else {
          alert('Error al eliminar opción.');
        }
      }
    });
  }

  onReset() {
    this.opcionForm.reset();
    this.editando = false;
    this.idEditando = null;
  }

  getNombreMenu(idMenu: number): string {
    const menu = this.menus.find(m => m.idmenu === idMenu);
    return menu ? menu.nombre : idMenu.toString();
  }

  getNombreModulo(idmodulo: number): string {
    const modulo = this.modulos.find(m => m.idModulo === idmodulo);
    return modulo ? modulo.nombre : '';
  }
}
