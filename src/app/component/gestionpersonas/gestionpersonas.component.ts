import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../service/persona.service';
import { GeneroService } from '../../service/genero.service';
import { EstadoCivilService } from '../../service/estadocivil.service';
import { TipoDocumentoService } from '../../service/tipodocumento.service';
import { PermisoService } from '../../service/permisoservice';
import { Persona } from '../../entity/persona';
import { EstadoCivil } from '../../entity/estadoCivil';
import { TipoDocumento } from '../../entity/tipoDocumento';
import { Genero } from '../../entity/genero';
import { RolOpcion } from '../../entity/rolopcion';
import { DocumentoPersona } from '../../entity/documentoPersona';
import { DocumentoPersonaRequest } from '../../entity/documentoPersonaRequest';
import { DocumentoPersonaService } from '../../service/documentopersona.service';
import { CuentaService } from '../../service/cuenta.service';

@Component({
  selector: 'app-gestionpersonas',
  standalone: false,
  templateUrl: './gestionpersonas.component.html',
  styleUrl: './gestionpersonas.component.css'
})
export class GestionpersonasComponent implements OnInit {
  personaEditando?: Persona;
  permisosUsuario: RolOpcion | undefined;
  isEditMode = false;

  // Documentos de persona
  documentosPersona: DocumentoPersona[] = [];
  mostrarModalDocumento = false;
  documentoForm!: FormGroup;
  documentoEditando: DocumentoPersona | null = null;

  constructor(
    private personaService: PersonaService,
    private generoService: GeneroService,
    private estadoCivilService: EstadoCivilService,
    private tipoDocumentoService: TipoDocumentoService,
    private documentoPersonaService: DocumentoPersonaService,
    private fb: FormBuilder,
    private permisoService: PermisoService,
    private cuentaService: CuentaService
  ) {}

  loading = true;
  error = '';

  personaForm!: FormGroup;
  personas: Persona[] = [];
  estadosCiviles: EstadoCivil[] = [];
  tiposDocumento: TipoDocumento[] = [];
  //documentosPersona: DocumentoPersona[] = [];
  generos: Genero[] = [];

  // Método para inicializar el componente
  ngOnInit(): void {
    this.personaForm = this.fb.group({
      idPersona: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      idGenero: [null, Validators.required],
      direccion: [''],
      telefono: [''],
      correoElectronico: ['', [Validators.email]],
      idEstadoCivil: [null, Validators.required],
      // Campos de auditoría (solo lectura)
      fechacreacion: [{value: '', disabled: true}],
      usuariocreacion: [{value: '', disabled: true}],
      fechamodificacion: [{value: '', disabled: true}],
      usuariomodificacion: [{value: '', disabled: true}]
    });

    // Obtener permisos para gestión de personas (asumiendo idOpcion=10 para personas)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(128, idRole).subscribe((permiso) => {
      this.permisosUsuario = permiso;
    });

    // Cargar personas
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar personas';
        this.loading = false;
      }
    });

    // Cargar géneros
    this.generoService.getGeneros().subscribe({
      next: (data) => {
        this.generos = data;
      },
      error: (err) => {
        console.error('Error al cargar géneros:', err);
      }
    });

    // Cargar estados civiles
    this.estadoCivilService.getEstadosCiviles().subscribe({
      next: (data) => {
        this.estadosCiviles = data;
      },
      error: (err) => {
        console.error('Error al obtener estados civiles:', err);
      }
    });

    // Cargar tipos de documento
    this.tipoDocumentoService.getTiposDocumento().subscribe({
      next: (data) => {
        this.tiposDocumento = data;
      },
      error: (err) => {
        console.error('Error al obtener tipos de documento:', err);
      }
    });
  }

  // Método para obtener el nombre del estado civil por ID
  getEstadoCivilNombre(idEstadoCivil: number): string {
    const estadoCivil = this.estadosCiviles.find(e => e.idEstadoCivil === idEstadoCivil);
    return estadoCivil ? estadoCivil.nombre : 'No especificado';
  }

  // Método para obtener el nombre del género por ID
  getGeneroNombre(idGenero: number): string {
    const genero = this.generos.find(g => g.idgenero === idGenero);
    return genero ? genero.nombre : 'No especificado';
  }

  // Método para obtener el nombre del tipo de documento por ID
  getTipoDocumentoNombre(idTipoDocumento?: number): string {
    if (!idTipoDocumento) return ''; //Agregar mensaje vacio si no hay tipo de documento
    const tipoDoc = this.tiposDocumento.find(t => t.idTipoDocumento === idTipoDocumento);
    return tipoDoc ? tipoDoc.nombre : ''; //Agregar mensaje vacio si no se encuentra el tipo de documento
  }

  // Método para crear persona (con un solo documento)
  onSubmit() {
    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();
      console.log('No se pudo crear la persona: formulario inválido');
      return;
    }

  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
  const usuarioCreacion = usuarioLocal.idusuario || usuarioLocal.nombre || 'system';

    const persona: Persona = {
      nombre: this.personaForm.value.nombre,
      apellido: this.personaForm.value.apellido,
      fechaNacimiento: this.toDateOnly(this.personaForm.value.fechaNacimiento),
      idGenero: this.personaForm.value.idGenero,
      direccion: this.personaForm.value.direccion,
      telefono: this.personaForm.value.telefono,
      correoElectronico: this.personaForm.value.correoElectronico,
      idEstadoCivil: this.personaForm.value.idEstadoCivil,
      fechaCreacion: new Date().toISOString(),
      usuarioCreacion: usuarioCreacion,
      fechaModificacion: null,
      usuarioModificacion: null
    };

    this.personaService.createPersona(persona).subscribe({
      next: () => {
        alert('Persona creada correctamente.');
        this.onReset();
        this.personaService.getPersonas().subscribe(data => {
          this.personas = data;
        });
      },
      error: (error) => {
        console.error('Error al crear persona:', error);
        alert('Error al crear la persona. Revise los datos e intente nuevamente.');
      }
    });
  }

  // Editar persona (trae los datos al formulario)
  onEdit(persona: Persona) {
    this.personaEditando = persona;
    this.personaForm.patchValue(persona);
  this.isEditMode = true;
  // Cargar documentos de la persona seleccionada
  this.cargarDocumentosPersona(persona.idPersona!);
  console.log('Editando persona:', persona);
  console.log('Valores del formulario:', this.personaForm.value);
  }

  // Método para eliminar persona
  onDelete(idPersona: number) {
    const confirmado = confirm('¿Estás seguro de eliminar esta persona?');
    if (!confirmado) return;

    this.personaService.deletePersona(idPersona).subscribe({
      next: () => {
        alert('Persona eliminada correctamente.');
        console.log('Persona eliminada correctamente');
        // Recargar la lista
        this.personaService.getPersonas().subscribe(data => {
          this.personas = data;
        });
      },
      error: (error) => {
        console.error('Error al eliminar persona:', error);
        alert('Error al eliminar la persona.');
      }
    });
  }

  // Método para actualizar persona
  onUpdate() {
    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();
      return;
    }

  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
  const usuarioModificacion = usuarioLocal.idusuario || usuarioLocal.nombre || 'system';

    const personaId = Number(this.personaForm.value.idPersona);

    const persona: Persona = {
      idPersona: personaId,
      nombre: this.personaForm.value.nombre,
      apellido: this.personaForm.value.apellido,
      fechaNacimiento: this.toDateOnly(this.personaForm.value.fechaNacimiento),
      idGenero: this.personaForm.value.idGenero,
      direccion: this.personaForm.value.direccion,
      telefono: this.personaForm.value.telefono,
      correoElectronico: this.personaForm.value.correoElectronico,
      idEstadoCivil: this.personaForm.value.idEstadoCivil,
      fechaCreacion: this.personaEditando?.fechaCreacion ?? new Date().toISOString(),
      usuarioCreacion: this.personaEditando?.usuarioCreacion ?? usuarioModificacion,
      fechaModificacion: new Date().toISOString(),
      usuarioModificacion: usuarioModificacion
    };

    this.personaService.updatePersona(personaId, persona).subscribe({
      next: () => {
        alert('Persona actualizada correctamente.');
        this.onReset();
        this.personaService.getPersonas().subscribe(data => {
          this.personas = data;
        });
      },
      error: (error) => {
        console.error('Error al actualizar persona:', error);
        alert('Error al actualizar la persona.');
      }
    });
  }

  // Método para resetear el formulario
  onReset() {
    this.personaForm.reset({
      idPersona: null,
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      idGenero: null,
      direccion: '',
      telefono: '',
      correoElectronico: '',
      idEstadoCivil: null,
      // Limpiar campos de auditoría
      fechacreacion: '',
      usuariocreacion: '',
      fechamodificacion: '',
      usuariomodificacion: ''
    });
    this.isEditMode = false;
    this.documentosPersona = [];
    this.cerrarModalDocumento();
  }

  // ----------- DOCUMENTOS PERSONA -----------
  cargarDocumentosPersona(idPersona: number) {
    this.documentoPersonaService.getAllByPersona(idPersona).subscribe({
      next: (docs) => this.documentosPersona = docs,
      error: () => this.documentosPersona = []
    });
  }

  abrirModalDocumento() {
    this.documentoEditando = null;
    this.initDocumentoForm();
    this.mostrarModalDocumento = true;
  }
  // Variable para almacenar la persona seleccionada para agregar documento
  personaParaDocumento: Persona | null = null;

  cerrarModalDocumento() {
    this.mostrarModalDocumento = false;
    this.documentoEditando = null;
    this.personaParaDocumento = null;
    if (this.documentoForm) this.documentoForm.reset();
  }

  initDocumentoForm() {
    this.documentoForm = this.fb.group({
      idtipodocumento: [this.documentoEditando?.idtipodocumento || '', Validators.required],
      nodocumento: [this.documentoEditando?.nodocumento || '', Validators.required]
    });
  }

  guardarDocumento() {
    if (this.documentoForm.invalid) return;
    // Determinar el id de persona: si hay personaParaDocumento, usar ese; si no, usar el del formulario de persona (modo edición)
    const idPersona = this.personaParaDocumento?.idPersona || this.personaForm.value.idPersona;
    if (!idPersona) return;
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuario = usuarioLocal.nombre || 'system';
    const docReq: DocumentoPersonaRequest = {
      idtipodocumento: Number(this.documentoForm.value.idtipodocumento),
      idpersona: idPersona,
      nodocumento: this.documentoForm.value.nodocumento,
      fechacreacion: new Date().toISOString(),
      usuariocreacion: usuario
    };
    if (this.documentoEditando) {
      // Actualizar (puedes ajustar si el backend espera el request también en update)
      this.documentoPersonaService.update(docReq.idtipodocumento, docReq.idpersona, docReq).subscribe({
        next: () => {
          this.cargarDocumentosPersona(docReq.idpersona);
          this.cerrarModalDocumento();
        },
        error: () => alert('Error al actualizar documento')
      });
    } else {
      // Crear
      this.documentoPersonaService.create(docReq).subscribe({
        next: () => {
          alert('Documento creado correctamente.');
          this.cargarDocumentosPersona(docReq.idpersona);
          this.cerrarModalDocumento();
        },
        error: (err) => {
          if (err.status === 409) alert('Ya existe un documento de ese tipo para esta persona');
          else alert('Error al agregar documento');
        }
      });
    }
  }

  editarDocumento(doc: DocumentoPersona) {
    this.documentoEditando = doc;
    this.initDocumentoForm();
    this.mostrarModalDocumento = true;
  }

  eliminarDocumento(doc: DocumentoPersona) {
    if (!confirm('¿Eliminar este documento?')) return;
    this.documentoPersonaService.delete(doc.idtipodocumento, doc.idpersona).subscribe({
      next: () => this.cargarDocumentosPersona(doc.idpersona),
      error: () => alert('Error al eliminar documento')
    });
  }

  abrirModalDocumentoDesdeTabla(persona: Persona) {
    this.personaParaDocumento = persona;
    this.initDocumentoForm();
    this.documentoEditando = null;
    this.mostrarModalDocumento = true;
  }

  // Normaliza a 'YYYY-MM-DD' sin hora ni zona
  private toDateOnly(value: any): string {
    if (!value) return '';
    // Si ya viene como 'YYYY-MM-DD', úsalo tal cual
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const d = new Date(value); // puede venir como Date (MatDatepicker) o string con hora
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

// Propiedades para mostrar documentos en modal
documentosParaVer: DocumentoPersona[] = [];
mostrarModalVerDocumentos = false;
personaDocumentosNombre: string = '';

verDocumentosPersona(persona: Persona) {
  this.documentoPersonaService.getAllByPersona(persona.idPersona!).subscribe({
    next: (docs) => {
      this.documentosParaVer = Array.isArray(docs) ? docs : [];
      this.personaDocumentosNombre = persona.nombre + ' ' + persona.apellido;
      this.mostrarModalVerDocumentos = true;
    },
    error: () => {
      this.documentosParaVer = [];
      this.mostrarModalVerDocumentos = true;
    }
  });
}

cerrarModalVerDocumentos() {
  this.mostrarModalVerDocumentos = false;
  this.documentosParaVer = [];
}
}
