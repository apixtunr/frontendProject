import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
import { OpcionService } from '../../service/opcion.service';
import { RolOpcionService } from '../../service/rolopcion.service';
import { Usuario } from '../../entity/usuario';
import { Role } from '../../entity/role';
import { Opcion } from '../../entity/opcion';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-asignacionrolopcion',
  templateUrl: './asignacionrolopcion.component.html',
  styleUrls: ['./asignacionrolopcion.component.css'],
  standalone: false
})
export class AsignacionrolopcionComponent implements OnInit {
  roles: Role[] = [];
  usuarios: Usuario[] = [];
  opciones: Opcion[] = [];
  permisos: RolOpcion[] = [];
  formularioAsignacion: FormGroup;
  mensajeExito: string | null = null;
  cargando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private opcionService: OpcionService,
    private rolOpcionService: RolOpcionService,
    private fb: FormBuilder
  ) {
    this.formularioAsignacion = this.fb.group({
      usuario: [null],
      rol: [null],
      permisos: this.fb.array([])
    });
  }

  get rolesFiltrados() {
  return this.roles.filter(r => r.idRole !== 2);
}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
    this.usuarioService.getRoles().subscribe(data => {
      this.roles = data;
    });
    this.opcionService.getOpciones().subscribe(data => {
      this.opciones = data.sort((a, b) => a.idOpcion - b.idOpcion);
      this.initPermisosForm();
    });
  }

  initPermisosForm() {
    const permisosArray = this.formularioAsignacion.get('permisos') as FormArray;
    permisosArray.clear();
    this.opciones
      .filter(opcion => opcion.idOpcion !== 10)
      .forEach(opcion => {
        permisosArray.push(this.fb.group({
          idOpcion: [opcion.idOpcion],
          alta: [false],
          baja: [false],
          cambio: [false],
          imprimir: [false],
          exportar: [false]
        }));
      });
  }

  cargarPermisosPorRol(idRole: number | null) {
  if (!idRole) return;
  this.rolOpcionService.getPermisosPorRol(idRole).subscribe(data => {
    const permisosArray = this.formularioAsignacion.get('permisos') as FormArray;
    permisosArray.clear();
    // Siempre mostrar todas las opciones excepto la 10
    this.opciones
      .filter(opcion => opcion.idOpcion !== 10)
      .forEach(opcion => {
        // Buscar si el rol tiene permisos para esta opción
        const permiso = data.find(p => {
          // Si la respuesta del backend tiene id compuesto, ajusta aquí
          return p.id?.idOpcion === opcion.idOpcion;
        });
        permisosArray.push(this.fb.group({
          idOpcion: [opcion.idOpcion],
          alta: [permiso ? permiso.alta : false],
          baja: [permiso ? permiso.baja : false],
          cambio: [permiso ? permiso.cambio : false],
          imprimir: [permiso ? permiso.imprimir : false],
          exportar: [permiso ? permiso.exportar : false]
        }));
      });
  });
}

  setPermisosForm(permisos: RolOpcion[]) {
    const permisosArray = this.formularioAsignacion.get('permisos') as FormArray;
    permisosArray.controls.forEach((control, idx) => {
      const idOpcion = control.get('idOpcion')?.value;
      const permiso = permisos.find(p => p.id.idOpcion === idOpcion);
      if (permiso) {
        control.patchValue({
          alta: permiso.alta,
          baja: permiso.baja,
          cambio: permiso.cambio,
          imprimir: permiso.imprimir,
          exportar: permiso.exportar
        });
      } else {
        control.patchValue({
          alta: false,
          baja: false,
          cambio: false,
          imprimir: false,
          exportar: false
        });
      }
    });
  }

  asignarRolAUsuario() {
    const usuario = this.formularioAsignacion.get('usuario')?.value;
    const rol = this.formularioAsignacion.get('rol')?.value;
    if (!usuario || !rol) return;
    this.usuarioService.actualizarRolUsuario(usuario.idUsuario, rol.idRole.toString()).subscribe();
  }

  guardarPermisos() {
    this.cargando = true;
    const rol = this.formularioAsignacion.get('rol')?.value;
    const ahora = new Date().toISOString();
    const permisos: RolOpcion[] = this.permisosArray.controls.map((control) => {
      const permiso = control.value;
      return {
        id: {
          idRole: rol.idRole,
          idOpcion: permiso.idOpcion
        },
        alta: permiso.alta,
        baja: permiso.baja,
        cambio: permiso.cambio,
        imprimir: permiso.imprimir,
        exportar: permiso.exportar,
        usuarioCreacion: 'admin',
        usuarioModificacion: 'admin',
        fechaCreacion: ahora,
        fechaModificacion: ahora
      };
    });

    // Transformar al formato plano que espera el backend (DTO)
    const permisosDTO = permisos.map(p => ({
      idRole: p.id.idRole,
      idOpcion: p.id.idOpcion,
      alta: p.alta,
      baja: p.baja,
      cambio: p.cambio,
      imprimir: p.imprimir,
      exportar: p.exportar,
      fechaCreacion: p.fechaCreacion,
      usuarioCreacion: p.usuarioCreacion,
      fechaModificacion: p.fechaModificacion,
      usuarioModificacion: p.usuarioModificacion
    }));
    this.rolOpcionService.guardarRoleOpcion(permisosDTO).subscribe(
      (resp) => {
        this.mensajeExito = 'Permisos guardados correctamente';
        this.cargando = false;
        setTimeout(() => { this.mensajeExito = null; }, 3000);
      },
      (error) => {
        console.error('Error al guardar permisos:', error);
        this.mensajeExito = null;
        this.cargando = false;
      }
    );
}

  get permisosArray() {
    return this.formularioAsignacion.get('permisos') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
}
