import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMovimientoCxcComponent } from './tipo-movimiento-cxc.component';

describe('TipoMovimientoCxcComponent', () => {
  let component: TipoMovimientoCxcComponent;
  let fixture: ComponentFixture<TipoMovimientoCxcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoMovimientoCxcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoMovimientoCxcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
