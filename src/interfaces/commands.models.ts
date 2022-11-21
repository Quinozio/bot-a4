import { BotCommand } from "telegraf/typings/core/types/typegram";

export enum CommandsEnum {
  MENU = "menu",
  SETTINGS = "settings",
  SILENZIA_NOTIFICHE = "silenzia_notifiche",
  ATTIVA_NOTIFICHE = "attiva_notifiche",
}
export const commands: BotCommand[] = [
  {
    command: CommandsEnum.MENU,
    description: "Menu",
  },
  {
    command: CommandsEnum.SILENZIA_NOTIFICHE,
    description: "Silenzia notifiche",
  },
  {
    command: CommandsEnum.ATTIVA_NOTIFICHE,
    description: "Attiva notifiche",
  },
  {
    command: CommandsEnum.SETTINGS,
    description: "Impostazioni",
  },
];

export enum MenuAction {
  START = "start",
  MENU = "menu",
  PROFILAZIONE_LEGGERO = "profilazioneLeggero",
  PROFILAZIONE_PESANTE = "profilazionePesante",
  INFO_TRAFFICO = "infoTraffico",
  INFO_TRAFFICO_OVEST = "infoTrafficoOvest",
  INFO_TRAFFICO_EST = "infoTrafficoEst",
  WEBCAM = "webcam",
  WEBCAM_DETAIL = "webcamDetail",
  SOS = "sos",
  INFO_CANTIERI_ALTA_VELOCITA = "cantieriAltaVelocita",
  CANTIERI_ALTA_VELOCITA = "cantieriAltaVelocita",
  MANCATI_PAGAMENTI = "mancatiPagamenti",
  SERVICES = "services",
  SERVICES_AREE = "services_aree",
  SERVICES_RICARICA = "services_ricarica",
  SERVICES_METANO = "services_metano",
  SERVICES_CAMPER = "services_camper",
  SERVICE_DETAIL = "serviceDetail",
  SETTINGS = "settings",
  BACK = "back",
  CHANGE_LANGUAGE = "changeLanguage",
  SET_LANG_IT = "setLangIt",
  SET_LANG_EN = "setLangEn",
}
