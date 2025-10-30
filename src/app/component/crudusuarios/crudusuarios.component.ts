import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { GeneroService } from '../../service/genero.service';
import { SucursalService } from '../../service/sucursal.service';
import { Usuario } from '../../entity/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-crudusuarios',
  standalone: false,
  templateUrl: './crudusuarios.component.html',
  styleUrl: './crudusuarios.component.css',
})
export class CrudusuariosComponent implements OnInit {
  permisosUsuario: RolOpcion | undefined;
  isEditMode = false;
  constructor(
    private usuarioService: UsuarioService,
    private generoService: GeneroService,
    private sucursalService: SucursalService,
    private fb: FormBuilder,
    private permisoService: PermisoService,
    private roleService: RoleService
  ) {}

  loading = true;
  error = '';
  imagenPreview: string | null = null;

  usuarioForm!: FormGroup;
  usuarios: any[] = []; // lista de usuarios
  generos: any[] = []; // lista de géneros
  sucursales: any[] = []; // lista de sucursales
  roles: any[] = []; // lista de roles

  //Método para inicializar el componente
  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      idUsuario: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      password: ['', Validators.required],
      idGenero: [0],
      correoElectronico: ['', [Validators.required, Validators.email]],
      fotografia: [''],
      telefonoMovil: [''],
      idSucursal: [0],
      pregunta: [''],
      respuesta: [''],
      idStatusUsuario: [1, Validators.required], // 1 por defecto (activo)
      idRole: [2, Validators.required], // Rol por defecto
    });
    // Cargar roles
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
      },
    });

    // Obtener permisos para usuarios (idOpcion=8)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(9, idRole).subscribe((permiso) => {
      this.permisosUsuario = permiso;
    });

    // Cargar usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      },
    });

    // Cargar géneros
    this.generoService.getGeneros().subscribe({
      next: (data) => {
        this.generos = data;
      },
      error: (err) => {
        console.error('Error al cargar géneros:', err);
      },
    });

    // Cargar sucursales
    this.sucursalService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
      },
      error: (err) => {
        console.error('Error al cargar sucursales:', err);
      },
    });
  }

  // Método para obtener el nombre del género por ID
  getGeneroNombre(idGenero: number): string {
    const genero = this.generos.find((g) => g.idgenero === idGenero);
    return genero ? genero.nombre : 'No especificado';
  }

  // Método para obtener el nombre de la sucursal por ID
  getSucursalNombre(idSucursal: number): string {
    const sucursal = this.sucursales.find((s) => s.idSucursal === idSucursal);
    return sucursal ? sucursal.nombre : 'No especificado';
  }

  //Método para crear usuario
  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      console.log('No se pudo crear el usuario: formulario inválido');
      return;
    }

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioCreacion = usuarioLocal.id || ''; // Esto jala el idUsuario

    const usuario: Usuario = {
      ...this.usuarioForm.value,
      fechaNacimiento: this.toDateOnly(this.usuarioForm.value.fechaNacimiento),
      // valores default
      idRole: 2,
      fechaCreacion: new Date().toISOString(),
      idStatusUsuario: 1, // Siempre activo al crear
      ultimaFechaIngreso: null,
      intentosDeAcceso: 0,
      sesionActual: '',
      ultimaFechaCambioPassword: null,
      requiereCambiarPassword: 0,
      usuarioCreacion: usuarioCreacion,
      fechaModificacion: null,
      usuarioModificacion: null,
    };

    this.usuarioService.createUsuario(usuario).subscribe({
      next: () => {
        console.log('Usuario creado correctamente');
        alert('Usuario creado correctamente.');
        this.ngOnInit(); // recargar lista
        this.onReset();
      },
      error: (error) => {
        const requisitos = error?.error;
        if (
          typeof requisitos === 'string' &&
          requisitos.includes('La contraseña no cumple con los requisitos')
        ) {
          alert(requisitos);
          this.error = requisitos;
        } else {
          this.error = 'El usuario ya está en uso';
          alert(this.error);
        }
      },
    });
  }

  //Editar usuario (trae los datos al formulario)
  onEdit(usuario: Usuario) {
    // Carga todos los campos normales en el formulario excepto la contraseña
    const { fotografia, password, ...usuarioData } = usuario;
    this.usuarioForm.patchValue(usuarioData);
    // Asignar el rol actual al formulario
    if (usuario.idRole) {
      this.usuarioForm.get('idRole')?.setValue(usuario.idRole);
    }

    // Bloquea el campo password en modo edición
    const passCtrl = this.usuarioForm.get('password');
    passCtrl?.reset('');
    passCtrl?.clearValidators();
    passCtrl?.updateValueAndValidity();

    // Si quieres mostrar la foto en el formulario
    if (fotografia) {
      this.usuarioForm.get('fotografia')?.setValue(fotografia);
    } else {
      this.imagenPreview = null;
    }
    this.isEditMode = true;
    console.log('Editando usuario:', usuario);
    console.log('Valores del formulario:', this.usuarioForm.value);
  }

  //Método para eliminar usuario
  onDelete(idUsuario: string) {
    const confirmado = confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmado) return;

    this.usuarioService.deleteUsuario(idUsuario).subscribe({
      next: () => {
        alert('Usuario eliminado correctamente.');
        this.ngOnInit(); // recargar la lista
      },
      error: (error) => {
        let mensajeError = 'Error al eliminar usuario';
        const errorMsg = error?.error?.message || '';
        if (
          errorMsg.toLowerCase().includes('violates foreign key constraint') ||
          errorMsg.toLowerCase().includes('is still referenced')
        ) {
          mensajeError =
            'No se puede eliminar el usuario porque está relacionado con la bitácora.';
        }
        this.error = mensajeError;
        alert(this.error);
      },
    });
  }

  // Método para actualizar usuario (solo modifica lo que venga del form)
  onUpdate() {
    if (this.usuarioForm.invalid) return;

    // No tomar el campo password del formulario en edición
    const { password, ...changes } = this.usuarioForm.value;

    // Auditoría con el usuario logueado
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioModificacion = usuarioLocal.id || 'ADMIN';

    if (!changes.idUsuario) {
      alert('No se puede actualizar un usuario sin ID');
      return;
    }

    // Buscar el usuario actual en la lista cargada
    const existing = this.usuarios.find(
      (u) => u.idUsuario === changes.idUsuario
    );

    // Normalizar tipos si vienen de selects como strings
    const normalizedChanges = {
      ...changes,
      idGenero:
        changes.idGenero !== undefined
          ? Number(changes.idGenero)
          : changes.idGenero,
      idSucursal:
        changes.idSucursal !== undefined
          ? Number(changes.idSucursal)
          : changes.idSucursal,
      idStatusUsuario:
        changes.idStatusUsuario !== undefined
          ? Number(changes.idStatusUsuario)
          : changes.idStatusUsuario,
      idRole:
        changes.idRole !== undefined ? Number(changes.idRole) : changes.idRole,
    };

    // Función para mandar el update con merge
    const doUpdate = (currentUser: any) => {
      const nowIso = new Date();

      // Si el campo password está vacío, no lo sobrescribas
      const payload: Usuario = {
        ...currentUser, // valores actuales (llenan lo que el form no envía)
        ...normalizedChanges, // sobrescribe solo lo que cambiaste en el form
        fechaModificacion: nowIso,
        usuarioModificacion: usuarioModificacion,
        fechaNacimiento: this.toDateOnly(
          this.usuarioForm.value.fechaNacimiento
        ),
      };

      console.log(this.toDateOnly(this.usuarioForm.value.fechaNacimiento));

      this.usuarioService.updateUsuario(payload.idUsuario, payload).subscribe({
        next: () => {
          alert('Usuario actualizado correctamente');
          this.ngOnInit();
          this.onReset();
        },
        error: () => {
          this.error = 'Error al actualizar usuario';
        },
      });
    };

    if (existing) {
      // Tenemos el usuario en memoria: merge directo
      doUpdate(existing);
    } else {
      // Fallback: si no está en memoria, lo pedimos al backend para mergear correctamente
      this.usuarioService.getUsuarios().subscribe({
        next: (usuarios) => {
          const current = usuarios.find(
            (u: any) => u.idUsuario === changes.idUsuario
          );
          if (current) {
            doUpdate(current);
          } else {
            this.error = 'No se pudo encontrar el usuario a actualizar';
          }
        },
        error: () => {
          this.error = 'No se pudo cargar el usuario a actualizar';
        },
      });
    }
  }

  //Método para resetear el formulario
  onReset() {
    this.usuarioForm.reset({
      idUsuario: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      password: '',
      idGenero: 0,
      correoElectronico: '',
      fotografia: '',
      telefonoMovil: '',
      idSucursal: 0,
      pregunta: '',
      respuesta: '',
      idStatusUsuario: 1, // Siempre activo en alta
      idRole: 2,
    });
    const passCtrl = this.usuarioForm.get('password');
    passCtrl?.setValidators([Validators.required]); // requerido para crear
    passCtrl?.updateValueAndValidity();

    this.isEditMode = false;
  }

  // Normaliza a 'YYYY-MM-DD' sin hora ni zona
  private toDateOnly(value: any): string {
    if (!value) return '';
    // Si ya viene como 'YYYY-MM-DD', úsalo tal cual
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
      return value;

    const d = new Date(value); // puede venir como Date (MatDatepicker) o string con hora
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
