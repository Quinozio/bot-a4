import { CurrentCtx } from "../interfaces/context.models";
import { EventType, IEvent } from "../interfaces/events.models";
import { getDate, getTime } from "./date.utils";
import { CASELLI_KM, CODICI_GEO_ESCLUSI } from "./geografia.utils";
import { capitalizeWords } from "./string.utils";

export const eventiEmoticon = {
  [EventType.METEO]: "🚗",
  [EventType.TRAFFICO]: "🚗",
  [EventType.INCIDENTE]: "🚗",
  [EventType.CHIUSURA]: "🚧",
  [EventType.CANTIERE]: "🚧",
};
export const formatEvents = (ctx: CurrentCtx, events: IEvent[]) => {
  return events
    .filter((event) => !CODICI_GEO_ESCLUSI.includes(event.CODICE_GEO))
    .map((event) => formatEvent(ctx, event));
};
export const formatEvent = (ctx: CurrentCtx, event: IEvent) => {
  const {
    TIPO,
    KM_INIZ,
    KM_FIN,
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

  const numberFormatter = new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  }); 

  const kmIniziale = numberFormatter.format(KM_INIZ).replace(",", "+");
  const kmFinale = numberFormatter.format(KM_FIN).replace(",", "+");
  const km = hasInfoKm ? `km ${kmIniziale} - ${kmFinale}\n` : "";

  let direction = hasInfoKm ? `${ctx.i18n.t("traffico.direzione")}` : "";
  if (direction) {
    direction =
      TIPO === EventType.METEO
        ? `${direction} ${ctx.i18n.t("traffico.entrambeDirezioni")}`
        : `${direction} ${DIR === "MILAN" ? "Milano" : "Venezia"}`;
    direction += `\n`;
  }

  let description = "";

  const geo = hasInfoKm
    ? getInfoGeo(ctx, KM_INIZ, KM_FIN)
    : `${ctx.i18n.t("traffico.a")} ${DESCRIZIONE_GEO}`;

  switch (TIPO) {
    case EventType.METEO: {
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${ctx.i18n.t("traffico.siSegnala")} ${
        DETTAGLIO.SOTTOTIPO
      } ${geo}`;
      description = ora + dettaglio;
      break;
    }
    case EventType.TRAFFICO: {
      const causa = CAUSA ? `${ctx.i18n.t("traffico.causa")} ${CAUSA}` : "";
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${DETTAGLIO.SOTTOTIPO} ${geo} ${causa} `;
      description = ora + dettaglio;
      break;
    }
    case EventType.CHIUSURA: {
      const dalle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        DATA_ORA_CHIUSURA
      )} ${ctx.i18n.t("traffico.del")} ${getDate(DATA_ORA_CHIUSURA)} `;
      const alle = `${ctx.i18n.t("traffico.alle")} ${getTime(
        DATA_ORA_APERTURA
      )} ${ctx.i18n.t("traffico.del")} ${getDate(DATA_ORA_APERTURA)} `;

      const causa = CAUSALE ? `${ctx.i18n.t("traffico.causa")} ${CAUSALE}` : "";
      const dettaglio = `${ctx.i18n.t("traffico.chiusura")} ${geo} ${causa}`;
      description = dalle + alle + dettaglio;
      break;
    }
    case EventType.CANTIERE: {
      const dalle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        INIZIO
      )} ${ctx.i18n.t("traffico.del")} ${getDate(INIZIO)} `;
      const alle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        FINE
      )} ${ctx.i18n.t("traffico.del")} ${getDate(FINE)} `;
      const dettaglio = `${ctx.i18n.t("traffico.segnalaCantiere")}${
        DETTAGLIO.SOTTOTIPO === "MOBILE" ? ctx.i18n.t("traffico.mobile") : ""
      } ${geo}`;
      description = dalle + (FINE ? alle : "") + dettaglio;
      break;
    }
    case EventType.INCIDENTE: {
      const ora = `${ctx.i18n.t("traffico.ora")} ${getTime(DATAORA)} - `;
      const dettaglio = `${DETTAGLIO.CONSEGUENZE_TRAFFICO} ${geo} ${ctx.i18n.t(
        "traffico.causaIncidente"
      )}`;
      description = ora + dettaglio;
      break;
    }
    default:
      break;
  }

  // const description = event.DESCRIZIONE.replaceAll("<br>", "\n");
  return `${heading}\n\n${km}${direction}${description}`;
};

export const getInfoCaselli = (KM_INIZ: number, KM_FIN: number) => {
  let casIniziale = "";
  let casFinale = "";

  let kmIniziale = parseInt("" + KM_INIZ);
  let kmFinale = parseInt("" + KM_FIN);
  let isOpposite = false;
  if (KM_INIZ > KM_FIN) {
    isOpposite = true;
    kmIniziale = kmFinale;
    kmFinale = parseInt("" + KM_INIZ);
  }

  CASELLI_KM.forEach((km, index) => {
    if (index > 0) {
      const kmIdPrecedente = Object.keys(CASELLI_KM[index - 1])[0];
      const kmPrecedente = parseInt(kmIdPrecedente);
      const kmId = Object.keys(km)[0];
      const kmAttuale = parseInt(kmId);

      if (
        kmIniziale >= kmPrecedente &&
        kmIniziale <= kmAttuale &&
        (isOpposite ? true : !casIniziale)
      ) {
        console.log(kmIniziale, kmPrecedente, kmAttuale);
        casIniziale = isOpposite
          ? CASELLI_KM[index - 1][kmIdPrecedente]
          : km[kmId];
      }
      if (
        kmFinale >= kmPrecedente &&
        kmFinale <= kmAttuale &&
        (isOpposite ? true : !casFinale)
      ) {
        casFinale = isOpposite
          ? CASELLI_KM[index - 1][kmIdPrecedente]
          : km[kmId];
      }
    }
  });
  const casInizialeCopy = casIniziale;
  const casFinaleCopy = casFinale;
  casIniziale = isOpposite ? casFinaleCopy : casInizialeCopy;
  casFinale = isOpposite ? casInizialeCopy : casFinaleCopy;
  return {
    casIniziale: capitalizeWords(casIniziale),
    casFinale: capitalizeWords(casFinale),
  };
};
const getInfoGeo = (ctx: CurrentCtx, KM_INIZ: number, KM_FIN: number) => {
  const { casIniziale, casFinale } = getInfoCaselli(KM_INIZ, KM_FIN);
  if (casFinale && casIniziale !== casFinale) {
    return `${ctx.i18n.t("traffico.tra")} ${capitalizeWords(
      casIniziale
    )} ${ctx.i18n.t("traffico.e")} ${capitalizeWords(casFinale)}`;
  }
  return `${ctx.i18n.t("traffico.a")} ${capitalizeWords(casIniziale)}`;
};
