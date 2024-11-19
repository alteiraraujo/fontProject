import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacaFormComponent } from './raca-form.component';

describe('RacaFormComponent', () => {
  let component: RacaFormComponent;
  let fixture: ComponentFixture<RacaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
