import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zanrovi } from './zanrovi';

describe('Zanrovi', () => {
  let component: Zanrovi;
  let fixture: ComponentFixture<Zanrovi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zanrovi],
    }).compileComponents();

    fixture = TestBed.createComponent(Zanrovi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
