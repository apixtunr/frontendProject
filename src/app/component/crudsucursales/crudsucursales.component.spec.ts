import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudsucursalComponent } from './crudsucursales.component';

describe('CrudsucursalComponent', () => {
  let component: CrudsucursalComponent;
  let fixture: ComponentFixture<CrudsucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudsucursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudsucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
