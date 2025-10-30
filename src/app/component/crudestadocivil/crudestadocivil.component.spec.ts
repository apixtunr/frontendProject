import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudestadocivilComponent } from './crudestadocivil.component';

describe('CrudestadocivilComponent', () => {
  let component: CrudestadocivilComponent;
  let fixture: ComponentFixture<CrudestadocivilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudestadocivilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudestadocivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
