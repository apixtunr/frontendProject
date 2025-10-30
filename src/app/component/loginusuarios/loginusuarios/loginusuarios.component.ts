import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginusuarios',
  templateUrl: './loginusuarios.component.html',
  styleUrls: ['./loginusuarios.component.css'],
  standalone: false
})
export class LoginusuariosComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      idUsuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const usuario = this.loginForm.value;
      
      this.usuarioService.login(usuario).subscribe(
        (resp: any) => {
          this.isLoading = false;
          
          if (resp.success && resp.usuario) {
            localStorage.setItem("usuario", JSON.stringify(resp.usuario));
            this.router.navigate(['/menu']);
            alert("Bienvenido " + resp.usuario.nombre + " " + resp.usuario.apellido);
          } else {
            this.errorMessage = resp.message || "Credenciales incorrectas";
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error completo:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 500) {
            // Error del servidor
            if (error.error && error.error.message) {
              this.errorMessage = this.getErrorMessage(error.error.message);
            } else if (error.message) {
              // Buscar RuntimeException en el mensaje de error
              if (error.message.includes('Contraseña incorrecta')) {
                this.errorMessage = 'La contraseña ingresada es incorrecta';
              } else if (error.message.includes('Usuario no encontrado')) {
                this.errorMessage = 'El usuario ingresado no existe';
              } else if (error.message.includes('Usuario bloqueado')) {
                this.errorMessage = 'Su usuario ha sido bloqueado por múltiples intentos fallidos';
              } else if (error.message.includes('Tipo de acceso no encontrado')) {
                this.errorMessage = 'Credenciales incorrectas';
              } else {
                this.errorMessage = "Error interno del servidor";
              }
            } else {
              this.errorMessage = "Error interno del servidor";
            }
          } else if (error.status === 400) {
            this.errorMessage = "Datos de login inválidos";
          } else if (error.status === 401) {
            this.errorMessage = "Usuario o contraseña incorrectos";
          } else if (error.status === 0) {
            this.errorMessage = "No se puede conectar con el servidor";
          } else {
            // Para el error actual que viene del RuntimeException
            if (error.error && typeof error.error === 'string' && error.error.includes('RuntimeException')) {
              if (error.error.includes('Contraseña incorrecta')) {
                this.errorMessage = 'La contraseña ingresada es incorrecta';
              } else if (error.error.includes('Tipo de acceso no encontrado')) {
                this.errorMessage = 'Credenciales incorrectas';
              } else {
                this.errorMessage = 'Error en la validación de credenciales';
              }
            } else {
              this.errorMessage = "Error inesperado. Intente nuevamente.";
            }
          }
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private getErrorMessage(errorText: string): string {
    // Mapear mensajes técnicos a mensajes amigables
    if (errorText.includes('Contraseña incorrecta')) {
      return 'La contraseña ingresada es incorrecta';
    } else if (errorText.includes('Usuario no encontrado')) {
      return 'El usuario ingresado no existe';
    } else if (errorText.includes('Usuario bloqueado')) {
      return 'Su usuario ha sido bloqueado por múltiples intentos fallidos';
    } else if (errorText.includes('Tipo de acceso no encontrado')) {
      return 'Credenciales incorrectas';
    }
    
    return errorText;
  }

  clearError() {
    this.errorMessage = '';
  }
}