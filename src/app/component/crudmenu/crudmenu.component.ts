import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudmenuService } from '../../service/crudmenu.service';
import { ModuloService } from '../../service/modulo.service';
import { Menu } from '../../entity/menu';
import { Modulo } from '../../entity/modulo';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudmenu',
  standalone: false,
  templateUrl: './crudmenu.component.html',
  styleUrl: './crudmenu.component.css'
})
export class CrudmenuComponent implements OnInit {
  permisosMenu: RolOpcion | undefined;
  menuForm!: FormGroup;
  menus: Menu[] = [];
  modulos: Modulo[] = [];
  editando: boolean = false;
  idEditando: number | null = null;
  error = '';

  constructor(
    private fb: FormBuilder,
    private crudmenuService: CrudmenuService,
    private moduloService: ModuloService,
    private router: Router
  , private permisoService: PermisoService
  ) {}

  regresarAlMenu() {
    this.router.navigate(['/menu']); // Cambia '/menu' por la ruta real de tu menú principal si es diferente
  }

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      idmodulo: ['', Validators.required],
      nombre: ['', Validators.required],
      fechacreacion: [''],
      usuariocreacion: [''],
      fechamodificacion: [''],
      usuariomodificacion: ['']
    });
    this.cargarMenus();
    this.cargarModulos();
    // Obtener permisos para menú (idOpcion=7)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(7, idRole).subscribe(permiso => {
      this.permisosMenu = permiso;
    });
  }

  cargarMenus() {
    this.crudmenuService.getMenus().subscribe({
      next: (data) => this.menus = data,
      error: () => this.error = 'Error al cargar menús'
    });
  }

  cargarModulos() {
    this.moduloService.getModulos().subscribe({
      next: (data) => this.modulos = data,
      error: () => this.error = 'Error al cargar módulos'
    });
  }

  onSubmit() {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }
    // Obtener usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.id;

    const menu: Menu = {
      ...this.menuForm.value,
      ordenmenu: this.getNextOrden(),
      fechacreacion: new Date(), 
      usuariocreacion: idUsuario,
      fechamodificacion: null,
      usuariomodificacion: null
    };
    this.crudmenuService.createMenu(menu).subscribe({
      next: () => {
        this.cargarMenus();
        this.onReset();
        alert('Menú creado correctamente');
      },
      error: () => this.error = 'Error al crear menú'
    });
  }

  onEdit(menu: Menu) {
    this.editando = true;
    this.idEditando = (menu as any).idmenu;
    this.menuForm.patchValue(menu);
    // Guarda el orden actual para usarlo en la actualización
    (this.menuForm as any)._ordenmenuEdit = menu.ordenmenu;
  }

  onUpdate() {
    if (this.menuForm.invalid || this.idEditando == null) return;
    // Obtener usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario?.id || 'system';

    // Recupera el ordenmenu guardado al editar
    const ordenmenu = (this.menuForm as any)._ordenmenuEdit;

    const menu: Menu = {
      ...this.menuForm.value,
      ordenmenu: ordenmenu,
      fechamodificacion: new Date().toISOString(),
      usuariomodificacion: idUsuario
    };
    this.crudmenuService.updateMenu(this.idEditando, menu).subscribe({
      next: () => {
        this.cargarMenus();
        this.onReset();
        alert('Menú actualizado correctamente');
      },
      error: () => this.error = 'Error al actualizar menú'
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Seguro que desea eliminar este menú?')) return;
    this.crudmenuService.deleteMenu(id).subscribe({
      next: () => {
        this.cargarMenus();
        alert('Menú eliminado correctamente');
      },
      error: () => this.error = 'Error al eliminar menú'
    });
  }

  onReset() {
    this.menuForm.reset();
    this.editando = false;
    this.idEditando = null;
  }
  getNombreModulo(idmodulo: number): string {
    const modulo = this.modulos.find(m => m.idModulo == idmodulo);
    return modulo ? modulo.nombre : '';
  }

  private getNextOrden(): number {
    const ordenes = this.menus
      .map(m => m.ordenmenu)
      .filter(n => n != null)
      .sort((a, b) => a - b);

    let next = 1;
    for (let ord of ordenes) {
      if (ord === next) {
        next++;
      } else {
        break;
      }
    }
    return next;
  }
}
