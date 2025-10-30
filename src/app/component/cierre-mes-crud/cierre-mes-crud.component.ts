import { Component, OnInit } from '@angular/core';
import { CierreMesService } from '../../service/cierreMes.service'; // Ya no importamos CierreMesResponse
// ... (resto de imports)

interface UsuarioLogueado {
  id: string; 
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-cierre-mes-crud',
  standalone: false,
  templateUrl: './cierre-mes-crud.component.html',
  styleUrl: './cierre-mes-crud.component.css'
})
export class CierreMesCRUDComponent implements OnInit {
  usuarioLogueado: UsuarioLogueado = { id: '', nombre: 'Invitado', rol: 'No asignado' }; 
  isLoading: boolean = false;
  mensajeEstado: string = '';
  errorMensaje: string = '';

  constructor(private cierreMesService: CierreMesService) { }

  ngOnInit(): void {
    const usuarioString = localStorage.getItem('usuario'); 

    if (usuarioString) {
      try {
        const parsedUsuario: any = JSON.parse(usuarioString);
        this.usuarioLogueado = {
          id: parsedUsuario.id || '',
          nombre: parsedUsuario.nombre || parsedUsuario.username || 'Usuario Desconocido', 
          rol: parsedUsuario.rol || 'Rol Desconocido'
        };
      } catch (e) {
        console.error("Error al parsear el objeto de usuario del localStorage:", e);
        this.usuarioLogueado.nombre = 'Error al cargar usuario';
        this.usuarioLogueado.rol = 'Error';
      }
    } 
  }

  confirmarYEjecutarCierreMes(): void {
    const confirmacion = window.confirm(
      "¿Está seguro de continuar?\n" +
      "Se generará el corte de fin de mes. Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      this.ejecutarCierreDeMes();
    } else {
      this.mensajeEstado = '';
      this.errorMensaje = '';
    }
  }

  ejecutarCierreDeMes(): void {
    this.isLoading = true;
    this.mensajeEstado = 'Iniciando el proceso de cierre de mes... por favor espere.';
    this.errorMensaje = '';

    // Ahora response será directamente un string
    this.cierreMesService.cerrarMes(this.usuarioLogueado.id).subscribe({
      next: (response: string) => { // <--- CAMBIO CLAVE AQUÍ: response es de tipo string
        this.mensajeEstado = response; // Usamos la respuesta directamente como el mensaje
        window.alert(this.mensajeEstado);
        console.log('Cierre de mes exitoso:', response);
      },
      error: (error) => {
        // En caso de error, 'error.error' podría ser también un string de texto plano si el backend
        // envía un mensaje de error no-JSON.
        this.errorMensaje = error.error || 'Hubo un error al intentar cerrar el mes.'; 
        window.alert('Error: ' + this.errorMensaje);
        console.error('Error al cerrar el mes:', error);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Proceso de cierre de mes completado.');
      }
    });
  }
}