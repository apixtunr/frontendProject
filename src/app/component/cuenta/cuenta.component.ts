import { Component, OnInit } from '@angular/core';
import { CuentaService, CuentaDto, CreateCuentaRequest, DocumentoPersona, TipoSaldoCuenta, StatusCuenta } from '../../service/cuenta.service';

@Component({
  selector: 'app-cuenta',
  standalone: false,
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent implements OnInit {
  
  // Propiedades para búsqueda de persona
  personaId: number | null = null;
  nombrePersona: string | null = null;
  loading = false;
  error: string | null = null;

  // Propiedades para gestión de cuentas
  cuentas: CuentaDto[] = [];
  cuentaSeleccionada: CuentaDto | null = null;
  saldoCalculado: number | null = null;

  // Propiedades para tipos de saldo
  tiposSaldoCuenta: TipoSaldoCuenta[] = [];
  cargandoTipos = false;

  // Propiedades para status de cuenta
  statusCuenta: StatusCuenta[] = [];
  cargandoStatus = false;

  // Propiedades para creación de cuenta
  nuevaCuenta: CreateCuentaRequest = {
    idpersona: 0,
    idstatuscuenta: 0, // Se establecerá cuando se carguen los status
    idtiposaldocuenta: 0, // Se establecerá cuando se carguen los tipos
    saldoanterior: 0,
    debitos: 0,
    creditos: 0,
    usuariocreacion: (() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      return usuario.id || 'system';
    })()
  };

  // Propiedades para documentos
  documentos: DocumentoPersona[] = [];
  mostrarDocumentos = false;

  // Estados
  creandoCuenta = false;
  calculandoSaldo = false;
  cargandoCuentas = false;
  cargandoDocumentos = false;
  successMessage: string | null = null;

  constructor(private cuentaService: CuentaService) { }

  ngOnInit() {
    this.cargarTiposSaldoCuenta();
    this.cargarStatusCuenta();
  }

  // Método que se ejecuta cuando cambia el ID de persona
  onPersonaIdChange() {
    this.nombrePersona = null;
    this.error = null;
    this.limpiarCuentas();
    
    if (!this.personaId || this.personaId <= 0) {
      this.nombrePersona = null;
      return;
    }
    
    this.loading = true;
    
    this.cuentaService.obtenerNombrePersonaPorId(this.personaId).subscribe({
      next: (nombreCompleto) => {
        this.nombrePersona = nombreCompleto?.trim() || 'Persona no encontrada';
        this.loading = false;
        
        if (this.nombrePersona && !this.nombrePersona.includes('no encontrada')) {
          this.nuevaCuenta.idpersona = this.personaId!;
          this.cargarCuentasPersona();
        }
      },
      error: (error) => {
        console.error('Error al buscar persona:', error);
        this.error = 'Error: Persona no encontrada';
        this.nombrePersona = null;
        this.loading = false;
      }
    });
  }

  // Cargar todas las cuentas de una persona
  cargarCuentasPersona() {
    if (!this.personaId) return;
    
    this.cargandoCuentas = true;
    this.cuentaService.listByPersona(this.personaId).subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas || [];
        this.cargandoCuentas = false;
      },
      error: (error) => {
        console.error('Error al cargar cuentas:', error);
        this.error = 'Error al cargar las cuentas';
        this.cargandoCuentas = false;
      }
    });
  }

  // Crear nueva cuenta
  crearCuenta() {
    // Validaciones
    if (!this.personaId || this.personaId <= 0) {
      this.error = 'Debe seleccionar una persona válida';
      return;
    }

    if (!this.nuevaCuenta.idtiposaldocuenta || this.nuevaCuenta.idtiposaldocuenta <= 0) {
      this.error = 'Debe seleccionar un tipo de saldo';
      return;
    }

    if (!this.nuevaCuenta.idstatuscuenta || this.nuevaCuenta.idstatuscuenta <= 0) {
      this.error = 'Debe seleccionar un status de cuenta';
      return;
    }

    this.creandoCuenta = true;
    this.error = null;
    this.successMessage = null;

    // Preparar el objeto para envío
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const nombreUsuario = usuario?.id;
    console.log('Nombre de usuario para creación:', nombreUsuario);
    const cuentaParaCrear: CreateCuentaRequest = {
      idpersona: this.personaId,
      idstatuscuenta: Number(this.nuevaCuenta.idstatuscuenta),
      idtiposaldocuenta: Number(this.nuevaCuenta.idtiposaldocuenta),
      saldoanterior: this.nuevaCuenta.saldoanterior || 0,
      debitos: this.nuevaCuenta.debitos || 0,
      creditos: this.nuevaCuenta.creditos || 0,
      fechacreacion: new Date().toISOString(),
      usuariocreacion: nombreUsuario || 'system'
    };

    console.log('Enviando cuenta:', cuentaParaCrear); // Para debug

    this.cuentaService.createCuenta(cuentaParaCrear).subscribe({
      next: (cuenta) => {
        this.successMessage = `Cuenta creada exitosamente (ID: ${cuenta.idsaldocuenta})`;
        this.creandoCuenta = false;
        this.limpiarFormularioCreacion();
        this.cargarCuentasPersona(); // Recargar lista
      },
      error: (error) => {
        console.error('Error al crear cuenta:', error);
        this.error = 'Error al crear la cuenta: ' + (error.error?.message || error.message || 'Error desconocido');
        this.creandoCuenta = false;
      }
    });
  }

  // Seleccionar cuenta para operaciones
  seleccionarCuenta(cuenta: CuentaDto) {
    this.cuentaSeleccionada = cuenta;
    this.saldoCalculado = null;
  }

  // Calcular saldo de cuenta seleccionada
  calcularSaldoCuenta() {
    if (!this.cuentaSeleccionada) return;

    this.calculandoSaldo = true;
    this.cuentaService.calcularSaldo(this.cuentaSeleccionada.idsaldocuenta).subscribe({
      next: (resultado) => {
        this.saldoCalculado = resultado.saldoActual;
        this.calculandoSaldo = false;
      },
      error: (error) => {
        console.error('Error al calcular saldo:', error);
        this.error = 'Error al calcular el saldo';
        this.calculandoSaldo = false;
      }
    });
  }

  // Cargar documentos de la persona
  cargarDocumentos() {
    if (!this.personaId) return;

    // Abrir el modal primero
    const modalElement = document.getElementById('documentosModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }

    this.cargandoDocumentos = true;
    
    this.cuentaService.obtenerDocumentosPersona(this.personaId).subscribe({
      next: (documentos) => {
        this.documentos = documentos || [];
        this.cargandoDocumentos = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.error = 'Error al cargar los documentos';
        this.cargandoDocumentos = false;
      }
    });
  }

  // Calcular saldo usando la fórmula: SaldoActual = SaldoAnterior + Debitos - Creditos
  calcularSaldoFormula(cuenta: CuentaDto): number {
    const saldoAnterior = cuenta.saldoanterior || 0;
    const debitos = cuenta.debitos || 0;
    const creditos = cuenta.creditos || 0;
    return saldoAnterior + debitos - creditos;
  }

  // Limpiar formularios y datos
  limpiarFormulario() {
    this.personaId = null;
    this.nombrePersona = null;
    this.error = null;
    this.successMessage = null;
    this.limpiarCuentas();
    this.limpiarFormularioCreacion();
  }

  limpiarCuentas() {
    this.cuentas = [];
    this.cuentaSeleccionada = null;
    this.saldoCalculado = null;
    this.documentos = [];
    this.mostrarDocumentos = false;
    
    // Cerrar modal si está abierto
    const modalElement = document.getElementById('documentosModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  
  limpiarFormularioCreacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.nuevaCuenta = {
      idpersona: this.personaId || 0,
      idstatuscuenta: this.statusCuenta.length > 0 ? this.statusCuenta[0].idstatuscuenta : 0,
      idtiposaldocuenta: this.tiposSaldoCuenta.length > 0 ? this.tiposSaldoCuenta[0].idtiposaldocuenta : 0,
      saldoanterior: 0,
      debitos: 0,
      creditos: 0,
      usuariocreacion: usuario.id || 'system'
    };
  }

  ocultarDocumentos() {
    this.mostrarDocumentos = false;
  }

  // Cargar tipos de saldo cuenta desde la base de datos
  cargarTiposSaldoCuenta() {
    this.cargandoTipos = true;
    this.cuentaService.getTiposSaldoCuenta().subscribe({
      next: (tipos) => {
        this.tiposSaldoCuenta = tipos || [];
        this.cargandoTipos = false;
        
        // Si hay tipos disponibles, seleccionar el primero por defecto
        if (this.tiposSaldoCuenta.length > 0 && (!this.nuevaCuenta.idtiposaldocuenta || this.nuevaCuenta.idtiposaldocuenta === 0)) {
          this.nuevaCuenta.idtiposaldocuenta = this.tiposSaldoCuenta[0].idtiposaldocuenta;
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de saldo:', error);
        this.error = 'Error al cargar los tipos de saldo cuenta';
        this.cargandoTipos = false;
      }
    });
  }

  // Obtener el nombre del tipo de saldo por ID
  obtenerNombreTipoSaldo(idTipo: number): string {
    const tipo = this.tiposSaldoCuenta.find(t => t.idtiposaldocuenta === idTipo);
    return tipo ? tipo.nombre : `Tipo ${idTipo}`;
  }

  // Cargar status de cuenta desde la base de datos
  cargarStatusCuenta() {
    this.cargandoStatus = true;
    this.cuentaService.getStatusCuenta().subscribe({
      next: (statusList) => {
        this.statusCuenta = statusList || [];
        this.cargandoStatus = false;
        
        // Si hay status disponibles, seleccionar el primero por defecto
        if (this.statusCuenta.length > 0 && (!this.nuevaCuenta.idstatuscuenta || this.nuevaCuenta.idstatuscuenta === 0)) {
          this.nuevaCuenta.idstatuscuenta = this.statusCuenta[0].idstatuscuenta;
        }
      },
      error: (error) => {
        console.error('Error al cargar status de cuenta:', error);
        this.error = 'Error al cargar los status de cuenta';
        this.cargandoStatus = false;
      }
    });
  }

  // Obtener el nombre del status por ID
  obtenerNombreStatus(idStatus: number): string {
    const status = this.statusCuenta.find(s => s.idstatuscuenta === idStatus);
    return status ? status.nombre : `Status ${idStatus}`;
  }
}
