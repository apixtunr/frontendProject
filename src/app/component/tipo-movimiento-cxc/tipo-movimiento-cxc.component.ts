import { TipoMovimientoCxc } from '../../entity/tipo-movimiento-cxc';
import { Component, OnInit } from '@angular/core';
import { TipoMovimientoCxcService } from '../../service/tipo-movimiento-cxc.service';

@Component({
  selector: 'app-tipo-movimiento-cxc',
  standalone: false, // <- cambiar a false o eliminar la propiedad
  templateUrl: './tipo-movimiento-cxc.component.html',
  styleUrls: ['./tipo-movimiento-cxc.component.css']
})
export class TipoMovimientoCxcComponent implements OnInit {
  movimientos: TipoMovimientoCxc[] = [];
  nuevoMovimiento: TipoMovimientoCxc = this.inicializarMovimiento();
  editando: boolean = false;
  message: string = '';

  constructor(private movimientoCxcService: TipoMovimientoCxcService) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.movimientoCxcService.getTiposMovimientoCxc().subscribe({
      next: (movimientos) => (this.movimientos = movimientos),
      error: (err) => console.error('Error al cargar movimientos', err),
    });
  }

  guardar(): void {
    // Asignar usuario y fechas automáticamente
    const usuarioActual = 'admin'; // <-- puedes obtenerlo luego del login real
    const fechaActual = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

    if (this.editando) {
      this.nuevoMovimiento.fechaModificacion = fechaActual;
      this.nuevoMovimiento.usuarioModificacion = usuarioActual;

      this.movimientoCxcService.updateTipoMovimientoCxc(this.nuevoMovimiento).subscribe({
        next: () => {
          this.cargarMovimientos();
          this.cancelar();
        },
        error: (err) => console.error('Error al actualizar movimiento', err),
      });
    } else {
      this.nuevoMovimiento.fechaCreacion = fechaActual;
      this.nuevoMovimiento.usuarioCreacion = usuarioActual;
      this.nuevoMovimiento.fechaModificacion = fechaActual;
      this.nuevoMovimiento.usuarioModificacion = usuarioActual;

      this.movimientoCxcService.createTipoMovimientoCxc(this.nuevoMovimiento).subscribe({
        next: () => {
          this.cargarMovimientos();
          this.cancelar();
        },
        error: (err) => console.error('Error al crear movimiento', err),
      });
    }
  }

  editar(movimiento: TipoMovimientoCxc): void {
    this.nuevoMovimiento = { ...movimiento };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este tipo de movimiento?')) {
      this.movimientoCxcService.deleteTipoMovimientoCxc(id).subscribe({
        next: () => this.cargarMovimientos(),
        error: (err) => console.error('Error al eliminar movimiento', err),
      });
    }
  }

  cancelar(): void {
    this.nuevoMovimiento = this.inicializarMovimiento();
    this.editando = false;
  }

  private inicializarMovimiento(): TipoMovimientoCxc {
    return {
      idTipoMovimientoCxc: 0,
      nombre: '',
      operacionCuentaCorriente: 1,
      fechaCreacion: '',
      usuarioCreacion: '',
      fechaModificacion: '',
      usuarioModificacion: ''
    };
  }
}
