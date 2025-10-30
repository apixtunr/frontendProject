import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudstatuscuentaComponent } from './crudstatuscuenta.component';

describe('CrudstatuscuentaComponent', () => {
  let component: CrudstatuscuentaComponent;
  let fixture: ComponentFixture<CrudstatuscuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudstatuscuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudstatuscuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
