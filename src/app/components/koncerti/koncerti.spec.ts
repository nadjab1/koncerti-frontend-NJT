import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Koncerti } from './koncerti';

describe('Koncerti', () => {
  let component: Koncerti;
  let fixture: ComponentFixture<Koncerti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Koncerti],
    }).compileComponents();

    fixture = TestBed.createComponent(Koncerti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
