import { Component, OnInit } from '@angular/core';
import { ConsultaSaldoService, ConsultaSaldoRequest, DetalleSaldoDto, ResultadoConsultaDto, SaldoCuentaEntity, TipoSaldoCuenta, StatusCuenta } from '../../../service/consulta-saldo.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-consulta-saldo',
  standalone: false,
  templateUrl: './consulta-saldo.component.html',
  styleUrl: './consulta-saldo.component.css'
})
export class ConsultaSaldoComponent implements OnInit {

  // Tipos de búsqueda
  tipoBusqueda: 'cliente' | 'cuenta' | 'nombre' = 'cliente';

  // Formulario de búsqueda
  consultaRequest: ConsultaSaldoRequest = {};

  // Resultados
  resultadoCliente: ResultadoConsultaDto | null = null;
  resultadoCuenta: DetalleSaldoDto | null = null;
  resultadosNombre: ResultadoConsultaDto[] = [];
  
  // Estados
  buscando = false;
  error: string | null = null;
  consultaRealizada = false;

  // Catálogos para nombres
  tiposSaldoCuenta: TipoSaldoCuenta[] = [];
  statusCuenta: StatusCuenta[] = [];
  cargandoCatalogos = false;

  constructor(private consultaSaldoService: ConsultaSaldoService) {}

  ngOnInit(): void {
    this.limpiarFormulario();
    this.cargarCatalogos();
  }

  // Cargar catálogos de tipos y status
  cargarCatalogos(): void {
    this.cargandoCatalogos = true;
    
    forkJoin({
      tipos: this.consultaSaldoService.obtenerTiposSaldoCuenta(),
      status: this.consultaSaldoService.obtenerStatusCuenta()
    }).subscribe({
      next: (resultado) => {
        this.tiposSaldoCuenta = resultado.tipos;
        this.statusCuenta = resultado.status;
        this.cargandoCatalogos = false;
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        this.cargandoCatalogos = false;
      }
    });
  }

  // Cambiar tipo de búsqueda y limpiar datos
  cambiarTipoBusqueda(tipo: 'cliente' | 'cuenta' | 'nombre'): void {
    this.tipoBusqueda = tipo;
    this.limpiarFormulario();
  }

  // Limpiar formulario y resultados
  limpiarFormulario(): void {
    this.consultaRequest = {};
    this.resultadoCliente = null;
    this.resultadoCuenta = null;
    this.resultadosNombre = [];
    this.error = null;
    this.consultaRealizada = false;
  }

  // Validar formulario según el tipo de búsqueda
  validarFormulario(): boolean {
    switch (this.tipoBusqueda) {
      case 'cliente':
        return !!this.consultaRequest.idCliente && this.consultaRequest.idCliente > 0;
      case 'cuenta':
        return !!this.consultaRequest.idCuenta && this.consultaRequest.idCuenta > 0;
      case 'nombre':
        return !!this.consultaRequest.nombre?.trim() && !!this.consultaRequest.apellido?.trim();
      default:
        return false;
    }
  }

  // Ejecutar la consulta
  consultarSaldo(): void {
    if (!this.validarFormulario()) {
      this.error = 'Complete todos los campos requeridos para la búsqueda';
      return;
    }

    // Validar que los catálogos estén cargados
    if (this.cargandoCatalogos) {
      this.error = 'Espere a que se carguen los catálogos...';
      return;
    }

    this.buscando = true;
    this.error = null;
    this.consultaRealizada = false;

    // Preparar request según tipo de búsqueda
    const request: ConsultaSaldoRequest = {};
    if (this.tipoBusqueda === 'cliente') {
      request.idCliente = this.consultaRequest.idCliente;
    } else if (this.tipoBusqueda === 'cuenta') {
      request.idCuenta = this.consultaRequest.idCuenta;
    } else if (this.tipoBusqueda === 'nombre') {
      request.nombre = this.consultaRequest.nombre?.trim();
      request.apellido = this.consultaRequest.apellido?.trim();
    }

    // Llamar al servicio
    this.consultaSaldoService.consultarSaldo(request).subscribe({
      next: (resultado) => {
        this.procesarResultado(resultado);
        this.buscando = false;
        this.consultaRealizada = true;
      },
      error: (error) => {
        console.error('Error en consulta de saldo:', error);
        if (error.status === 404) {
          this.error = 'No se encontró la cuenta o cliente solicitado.';
        } else {
          this.error = 'Error al consultar el saldo: ' + (error.error?.message || error.message || 'Error desconocido');
        }
        this.buscando = false;
        this.consultaRealizada = true;
      }
    });
  }

  // Procesar resultado según tipo de búsqueda
  private procesarResultado(resultado: any): void {
    if (this.tipoBusqueda === 'cliente') {
      this.procesarResultadoCliente(resultado as SaldoCuentaEntity[]);
    } else if (this.tipoBusqueda === 'cuenta') {
      this.procesarResultadoCuenta(resultado as SaldoCuentaEntity);
    } else if (this.tipoBusqueda === 'nombre') {
      this.procesarResultadoNombre(resultado as SaldoCuentaEntity[]);
    }
  }

  // Procesar resultado para búsqueda por cliente
  private procesarResultadoCliente(cuentas: SaldoCuentaEntity[]): void {
    cuentas = cuentas || [];
    if (cuentas.length === 0) {
      this.resultadoCliente = null;
      return;
    }

    const idPersona = cuentas[0].idpersona;
    
    // Obtener nombre de la persona
    this.consultaSaldoService.obtenerNombrePersona(idPersona).subscribe({
      next: (nombreCompleto) => {
        const cuentasDetalle: DetalleSaldoDto[] = cuentas.map(cuenta => this.convertirADetalleSaldo(cuenta, nombreCompleto));
        
        this.resultadoCliente = {
          persona: {
            idPersona: idPersona,
            nombreCompleto: nombreCompleto
          },
          cuentas: cuentasDetalle,
          totalSaldos: this.calcularTotalSaldos(cuentasDetalle)
        };
      },
      error: (error) => {
        console.error('Error al obtener nombre de persona:', error);
        // Usar nombres por defecto si falla
        const cuentasDetalle: DetalleSaldoDto[] = cuentas.map(cuenta => 
          this.convertirADetalleSaldo(cuenta, `Cliente ${idPersona}`)
        );
        
        this.resultadoCliente = {
          persona: {
            idPersona: idPersona,
            nombreCompleto: `Cliente ${idPersona}`
          },
          cuentas: cuentasDetalle,
          totalSaldos: this.calcularTotalSaldos(cuentasDetalle)
        };
      }
    });
  }

  // Procesar resultado para búsqueda por cuenta específica
  private procesarResultadoCuenta(cuenta: SaldoCuentaEntity): void {
    // Obtener nombre de la persona
    this.consultaSaldoService.obtenerNombrePersona(cuenta.idpersona).subscribe({
      next: (nombreCompleto) => {
        this.resultadoCuenta = this.convertirADetalleSaldo(cuenta, nombreCompleto);
      },
      error: (error) => {
        console.error('Error al obtener nombre de persona:', error);
        this.resultadoCuenta = this.convertirADetalleSaldo(cuenta, `Cliente ${cuenta.idpersona}`);
      }
    });
  }

  // Procesar resultado para búsqueda por nombre
  private procesarResultadoNombre(cuentas: SaldoCuentaEntity[]): void {
    if (cuentas.length === 0) return;

    // Agrupar cuentas por persona
    const cuentasPorPersona = new Map<number, SaldoCuentaEntity[]>();
    
    cuentas.forEach(cuenta => {
      if (!cuentasPorPersona.has(cuenta.idpersona)) {
        cuentasPorPersona.set(cuenta.idpersona, []);
      }
      cuentasPorPersona.get(cuenta.idpersona)!.push(cuenta);
    });

    // Obtener nombres de todas las personas
    const nombresObservables = Array.from(cuentasPorPersona.keys()).map(idPersona =>
      this.consultaSaldoService.obtenerNombrePersona(idPersona)
    );

    forkJoin(nombresObservables).subscribe({
      next: (nombres) => {
        this.resultadosNombre = [];
        let i = 0;
        
        cuentasPorPersona.forEach((cuentasPersona, idPersona) => {
          const nombreCompleto = nombres[i++];
          const cuentasDetalle: DetalleSaldoDto[] = cuentasPersona.map(cuenta => 
            this.convertirADetalleSaldo(cuenta, nombreCompleto)
          );
          
          this.resultadosNombre.push({
            persona: {
              idPersona: idPersona,
              nombreCompleto: nombreCompleto
            },
            cuentas: cuentasDetalle,
            totalSaldos: this.calcularTotalSaldos(cuentasDetalle)
          });
        });
      },
      error: (error) => {
        console.error('Error al obtener nombres:', error);
        // Fallback con nombres por defecto
        this.resultadosNombre = [];
        
        cuentasPorPersona.forEach((cuentasPersona, idPersona) => {
          const nombreCompleto = `Cliente ${idPersona}`;
          const cuentasDetalle: DetalleSaldoDto[] = cuentasPersona.map(cuenta => 
            this.convertirADetalleSaldo(cuenta, nombreCompleto)
          );
          
          this.resultadosNombre.push({
            persona: {
              idPersona: idPersona,
              nombreCompleto: nombreCompleto
            },
            cuentas: cuentasDetalle,
            totalSaldos: this.calcularTotalSaldos(cuentasDetalle)
          });
        });
      }
    });
  }

  // Convertir SaldoCuentaEntity a DetalleSaldoDto
  private convertirADetalleSaldo(cuenta: SaldoCuentaEntity, nombreCompleto: string): DetalleSaldoDto {
    const saldoInicial = cuenta.saldoanterior || 0;
    const debitos = cuenta.debitos || 0;
    const creditos = cuenta.creditos || 0;
    const saldoFinal = saldoInicial + debitos - creditos;

    // Obtener nombres reales de los catálogos
    const nombreTipoSaldo = this.obtenerNombreTipoSaldo(cuenta.idtiposaldocuenta);
    const nombreStatus = this.obtenerNombreStatus(cuenta.idstatuscuenta);

    return {
      idCuenta: cuenta.idsaldocuenta,
      idPersona: cuenta.idpersona,
      nombreCompleto: nombreCompleto,
      nombreTipoSaldo: nombreTipoSaldo,
      saldoInicial: saldoInicial,
      debitos: debitos,
      creditos: creditos,
      saldoFinal: saldoFinal,
      fechaUltimaActualizacion: cuenta.fechamodificacion || cuenta.fechacreacion || '',
      estado: nombreStatus
    };
  }

  // Obtener nombre del tipo de saldo por ID
  private obtenerNombreTipoSaldo(idTipoSaldo?: number): string {
    if (!idTipoSaldo) return 'Sin tipo';
    const tipo = this.tiposSaldoCuenta.find(t => t.idtiposaldocuenta === idTipoSaldo);
    return tipo ? tipo.nombre : `Tipo ${idTipoSaldo}`;
  }

  // Obtener nombre del status por ID
  private obtenerNombreStatus(idStatus?: number): string {
    if (!idStatus) return 'Sin status';
    const status = this.statusCuenta.find(s => s.idstatuscuenta === idStatus);
    return status ? status.nombre : `Status ${idStatus}`;
  }

  // Calcular total de saldos para vista de cliente
  calcularTotalSaldos(cuentas: DetalleSaldoDto[]): number {
    return cuentas.reduce((total, cuenta) => total + cuenta.saldoFinal, 0);
  }

  // Obtener clase CSS según el saldo (positivo/negativo)
  obtenerClaseSaldo(saldo: number): string {
    if (saldo > 0) return 'text-success';
    if (saldo < 0) return 'text-danger';
    return 'text-muted';
  }
}
