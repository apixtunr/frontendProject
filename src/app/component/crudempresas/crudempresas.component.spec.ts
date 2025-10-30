import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudempresasComponent } from './crudempresas.component';

describe('CrudempresasComponent', () => {
  let component: CrudempresasComponent;
  let fixture: ComponentFixture<CrudempresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudempresasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudempresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
