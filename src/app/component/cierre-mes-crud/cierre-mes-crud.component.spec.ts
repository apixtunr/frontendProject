import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreMesCRUDComponent } from './cierre-mes-crud.component';

describe('CierreMesCRUDComponent', () => {
  let component: CierreMesCRUDComponent;
  let fixture: ComponentFixture<CierreMesCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CierreMesCRUDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CierreMesCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
