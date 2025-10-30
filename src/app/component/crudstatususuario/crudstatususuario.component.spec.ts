import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CrudstatususuarioComponent } from './crudstatususuario.component';
import { StatusUsuarioService } from '../../service/statusUsuario.service';
import { StatusUsuario } from '../../entity/statusUsuario';

describe('CrudstatususuarioComponent', () => {
  let component: CrudstatususuarioComponent;
  let fixture: ComponentFixture<CrudstatususuarioComponent>;
  let statusUsuarioService: jasmine.SpyObj<StatusUsuarioService>;
  let httpMock: HttpTestingController;

  // Datos de prueba
  const mockStatusUsuarios: StatusUsuario[] = [
    {
      idstatususuario: 1,
      nombre: 'Activo',
      fechaCreacion: new Date('2024-01-15'),
      usuarioCreacion: 'test@example.com'
    },
    {
      idstatususuario: 2,
      nombre: 'Inactivo',
      fechaCreacion: new Date('2024-01-16'),
      usuarioCreacion: 'admin@example.com',
      fechaModificacion: new Date('2024-01-20')
    }
  ];

  const mockNewStatusUsuario: StatusUsuario = {
    idstatususuario: 0,
    nombre: 'Suspendido',
    fechaCreacion: new Date(),
    usuarioCreacion: 'test@example.com'
  };

  beforeEach(async () => {
    const statusUsuarioServiceSpy = jasmine.createSpyObj('StatusUsuarioService', [
      'getStatusUsuarios',
      'createStatusUsuario',
      'updateStatusUsuario',
      'deleteStatusUsuario'
    ]);

    await TestBed.configureTestingModule({
      declarations: [CrudstatususuarioComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StatusUsuarioService, useValue: statusUsuarioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudstatususuarioComponent);
    component = fixture.componentInstance;
    statusUsuarioService = TestBed.inject(StatusUsuarioService) as jasmine.SpyObj<StatusUsuarioService>;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({
      email: 'test@example.com',
      nombre: 'Test User'
    }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component correctly', () => {
    statusUsuarioService.getStatusUsuarios.and.returnValue(of(mockStatusUsuarios));
    
    component.ngOnInit();
    
    expect(component.currentUser).toBe('test@example.com');
    expect(component.statusUsuario.idstatususuario).toBe(0);
    expect(component.statusUsuario.usuarioCreacion).toBe('test@example.com');
    expect(statusUsuarioService.getStatusUsuarios).toHaveBeenCalled();
  });

  it('should load status usuarios successfully', () => {
    statusUsuarioService.getStatusUsuarios.and.returnValue(of(mockStatusUsuarios));
    
    component.loadStatusUsuarios();
    
    expect(component.statusUsuarios).toEqual(mockStatusUsuarios);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should handle error when loading status usuarios', () => {
    const errorMessage = 'Network error';
    statusUsuarioService.getStatusUsuarios.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    
    component.loadStatusUsuarios();
    
    expect(component.loading).toBeFalse();
    expect(component.error).toContain('Error al cargar status de usuarios');
  });

  it('should create new status usuario successfully', () => {
    statusUsuarioService.createStatusUsuario.and.returnValue(of(mockNewStatusUsuario));
    statusUsuarioService.getStatusUsuarios.and.returnValue(of([...mockStatusUsuarios, mockNewStatusUsuario]));
    
    component.statusUsuario = {
      idstatususuario: 0,
      nombre: 'Suspendido',
      fechaCreacion: component.getCurrentDateForInput(),
      usuarioCreacion: 'test@example.com',
      fechaModificacion: ''
    };

    spyOn(window, 'alert');
    component.onSubmit();
    
    expect(statusUsuarioService.createStatusUsuario).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Status de usuario creado exitosamente.');
  });

  it('should update existing status usuario successfully', () => {
    const updatedStatusUsuario = { ...mockStatusUsuarios[0], nombre: 'Activo Modificado' };
    statusUsuarioService.updateStatusUsuario.and.returnValue(of(updatedStatusUsuario));
    statusUsuarioService.getStatusUsuarios.and.returnValue(of(mockStatusUsuarios));
    
    component.statusUsuario = {
      idstatususuario: 1,
      nombre: 'Activo Modificado',
      fechaCreacion: component.formatDateForInput(mockStatusUsuarios[0].fechaCreacion),
      usuarioCreacion: 'test@example.com',
      fechaModificacion: ''
    };

    spyOn(window, 'alert');
    component.onSubmit();
    
    expect(statusUsuarioService.updateStatusUsuario).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(window.alert).toHaveBeenCalledWith('Status de usuario actualizado exitosamente.');
  });

  it('should not submit with empty name', () => {
    component.statusUsuario.nombre = '';
    
    component.onSubmit();
    
    expect(component.error).toBe('El nombre del status de usuario es requerido.');
    expect(statusUsuarioService.createStatusUsuario).not.toHaveBeenCalled();
  });

  it('should delete status usuario successfully', () => {
    statusUsuarioService.deleteStatusUsuario.and.returnValue(of(void 0));
    statusUsuarioService.getStatusUsuarios.and.returnValue(of(mockStatusUsuarios.slice(1)));
    
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    
    component.onDelete(1);
    
    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este status de usuario?');
    expect(statusUsuarioService.deleteStatusUsuario).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Status de usuario eliminado exitosamente.');
  });

  it('should not delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.onDelete(1);
    
    expect(statusUsuarioService.deleteStatusUsuario).not.toHaveBeenCalled();
  });

  it('should populate form when editing status usuario', () => {
    const statusToEdit = mockStatusUsuarios[0];
    
    component.onEdit(statusToEdit);
    
    expect(component.statusUsuario.idstatususuario).toBe(statusToEdit.idstatususuario);
    expect(component.statusUsuario.nombre).toBe(statusToEdit.nombre);
    expect(component.statusUsuario.usuarioCreacion).toBe(statusToEdit.usuarioCreacion);
  });

  it('should reset form correctly', () => {
    component.statusUsuario.nombre = 'Test Status';
    component.error = 'Some error';
    
    component.onReset();
    
    expect(component.statusUsuario.idstatususuario).toBe(0);
    expect(component.statusUsuario.nombre).toBe('');
    expect(component.error).toBe('');
  });

  it('should format date for input correctly', () => {
    const testDate = new Date('2024-01-15');
    
    const formattedDate = component.formatDateForInput(testDate);
    
    expect(formattedDate).toBe('2024-01-15');
  });

  it('should format string date for input correctly', () => {
    const testDateString = '2024-01-15T10:30:00.000Z';
    
    const formattedDate = component.formatDateForInput(testDateString);
    
    expect(formattedDate).toBe('2024-01-15');
  });

  it('should handle invalid date in formatDateForInput', () => {
    const formattedDate = component.formatDateForInput('invalid-date');
    
    expect(formattedDate).toBe('');
  });

  it('should get current user from localStorage correctly', () => {
    component.getCurrentUser();
    
    expect(component.currentUser).toBe('test@example.com');
  });

  it('should handle localStorage parsing error', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-json');
    spyOn(console, 'error');
    
    component.getCurrentUser();
    
    expect(component.currentUser).toBe('Usuario Anónimo');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle empty localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    
    component.getCurrentUser();
    
    expect(component.currentUser).toBe('Usuario Anónimo');
  });
});