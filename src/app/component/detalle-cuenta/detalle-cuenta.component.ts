import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.component.html',
  styleUrls: ['./detalle-cuenta.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetalleCuentaComponent {
  @Input() cuentaSeleccionada: any;
  @Input() saldoCalculado: number | null = null;
  @Input() calculandoSaldo: boolean = false;
  @Input() calcularSaldoCuenta: () => void = () => {};
  @Input() calcularSaldoFormula: (cuenta: any) => number = () => 0;
  @Input() obtenerNombreTipoSaldo: (id: number) => string = () => '';
}
