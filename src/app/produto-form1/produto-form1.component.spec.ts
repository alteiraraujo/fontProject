import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoForm1Component } from './produto-form1.component';

describe('ProdutoForm1Component', () => {
  let component: ProdutoForm1Component;
  let fixture: ComponentFixture<ProdutoForm1Component>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutoForm1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
