import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudusuariosComponent } from './crudusuarios.component';

describe('CrudusuariosComponent', () => {
  let component: CrudusuariosComponent;
  let fixture: ComponentFixture<CrudusuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudusuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
