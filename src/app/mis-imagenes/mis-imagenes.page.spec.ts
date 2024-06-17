import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisImagenesPage } from './mis-imagenes.page';

describe('MisImagenesPage', () => {
  let component: MisImagenesPage;
  let fixture: ComponentFixture<MisImagenesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisImagenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
