import { Component, OnInit } from '@angular/core';
import { StatusCuenta } from '../../entity/statusCuenta';
import { StatusCuentaService } from '../../service/statusCuenta.service';

@Component({
  selector: 'app-crudstatuscuenta',
  standalone: false,
  templateUrl: './crudstatuscuenta.component.html',
  styleUrls: ['./crudstatuscuenta.component.css']
})
export class CrudstatuscuentaComponent implements OnInit {
  statusCuentas: StatusCuenta[] = [];
  nuevoStatus: StatusCuenta = this.inicializarStatus();
  editando = false;
  message = '';

  constructor(private svc: StatusCuentaService) {}

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista(): void {
    this.svc.getStatusCuentas().subscribe({
      next: (data) => { this.statusCuentas = data || []; this.message = ''; },
      error: (err) => { console.error('Error cargando status cuenta', err); this.message = 'Error al cargar estados'; }
    });
  }

  guardar(): void {
    const usuario = 'admin';
    const fecha = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

    if (this.editando) {
      this.nuevoStatus.fechaModificacion = fecha;
      this.nuevoStatus.usuarioModificacion = usuario;
      this.svc.updateStatusCuenta(this.nuevoStatus).subscribe({
        next: () => { this.cargarLista(); this.cancelar(); this.message = 'Actualizado correctamente'; },
        error: (err) => { console.error(err); this.message = 'Error al actualizar'; }
      });
    } else {
      this.nuevoStatus.fechaCreacion = fecha;
      this.nuevoStatus.usuarioCreacion = usuario;
      this.nuevoStatus.fechaModificacion = fecha;
      this.nuevoStatus.usuarioModificacion = usuario;
      this.svc.createStatusCuenta(this.nuevoStatus).subscribe({
        next: () => { this.cargarLista(); this.cancelar(); this.message = 'Creado correctamente'; },
        error: (err) => { console.error(err); this.message = 'Error al crear'; }
      });
    }
  }

  editar(s: StatusCuenta): void {
    this.nuevoStatus = { ...s };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este estado de cuenta?')) return;
    this.svc.deleteStatusCuenta(id).subscribe({
      next: () => { this.cargarLista(); this.message = 'Eliminado correctamente'; },
      error: (err) => { console.error(err); this.message = 'Error al eliminar'; }
    });
  }

  cancelar(): void {
    this.nuevoStatus = this.inicializarStatus();
    this.editando = false;
  }

  private inicializarStatus(): StatusCuenta {
    return {
      idStatusCuenta: 0,
      descripcion: '',
      fechaCreacion: '',
      usuarioCreacion: '',
      fechaModificacion: '',
      usuarioModificacion: ''
    };
  }
}
