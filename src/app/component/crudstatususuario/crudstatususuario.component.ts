import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusUsuario } from '../../entity/statusUsuario';
import { StatusUsuarioService } from '../../service/statusUsuario.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudstatususuario',
  standalone: false,
  templateUrl: './crudstatususuario.component.html',
  styleUrl: './crudstatususuario.component.css'
})
export class CrudstatususuarioComponent implements OnInit {
  permisosStatusUsuario: RolOpcion | undefined;
  isEditMode: boolean = false;
  loading = true;
  error = '';
  statusUsuarios: StatusUsuario[] = [];
  currentUser: string = ''; 
  statusUsuario: any = {
    idstatususuario: 0,
    nombre: ''
  };

  constructor(private statusUsuarioService: StatusUsuarioService, private permisoService: PermisoService) {}

  ngOnInit(): void {
    // Obtener permisos para statususuario (idOpcion=4)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(4, idRole).subscribe(permiso => {
      this.permisosStatusUsuario = permiso;
    });
    this.getCurrentUser();
    this.initializeStatusUsuario();
    this.loadStatusUsuarios();
  }

  /**
   * Obtiene el usuario actual del localStorage
   */
  getCurrentUser(): void {
    try {
      // Obtener el objeto JSON del localStorage (igual que en el ejemplo de empresas)
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      
      // Usar el ID del usuario (igual que en el ejemplo de empresas)
      this.currentUser = usuarioLocal.id || '';
      
      console.log('Usuario completo del localStorage:', usuarioLocal);
      console.log('ID de usuario extraído:', this.currentUser);
      
      if (!this.currentUser) {
        console.warn('No se encontró ID de usuario en localStorage');
        this.currentUser = '';
      }
    } catch (error) {
      console.error('Error al parsear datos del usuario desde localStorage:', error);
      this.currentUser = '';
    }
  }

  /**
   * Inicializa el objeto statusUsuario con valores por defecto
   */
  initializeStatusUsuario(): void {
    this.statusUsuario = {
      idstatususuario: 0, // Se mantiene en 0, el backend lo asignará automáticamente
      nombre: ''
      // Solo mantenemos el nombre para el formulario simplificado
    };
  }

  loadStatusUsuarios(): void {
    this.statusUsuarioService.getStatusUsuarios().subscribe({
      next: (data) => {
        this.statusUsuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar status de usuarios: ' + err.message;
        this.loading = false;
        console.error('Error al cargar status de usuarios:', err);
      }
    });
  }

  onSubmit(): void {
    // Validación básica
    if (!this.statusUsuario.nombre || this.statusUsuario.nombre.trim() === '') {
      this.error = 'El nombre del status de usuario es requerido.';
      return;
    }

    if (this.statusUsuario.idstatususuario === 0) {
      // Crear nuevo status usuario
      // Obtener usuario del localStorage igual que en el ejemplo
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      const usuarioCreacion = usuarioLocal.id || '';

      const newStatusUsuario: any = {
        nombre: this.statusUsuario.nombre.trim(),
        fechaCreacion: new Date(), // Fecha actual del día de HOY
        usuarioCreacion: usuarioCreacion
      };

      console.log('Enviando nuevo status usuario:', newStatusUsuario);
      console.log('Usuario que está creando (ID):', usuarioCreacion);
      console.log('Fecha de creación (HOY):', new Date());

      this.statusUsuarioService.createStatusUsuario(newStatusUsuario).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          alert('Status de usuario creado exitosamente.');
          this.onReset();
          this.loadStatusUsuarios();
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.error = 'Error al crear el status de usuario. Revisa la consola para más detalles.';
          
          if (err.error && err.error.message) {
            this.error += ' ' + err.error.message;
          } else if (err.message) {
            this.error += ' ' + err.message;
          }
        }
      });
    } else {
      // Actualizar status usuario existente
      // Obtener usuario del localStorage igual que en el ejemplo
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      const usuarioModificacion = usuarioLocal.id || '';

      // Buscar el status usuario original para obtener fechaCreacion y usuarioCreacion
      const statusUsuarioOriginal = this.statusUsuarios.find(s => s.idstatususuario === this.statusUsuario.idstatususuario);

      const statusUsuarioToUpdate: any = {
        idstatususuario: this.statusUsuario.idstatususuario,
        nombre: this.statusUsuario.nombre.trim(),
        fechaCreacion: statusUsuarioOriginal?.fechaCreacion || new Date(), // Mantener fecha original
        usuarioCreacion: statusUsuarioOriginal?.usuarioCreacion || '', // Mantener usuario original
        fechaModificacion: new Date(),
        usuarioModificacion: usuarioModificacion
      };

      console.log('Enviando status usuario para actualizar:', statusUsuarioToUpdate);
      console.log('Usuario que está modificando (ID):', usuarioModificacion);
      console.log('Status usuario original encontrado:', statusUsuarioOriginal);

      this.statusUsuarioService.updateStatusUsuario(this.statusUsuario.idstatususuario, statusUsuarioToUpdate).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          alert('Status de usuario actualizado exitosamente.');
          this.onReset();
          this.loadStatusUsuarios();
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.error = 'Error al actualizar el status de usuario. Revisa la consola para más detalles.';
          
          if (err.error && err.error.message) {
            this.error += ' ' + err.error.message;
          } else if (err.message) {
            this.error += ' ' + err.message;
          }
        }
      });
    }
  }

  onEdit(statusUsr: StatusUsuario): void {
    // Preparar el objeto para edición - solo campos necesarios
    this.statusUsuario = {
      idstatususuario: statusUsr.idstatususuario,
      nombre: statusUsr.nombre
    };
    
    console.log('Editando status usuario:', statusUsr);
  }

  onDelete(idstatususuario: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este status de usuario?')) {
      this.statusUsuarioService.deleteStatusUsuario(idstatususuario).subscribe({
        next: () => {
          alert('Status de usuario eliminado exitosamente.');
          this.loadStatusUsuarios();
        },
        error: (err) => {
          this.error = 'Error al eliminar el status de usuario: ' + err.message;
          console.error('Error al eliminar el status de usuario:', err);
        }
      });
    }
  }

  onReset(): void {
    this.initializeStatusUsuario();
    this.error = ''; // Limpiar errores al resetear
  this.isEditMode = false;
  }
}