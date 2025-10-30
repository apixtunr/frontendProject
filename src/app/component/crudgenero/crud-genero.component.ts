import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { Genero } from '../../entity/genero';
import { GeneroService } from '../../service/genero.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crud-genero',
  standalone: false, // Cambia a true si lo quieres standalone o false si lo quieres en un módulo
  templateUrl: './crud-genero.component.html',
  styleUrl: './crud-genero.component.css'
})
export class CrudGeneroComponent implements OnInit {
  permisosGenero: RolOpcion | undefined;
  isEditMode: boolean = false;
  loading = true;
  error = '';
  generos: Genero[] = []; // lista
  currentUser: string = ''; // Usuario actual del localStorage

  genero: any = {
    // objeto para crear/editar (usando any para flexibilidad con fechas)
    idgenero: 0,
    nombre: ''
    // Solo mantenemos los campos necesarios para el formulario
  };
  
  constructor(private generoService: GeneroService, private permisoService: PermisoService) {}

  ngOnInit(): void {
    // Obtener permisos para géneros (idOpcion=3)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(3, idRole).subscribe(permiso => {
      this.permisosGenero = permiso;
    });
    this.getCurrentUser();
    this.initializeGenero();
    this.loadGeneros();
  }

  /**
   * Obtiene el usuario actual del localStorage
   */
  getCurrentUser(): void {
    try {
      // Intentar obtener el objeto JSON del localStorage
      const userDataString = localStorage.getItem('usuario') || 
                            localStorage.getItem('user') || 
                            localStorage.getItem('currentUser') ||
                            localStorage.getItem('userData');

      if (userDataString) {
        // Parsear el JSON
        const userData = JSON.parse(userDataString);
        
        // Extraer el email/correo del objeto
        // Ajusta estas propiedades según la estructura de tu JSON
        this.currentUser = userData.email || 
                          userData.correo || 
                          userData.mail || 
                          userData.usuario ||
                          userData.username ||
                          userData.user ||
                          userData.nombre ||
                          'Usuario Anónimo';
        
        console.log('Usuario actual extraído del localStorage:', this.currentUser);
      } else {
        this.currentUser = 'Usuario Anónimo';
        console.warn('No se encontró información de usuario en localStorage');
      }
    } catch (error) {
      console.error('Error al parsear datos del usuario desde localStorage:', error);
      this.currentUser = 'Usuario Anónimo';
    }
  }

  /**
   * Inicializa el objeto genero con valores por defecto
   */
  initializeGenero(): void {
    this.genero = {
      idgenero: 0, // Se mantiene en 0, el backend lo asignará automáticamente
      nombre: ''
      // Solo mantenemos el nombre para el formulario simplificado
    };
  }

  loadGeneros(): void {
    this.generoService.getGeneros().subscribe({
      next: (data) => {
        this.generos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar géneros: ' + err.message;
        this.loading = false;
        console.error('Error al cargar géneros:', err);
      }
    });
  }

  onSubmit(): void {
    // Validación básica
    if (!this.genero.nombre || this.genero.nombre.trim() === '') {
      this.error = 'El nombre del género es requerido.';
      return;
    }

    if (this.genero.idgenero === 0) {
      // Crear nuevo género
      // Obtener usuario del localStorage igual que en el ejemplo
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      const usuarioCreacion = usuarioLocal.id || '';

      const newGenero: any = {
        nombre: this.genero.nombre.trim(),
        fechaCreacion: new Date(), // Fecha actual del día de HOY
        usuarioCreacion: usuarioCreacion
      };

      console.log('Enviando nuevo género:', newGenero);
      console.log('Usuario que está creando (ID):', usuarioCreacion);
      console.log('Fecha de creación (HOY):', new Date());

      this.generoService.createGenero(newGenero).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          alert('Género creado exitosamente.');
          this.onReset();
          this.loadGeneros();
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.error = 'Error al crear el género. Revisa la consola para más detalles.';
          
          if (err.error && err.error.message) {
            this.error += ' ' + err.error.message;
          } else if (err.message) {
            this.error += ' ' + err.message;
          }
        }
      });
    } else {
      // Actualizar género existente
      // Obtener usuario del localStorage igual que en el ejemplo
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      const usuarioModificacion = usuarioLocal.id || '';

      // Buscar el género original para obtener fechaCreacion y usuarioCreacion
      const generoOriginal = this.generos.find(g => g.idgenero === this.genero.idgenero);

      const generoToUpdate: any = {
        idgenero: this.genero.idgenero,
        nombre: this.genero.nombre.trim(),
        fechaCreacion: generoOriginal?.fechaCreacion || new Date(), // Mantener fecha original
        usuarioCreacion: generoOriginal?.usuarioCreacion || '', // Mantener usuario original
        fechaModificacion: new Date(),
        usuarioModificacion: usuarioModificacion
      };

      console.log('Enviando género para actualizar:', generoToUpdate);
      console.log('Usuario que está modificando (ID):', usuarioModificacion);
      console.log('Género original encontrado:', generoOriginal);

      this.generoService.updateGenero(this.genero.idgenero, generoToUpdate).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          alert('Género actualizado exitosamente.');
          this.onReset();
          this.loadGeneros();
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.error = 'Error al actualizar el género. Revisa la consola para más detalles.';
          
          if (err.error && err.error.message) {
            this.error += ' ' + err.error.message;
          } else if (err.message) {
            this.error += ' ' + err.message;
          }
        }
      });
    }
  }

  onEdit(gen: Genero): void {
    // Preparar el objeto para edición - solo campos necesarios
    this.genero = {
      idgenero: gen.idgenero,
      nombre: gen.nombre
    };
    
    console.log('Editando género:', gen);
  }

  onDelete(idgenero: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este género?')) {
      this.generoService.deleteGenero(idgenero).subscribe({
        next: () => {
          alert('Género eliminado exitosamente.');
          this.loadGeneros();
        },
        error: (err) => {
          this.error = 'Error al eliminar el género: ' + err.message;
          console.error('Error al eliminar el género:', err);
        }
      });
    }
  }

  onReset(): void {
    this.initializeGenero();
    this.error = '';
  this.isEditMode = false;
  }
}