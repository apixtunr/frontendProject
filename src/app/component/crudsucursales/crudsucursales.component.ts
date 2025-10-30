import { Sucursal } from './../../entity/sucursal';
import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../service/sucursal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../service/empresa.service';
import { PermisoService } from '../../service/permisoservice';
import { RolOpcion } from '../../entity/rolopcion';

@Component({
  selector: 'app-crudsucursales',
  standalone: false,
  templateUrl: './crudsucursales.component.html',
  styleUrl: './crudsucursales.component.css',
})
export class CrudsucursalesComponent implements OnInit {
  permisosSucursal: RolOpcion | undefined;
  constructor(
    private sucursalService: SucursalService,
    private fb: FormBuilder,
    private empresaService: EmpresaService
  , private permisoService: PermisoService
  ) {}

  loading = true;
  error = '';
  isEditMode = false; //Bandera para el modo edición

  sucursalForm!: FormGroup;
  sucursales: any[] = []; // lista de sucursales
  empresas: any[] = []; // lista de empresas

  //Método para inicializar el componente
  ngOnInit(): void {
    // Obtener permisos para sucursales (idOpcion=2)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idRole = usuario.rol;
    this.permisoService.getPermisos(2, idRole).subscribe(permiso => {
      this.permisosSucursal = permiso;
    });
    this.sucursalForm = this.fb.group({
      idSucursal: [0, Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      idEmpresa: [0, Validators.required],
    });

    this.sucursalService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data.sort((a: any, b: any) => a.idSucursal - b.idSucursal); //Carga la lista de las sucursales ordenadas por idSucursal
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar sucursales';
        this.loading = false;
      },
    });

    this.empresaService.getEmpresas().subscribe({
      next: (data) => (this.empresas = data), //Carga la lista de las empresas
      error: (err) => console.error('Error cargando empresas', err),
    });
  }

  //Método para crear sucursal
  onSubmit() {
    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioCreacion = usuarioLocal.id || ''; // Esto jala el idUsuario
    const formValue = this.sucursalForm.value;
    const idEmpresaNum = Number(formValue.idEmpresa);

    const { idSucursal, ...formValuesWithoutId } = this.sucursalForm.value;

    const sucursal: Sucursal = {
      ...formValuesWithoutId,

      //Valores por default
      idEmpresa: idEmpresaNum,
      fechaCreacion: new Date(),
      usuarioCreacion: usuarioCreacion,
      fechaModificacion: null,
      usuarioModificacion: null,
    };

    this.sucursalService.createSucursal(sucursal).subscribe({
      next: () => {
        console.log('Sucursal creada:', sucursal);
        alert('Sucursal creada correctamente.');
        this.ngOnInit(); // recargar la lista
      },
      error: () => {
        this.error = 'Error al crear sucursal';
      },
    });
  }

  //Editar sucursal (trae los datos al formulario)
  onEdit(sucursal: Sucursal) {
    this.sucursalForm.patchValue({
      idSucursal: sucursal.idSucursal,
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      idEmpresa: sucursal.idEmpresa,
    });
    this.isEditMode = true; // para cambiar el botón
  }

  //Método para eliminar sucursal
  onDelete(idSucursal: number) {
    const confirmado = confirm('¿Estás seguro de eliminar esta sucursal?');
    if (!confirmado) return;

    this.sucursalService.deleteSucursal(idSucursal).subscribe({
      next: () => {
        alert('Sucursal eliminada correctamente.');
        this.ngOnInit(); // recargar la lista
      },
      error: () => {
        this.error = 'Error al eliminar sucursal';
      },
    });
  }

  //Método para resetear el formulario
  onReset() {
    this.sucursalForm.reset({
      idSucursal: 0,
      nombre: '',
      direccion: '',
      idEmpresa: 0,
      fechaCreacion: new Date(),
      usuarioCreacion: '',
      fechaModificacion: new Date(),
      usuarioModificacion: '',
    });
    this.isEditMode = false; // volvemos al modo agregar
  }

  onUpdate() {
    if (this.sucursalForm.invalid) return;
    const formValue = this.sucursalForm.value;
    const idEmpresaNum = Number(formValue.idEmpresa);

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioModificacion = usuarioLocal.id || ''; // Esto jala el idUsuario

    const sucursal: Sucursal = {
      ...this.sucursalForm.value,
      //Valores por default
      idEmpresa: idEmpresaNum,
      fechaModificacion: new Date(),
      usuarioModificacion: usuarioModificacion,
    };

    if (!sucursal.idSucursal) {
      alert('No se puede actualizar una sucursal sin ID');
      return;
    }
    this.sucursalService.updateSucursal(sucursal).subscribe({
      next: () => {
        alert('Sucursal actualizada correctamente.');
        this.ngOnInit(); // recargar la lista
        this.onReset();
      },
      error: () => {
        this.error = 'Error al actualizar sucursal';
      },
    });
  }
}
