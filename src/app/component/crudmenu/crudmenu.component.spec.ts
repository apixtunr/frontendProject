import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudmenuComponent } from './crudmenu.component';

describe('CrudmenuComponent', () => {
  let component: CrudmenuComponent;
  let fixture: ComponentFixture<CrudmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
