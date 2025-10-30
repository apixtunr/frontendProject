import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudroleComponent } from './crudrole.component';

describe('CrudroleComponent', () => {
  let component: CrudroleComponent;
  let fixture: ComponentFixture<CrudroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudroleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
