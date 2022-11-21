import { EventType, IEvent } from "../interfaces/events.models";
import { formatEvent } from "./traffico.formatter";

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
  const mock = {
    INIZIO: "2022-03-18 20:40:26",
    ID_SITUAZIONE: 2220299,
    DATAORA: "2022-11-14 06:53:35",
    KM_INIZ: 263.9,
    KM_FIN: 266.1,
    DIR: "MILAN",
    COORD_CERTE: true,
    PROGRESSIVO: 5357402,
    TIPO: "CANTIERE",
    ID: 2220299,
    DETTAGLIO: {
      EMERGENZA: false,
      INIZIO: "2022-03-18 20:40:00",
      CORSIA3: true,
      CORSIA1: false,
      CORSIA2: false,
      SOTTOTIPO: "FISSO",
      DESCRIZIONE: "flesso",
    },
    DESCRIZIONE_GEO: "AUTOSTRADA A4 MILANO VENEZIA",
    DESCRIZIONE:
      "AUTOSTRADA A4 MILANO VENEZIA<br>DIREZIONE: MILANO<br>CANTIERE FISSO flesso<br>DAL KM: 266.1<br>AL KM: 263.9<br>DA: 2022-03-18 20:40:00",
    CODICE_GEO: "A4AAA",
  };
  console.log(
    formatEvent(
      { i18n: { t: () => "label" as any } as any } as any,
      mock as any
    )
  );
});
