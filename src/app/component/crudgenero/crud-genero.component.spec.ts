import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudGeneroComponent } from './crud-genero.component';

describe('CrudGeneroComponent', () => {
  let component: CrudGeneroComponent;
  let fixture: ComponentFixture<CrudGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudGeneroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});