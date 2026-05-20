import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gradovi } from './gradovi';

describe('Gradovi', () => {
  let component: Gradovi;
  let fixture: ComponentFixture<Gradovi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gradovi],
    }).compileComponents();

    fixture = TestBed.createComponent(Gradovi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
