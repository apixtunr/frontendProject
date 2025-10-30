import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudmoduloComponent } from './crudmodulo.component';

describe('CrudmoduloComponent', () => {
  let component: CrudmoduloComponent;
  let fixture: ComponentFixture<CrudmoduloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudmoduloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudmoduloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
