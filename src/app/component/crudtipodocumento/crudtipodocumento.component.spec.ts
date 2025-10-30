import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudtipodocumentoComponent } from './crudtipodocumento.component';

describe('CrudtipodocumentoComponent', () => {
  let component: CrudtipodocumentoComponent;
  let fixture: ComponentFixture<CrudtipodocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudtipodocumentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudtipodocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
