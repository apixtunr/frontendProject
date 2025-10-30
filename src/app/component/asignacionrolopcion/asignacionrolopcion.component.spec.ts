import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionrolopcionComponent } from './asignacionrolopcion.component';

describe('AsignacionrolopcionComponent', () => {
  let component: AsignacionrolopcionComponent;
  let fixture: ComponentFixture<AsignacionrolopcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignacionrolopcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionrolopcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
