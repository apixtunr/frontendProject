import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginusuariosComponent } from './loginusuarios.component';

describe('LoginusuariosComponent', () => {
  let component: LoginusuariosComponent;
  let fixture: ComponentFixture<LoginusuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginusuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
