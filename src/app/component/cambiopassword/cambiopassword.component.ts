import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CambiarpasswordService } from '../../service/cambiarpassword.service';

@Component({
  selector: 'app-cambiopassword',
  standalone: false,
  templateUrl: './cambiopassword.component.html',
  styleUrls: ['./cambiopassword.component.css'],
})
export class CambiopasswordComponent {
  preguntaSeguridad: string | null = null;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  buscarForm: FormGroup;
  cambioForm: FormGroup;

  constructor(private fb: FormBuilder, private cambiarpasswordService: CambiarpasswordService) {
    this.buscarForm = this.fb.group({
      idUsuario: ['', Validators.required]
    });

    this.cambioForm = this.fb.group({
      respuestaSeguridad: ['', Validators.required],
      nuevaPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  obtenerPregunta() {
    this.mensajeError = null;
    this.mensajeExito = null;
    const idUsuario = this.buscarForm.value.idUsuario;

    this.cambiarpasswordService.obtenerPregunta(idUsuario).subscribe({
      next: (data) => {
        this.preguntaSeguridad = data.preguntaSeguridad;
      },
      error: (err) => {
        this.preguntaSeguridad = null;
        this.mensajeError = err.error || 'Usuario no encontrado.';
      }
    });
  }

  cambiarPassword() {
    this.mensajeError = null;
    this.mensajeExito = null;

    const payload = {
      idUsuario: this.buscarForm.value.idUsuario,
      respuestaSeguridad: this.cambioForm.value.respuestaSeguridad,
      nuevaPassword: this.cambioForm.value.nuevaPassword
    };

    this.cambiarpasswordService.cambiarPassword(payload).subscribe({
      next: (res : any) => {
        this.mensajeExito = res.mensaje; // ahora sí muestra el texto correctamente
        this.cambioForm.reset();
        this.buscarForm.reset();
        this.preguntaSeguridad = null;
      },
      error: (err) => {
        this.mensajeError = err.error || 'No se pudo cambiar la contraseña.';
      }
    });
  }
}
