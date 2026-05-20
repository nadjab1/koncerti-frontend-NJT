import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lokacije } from './lokacije';

describe('Lokacije', () => {
  let component: Lokacije;
  let fixture: ComponentFixture<Lokacije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lokacije],
    }).compileComponents();

    fixture = TestBed.createComponent(Lokacije);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
