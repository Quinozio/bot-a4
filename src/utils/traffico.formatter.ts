import { CurrentCtx } from "../interfaces/context.models";
import { EventType, IEvent } from "../interfaces/events.models";
import { getDate, getTime } from "./date.utils";
import { CASELLI_KM, CODICI_GEO_ESCLUSI } from "./geografia.utils";
import { capitalizeWords } from "./string.utils";

export const eventiEmoticon = {
  [EventType.METEO]: "🚗",
  [EventType.TRAFFICO]: "🚗",
  [EventType.INCIDENTE]: "🚗",
  [EventType.MESSAGGIO_PMV]: "🚧",
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
    ? getInfoGeo(ctx, KM_INIZ, KM_FIN, DIR)
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
    case EventType.MESSAGGIO_PMV: {
      const dalle = `${ctx.i18n.t("traffico.dalle")} ${getTime(
        INIZIO
      )} ${ctx.i18n.t("traffico.del")} ${getDate(INIZIO)} `;
      const alle = `${ctx.i18n.t("traffico.alle")} ${getTime(
        FINE
      )} ${ctx.i18n.t("traffico.del")} ${getDate(FINE)} `;

      const causa = CAUSALE ? `${ctx.i18n.t("traffico.causa")} ${CAUSALE}` : "";
      const dettaglio = `${ctx.i18n.t("traffico.chiusura")} ${geo} ${causa}`;
      description = dalle + (FINE ? alle : "") + dettaglio;
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

export const getInfoCaselli = (
  KM_INIZ: number,
  KM_FIN: number,
  direzione: string
) => {
  let casIniziale = "";
  let casFinale = "";

  CASELLI_KM.forEach((caselloInfo) => {
    if (
      KM_INIZ >= caselloInfo.inizio &&
      KM_INIZ <= caselloInfo.fine &&
      !casIniziale
    ) {
      casIniziale = caselloInfo.casello;
    }
    if (
      KM_FIN >= caselloInfo.inizio &&
      KM_FIN <= caselloInfo.fine &&
      !casFinale
    ) {
      casFinale = caselloInfo.casello;
    }
  });
  if (casIniziale === casFinale) {
    const caselloIndex = CASELLI_KM.findIndex(
      (cas) => cas.casello === casIniziale
    );
    const newCasello = CASELLI_KM[caselloIndex - 1].casello;
    if (direzione === "VENEZ") {
      casIniziale = newCasello;
    } else {
      casFinale = newCasello;
    }
  }
  return {
    casIniziale,
    casFinale,
  };
};
const getInfoGeo = (
  ctx: CurrentCtx,
  KM_INIZ: number,
  KM_FIN: number,
  direzione: string
) => {
  const { casIniziale, casFinale } = getInfoCaselli(KM_INIZ, KM_FIN, direzione);
  if (casFinale && casIniziale !== casFinale) {
    return `${ctx.i18n.t("traffico.tra")} ${casIniziale} ${ctx.i18n.t(
      "traffico.e"
    )} ${casFinale}`;
  }
  return `${ctx.i18n.t("traffico.a")} ${casIniziale}`;
};
