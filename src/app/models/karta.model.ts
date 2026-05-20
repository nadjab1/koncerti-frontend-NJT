import { Koncert } from './koncert.model';

export interface Karta {
  id?: number;
  red: number;
  sediste: number;
  cena: number;
  status: 'DOSTUPNA' | 'REZERVISANA' | 'PRODATA' | 'STORNIRANA';
  datumProdaje?: string;
  imeKupca?: string;
  emailKupca?: string;
  koncert: Koncert;
}