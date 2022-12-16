export interface IEventsOnStreet {
  street: IStreet;
  events: IEvent[];
}
export interface IEventDetail {
  EMERGENZA: boolean;
  INIZIO: string;
  CORSIA3: boolean;
  CORSIA1: boolean;
  CORSIA2: boolean;
  CODICE_LOCAZIONE: number;
  SOTTOTIPO: string;
  CONSEGUENZE_TRAFFICO: string;
  DESCRIZIONE: string;
  TIPOLOGIA: string;
  VIA_RIFERIMENTO: string;
}
export enum EventType {
  "METEO" = "METEO",
  "TRAFFICO" = "TRAFFICO",
  "CHIUSURA" = "CHIUSURA",
  "CANTIERE" = "CANTIERE",
  "MESSAGGIO_PMV" = "MESSAGGIO_PMV",
  "INCIDENTE" = "INCIDENTE",
}
export interface IEvent {
  INIZIO: string;
  FINE: string;
  CAUSALE: string;
  ID_SITUAZIONE: number;
  DATAORA: string;
  KM_INIZ: number;
  KM_FIN: number;
  DIR: string;
  COORD_CERTE: boolean;
  PROGRESSIVO: number;
  TIPO: EventType;
  ID: any;
  CAUSA: string;
  DATA_ORA_CHIUSURA: string;
  DATA_ORA_APERTURA: string;
  AFFECTED_PATH_COORDS: ICoord[];
  DETTAGLIO: IEventDetail;
  DESCRIZIONE_GEO: string;
  DESCRIZIONE: string;
  CODICE_GEO: string;
  ID_PADRE: any;
}

export interface Aree {
  eventId: any[];
  name: string;
  id: string;
  coords: ICoord;
}

export interface IStreet {
  kmStart: number;
  directions: Direction[];
  name: string;
  caselli: Caselli[];
  id: string;
  type: string;
  aree: Aree[];
  defaultDir: string;
}

export interface ICoord {
  lng: number;
  offset: number;
  lat: number;
}

export interface Path {
  eventId: string[];
  toCasello: string;
  fromKm: number;
  toKm: number;
  fromCasello: string;
  coords: ICoord[];
}

export enum DirectionTo {
  "MILAN" = "MILAN",
  "VENEZ" = "VENEZ",
}
export interface Direction {
  directionTo: DirectionTo;
  paths: Path[];
}

export interface Direzioni {
  icon: string;
  label: string;
}
export interface Caselli {
  eventId: string[];
  image: string;
  name: string;
  id: string;
  poi: string[];
  direzioni: Direzioni[];
  coords: ICoord;
}
