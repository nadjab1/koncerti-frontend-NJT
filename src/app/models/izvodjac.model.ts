import { Zanr } from "./zanr.model";

export interface Izvodjac {
  id?: number;
  kontaktEmail: string;
  tip: 'MUZICAR' | 'BEND';
  ime?: string;
  prezime?: string;
  pol?: string;
  naziv?: string;
  brojClanova?: number;
  zanrovi?: Zanr[];
}