import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Izvodjaci } from './izvodjaci';

describe('Izvodjaci', () => {
  let component: Izvodjaci;
  let fixture: ComponentFixture<Izvodjaci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Izvodjaci],
    }).compileComponents();

    fixture = TestBed.createComponent(Izvodjaci);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
