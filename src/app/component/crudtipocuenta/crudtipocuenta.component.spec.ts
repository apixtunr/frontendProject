import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudTipoCuentaComponent } from './crudtipocuenta.component';

describe('CrudtipocuentaComponent', () => {
  let component: CrudTipoCuentaComponent;
  let fixture: ComponentFixture<CrudTipoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudTipoCuentaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudTipoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
