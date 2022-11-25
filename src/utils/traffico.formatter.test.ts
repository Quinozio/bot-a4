import { I18n } from "@edjopato/telegraf-i18n";
import { EventType, IEvent, IEventDetail } from "../interfaces/events.models";
import { formatEvent, getInfoCaselli } from "./traffico.formatter";
import * as path from "path";

test("should retrieve caselli information", () => {
  const tests = [
    {
      iniz: 228.7,
      fin: 244.4,
      expected: {
        casIniziale: "Brescia Est",
        casFinale: "Desenzano",
      },
    },
    {
      iniz: 251.5,
      fin: 244.3,
      expected: {
        casIniziale: "Sirmione",
        casFinale: "Desenzano",
      },
    },
    // {
    //   iniz: 280.7,
    //   fin: 290.0,
    //   expected: {
    //     casIniziale: "Verona Est",
    //     casFinale: "Verona Sud",
    //   },
    // },
  ];

  tests.forEach((test) => {
    const { casIniziale, casFinale } = getInfoCaselli(test.iniz, test.fin);
    expect(casIniziale).toBe(test.expected.casIniziale);
    expect(casFinale).toBe(test.expected.casFinale);
  });
});
test("test chiusura", () => {
  //   const mock: Partial<IEvent> = {
  //     TIPO: EventType.INCIDENTE,
  //     DATAORA: new Date().toString(),
  //     INIZIO: new Date().toString(),
  //     FINE: new Date().toString(),
  //     DATA_ORA_CHIUSURA: new Date().toString(),
  //     DATA_ORA_APERTURA: new Date().toString(),
  //     CAUSALE: "CAUSALE TEST",
  //     DETTAGLIO: {
  //       SOTTOTIPO: "MOBILE",
  //       CONSEGUENZE_TRAFFICO: "TRAFFICO",
  //     } as any,
  //   };
  const date = new Date().toString();
  const mock: Partial<IEvent> = {
    INIZIO: date,
    ID_SITUAZIONE: 2220299,
    DATAORA: date,
    // DATA_ORA_CHIUSURA: date,
    DATA_ORA_APERTURA: date,
    // KM_INIZ: 263.9,
    // KM_FIN: 300.1,
    DIR: "MILAN",
    COORD_CERTE: true,
    PROGRESSIVO: 5357402,
    TIPO: EventType.INCIDENTE,
    ID: 2220299,
    CAUSA: "incidente",
    CAUSALE: "incidente",
    DETTAGLIO: {
      EMERGENZA: false,
      INIZIO: date,
      CORSIA3: true,
      CORSIA1: false,
      CORSIA2: false,
      SOTTOTIPO: "FISSO",
      DESCRIZIONE: "flesso",
      CONSEGUENZE_TRAFFICO: "Coda",
    } as Partial<IEventDetail> as any,
    DESCRIZIONE_GEO: "AUTOSTRADA A4 MILANO VENEZIA",
    DESCRIZIONE:
      "AUTOSTRADA A4 MILANO VENEZIA<br>DIREZIONE: MILANO<br>CANTIERE FISSO flesso<br>DAL KM: 266.1<br>AL KM: 263.9<br>DA: 2022-03-18 20:40:00",
    CODICE_GEO: "A4AAA",
  };

  const i18n = new I18n({
    defaultLanguage: "it",
    directory: path.resolve("src/i18n"),
    useSession: true,
    sessionName: "session",
  });
  const context = i18n.createContext("it", i18n.repository.it);
  console.log(formatEvent({ i18n: context } as any, mock as any));
});
