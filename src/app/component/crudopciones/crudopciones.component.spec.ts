import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudopcionesComponent } from './crudopciones.component';

describe('CrudopcionesComponent', () => {
  let component: CrudopcionesComponent;
  let fixture: ComponentFixture<CrudopcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudopcionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudopcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
