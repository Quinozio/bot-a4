import { CurrentCtx } from "../interfaces/context.models";
import { EventType, IEvent } from "../interfaces/events.models";
import { getDate, getTime } from "./date.utils";
import { CASELLI_KM } from "./geografia.utils";
import { capitalizeWords } from "./string.utils";

export const eventiEmoticon = {
  [EventType.METEO]: "🚗",
  [EventType.TRAFFICO]: "🚗",
  [EventType.INCIDENTE]: "🚗",
  [EventType.CHIUSURA]: "🚧",
  [EventType.CANTIERE]: "🚧",
};
export const formatEvents = (ctx: CurrentCtx, events: IEvent[]) => {
  return events?.map((event) => formatEvent(ctx, event));
};
export const formatEvent = (ctx: CurrentCtx, event: IEvent) => {
  const {
    TIPO,
    KM_INIZ,
    KM_FIN,
    DESCRIZIONE,
    DIR,
    DATAORA,
    DESCRIZIONE_GEO,
    DATA_ORA_APERTURA,
    DATA_ORA_CHIUSURA,
    INIZIO,
    FINE,
    DETTAGLIO,
    CAUSALE,
    CAUSA,
  } = event;
  const emoticon = eventiEmoticon[TIPO];

  const hasInfoKm = KM_INIZ || KM_FIN;

  const heading = `${emoticon} ${ctx.i18n.t("traffico.infoviabilita")}`;
  const km = hasInfoKm ? `km ${KM_INIZ} - ${KM_FIN}\n` : "";

  let direction = hasInfoKm ? `${ctx.i18n.t("traffico.direzione")}` : "";
  if (direction) {
    direction =
      TIPO === EventType.METEO
        ? `${direction} ${ctx.i18n.t("traffico.entrambeDirezioni")}`
        : `${direction} ${DIR === "MILAN" ? "Milano" : "Venezia"}`;
    direction += `\n`;
  }

  let description = "";
  switch (TIPO) {
    case EventType.METEO: {
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${ctx.i18n.t("traffico.siSegnala")} ${
        DETTAGLIO.SOTTOTIPO
      }`;
      description = ora + dettaglio;
      break;
    }
    case EventType.TRAFFICO: {
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${DETTAGLIO.SOTTOTIPO} ${ctx.i18n.t(
        "traffico.causa"
      )} ${CAUSA} `;
      description = ora + dettaglio;
      break;
    }
    case EventType.CHIUSURA: {
      const dalle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        DATA_ORA_CHIUSURA
      )} ${ctx.i18n.t("traffico.del")} ${getDate(DATA_ORA_CHIUSURA)} `;
      const alle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        DATA_ORA_APERTURA
      )} ${ctx.i18n.t("traffico.del")} ${getDate(DATA_ORA_APERTURA)} `;
      const dettaglio = `${ctx.i18n.t("traffico.chiusuraCausa")} ${CAUSALE}`;
      description = dalle + alle + dettaglio;
      break;
    }
    case EventType.CANTIERE: {
      console.log(INIZIO);
      const dalle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        INIZIO
      )} ${ctx.i18n.t("traffico.del")} ${getDate(INIZIO)} `;
      const alle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        FINE
      )} ${ctx.i18n.t("traffico.del")} ${getDate(FINE)} `;
      const dettaglio = `${ctx.i18n.t("traffico.segnalaCantiere")} ${
        DETTAGLIO.SOTTOTIPO === "MOBILE" ? ctx.i18n.t("traffico.mobile") : ""
      }`;
      description = dalle + (FINE ? alle : "") + dettaglio;
      break;
    }
    case EventType.INCIDENTE: {
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${DETTAGLIO.CONSEGUENZE_TRAFFICO} ${ctx.i18n.t(
        "traffico.causaIncidente"
      )}`;
      description = ora + dettaglio;
      break;
    }
    default:
      break;
  }
  console.log(direction);

  const geo = hasInfoKm
    ? getInfoGeo(ctx, KM_INIZ, KM_FIN)
    : `${ctx.i18n.t("traffico.a")} ${DESCRIZIONE_GEO}`;
  // const description = event.DESCRIZIONE.replaceAll("<br>", "\n");
  return `${heading}\n\n${km}${direction}${description}${geo}`;
};

const getInfoGeo = (ctx: CurrentCtx, KM_INIZ: number, KM_FIN: number) => {
  let casIniziale = "";
  let casFinale = "";
  CASELLI_KM.forEach((km, index) => {
    if (index > 0) {
      const kmPrecedente = Object.keys(CASELLI_KM[index - 1])[0];
      const kmAttuale = Object.keys(km)[0];
      if (KM_INIZ > +kmPrecedente && KM_INIZ < +kmAttuale) {
        casIniziale += km[kmAttuale];
      }
      if (KM_FIN > +kmPrecedente && KM_INIZ < +kmAttuale) {
        casFinale += km[kmAttuale];
      }
    }
  });
  console.log(KM_INIZ, KM_FIN);
  console.log(casIniziale, casFinale);
  if (casFinale && casIniziale !== casFinale) {
    return `${ctx.i18n.t("traffico.tra")} ${capitalizeWords(
      casIniziale
    )} ${ctx.i18n.t("traffico.e")} ${capitalizeWords(casFinale)}`;
  }
  return `${ctx.i18n.t("traffico.a")} ${capitalizeWords(casIniziale)}`;
};
