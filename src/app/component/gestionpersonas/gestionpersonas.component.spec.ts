import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionpersonasComponent } from './gestionpersonas.component';

describe('GestionpersonasComponent', () => {
  let component: GestionpersonasComponent;
  let fixture: ComponentFixture<GestionpersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionpersonasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionpersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
