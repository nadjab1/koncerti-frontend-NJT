import { Lokacija } from './lokacija.model';

export interface Koncert {
  id?: number;
  naziv: string;
  datum: string;
  vremePocetka: string;
  vremeTrajanja?: number;
  status: 'PLANIRAN' | 'AKTIVAN' | 'OTKAZAN' | 'ZAVRSEN';
  lokacija: Lokacija;
  izvodjaci?: any[];
}