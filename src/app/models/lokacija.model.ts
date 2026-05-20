import { Grad } from './grad.model';

export interface Lokacija {
  id?: number;
  naziv: string;
  adresa: string;
  kapacitet: number;
  grad: Grad;
}