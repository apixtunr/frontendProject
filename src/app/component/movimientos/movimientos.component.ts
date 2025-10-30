import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoCxcService } from '../../service/movimiento-cxc.service';
import { PersonaDto } from '../../entity/persona.dto';
import { CuentaDto } from '../../entity/cuenta.dto';
import { TipoMovimientoCxcDto } from '../../entity/tipo-movimiento-cxc.dto';
import { RegistroMovimientoRequest } from '../../entity/registro-movimiento.request';
import { RegistroMovimientoResponse } from '../../entity/registro-movimiento.response';

@Component({
  selector: 'app-movimientos',
  standalone: false, // <- cambiar a false o eliminar la propiedad
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  movimientoForm: FormGroup;
  personas: PersonaDto[] = [];
  cuentas: CuentaDto[] = [];
  tipos: TipoMovimientoCxcDto[] = [];
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private movimientoService: MovimientoCxcService
  ) {
    this.movimientoForm = this.fb.group({
      idPersona: [null, Validators.required],
      // Inicializar idSldCuenta como disabled para evitar warning al usar formControlName
      idSldCuenta: [{ value: null, disabled: true }, Validators.required],
      idTM: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPersonas();
    this.cargarTiposMovimiento();
  }

  cargarPersonas(): void {
    this.movimientoService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        // si se cargaron personas, limpiar mensaje de error
        this.message = '';
      },
      error: (err) => {
        console.error('Error cargando personas', err);
        this.message = 'Error al cargar personas';
      }
    });
  }

  cargarTiposMovimiento(): void {
    this.movimientoService.getTiposMovimientoCxc().subscribe({
      next: (data) => this.tipos = data,
      error: () => this.message = 'Error al cargar tipos de movimiento'
    });
  }

  onPersonaChange(): void {
    const idPersona = this.movimientoForm.get('idPersona')?.value;
    // reset cuentas y control si no hay persona seleccionada
    if (!idPersona) {
      this.cuentas = [];
      this.movimientoForm.get('idSldCuenta')?.reset();
      this.movimientoForm.get('idSldCuenta')?.disable();
      return;
    }

    this.movimientoService.getCuentasPorPersona(+idPersona).subscribe({
      next: (data) => {
        this.cuentas = data || [];
        if (this.cuentas.length > 0) {
          this.movimientoForm.get('idSldCuenta')?.enable();
        } else {
          this.movimientoForm.get('idSldCuenta')?.reset();
          this.movimientoForm.get('idSldCuenta')?.disable();
        }
      },
      error: (err) => {
        console.error('Error al cargar cuentas', err);
        this.message = 'Error al cargar cuentas de la persona';
        this.cuentas = [];
        this.movimientoForm.get('idSldCuenta')?.reset();
        this.movimientoForm.get('idSldCuenta')?.disable();
      }
    });
  }

  private obtenerUsuarioLocal(): string {
    const raw = localStorage.getItem('usuario');
    if (!raw) return 'system';
    try {
      const u = JSON.parse(raw);
      return u?.nombre || u?.id || u?.idUsuario || 'system';
    } catch {
      return String(raw);
    }
  }

  submit(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    const req: RegistroMovimientoRequest = {
      idPersona: Number(this.movimientoForm.value.idPersona),
      idSldCuenta: Number(this.movimientoForm.value.idSldCuenta),
      idTM: Number(this.movimientoForm.value.idTM),
      fecha: new Date().toISOString(),
      monto: Number(this.movimientoForm.value.monto),
      descripcion: this.movimientoForm.value.descripcion || '',
      user: this.obtenerUsuarioLocal()
    };

    this.loading = true;
    this.movimientoService.registrarMovimiento(req).subscribe({
      next: (resp: RegistroMovimientoResponse) => {
        this.loading = false;
        this.message = resp?.mensaje || 'Movimiento registrado';
        this.movimientoForm.reset();
        this.cuentas = [];
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.message = 'Error al registrar movimiento';
      }
    });
  }
}
