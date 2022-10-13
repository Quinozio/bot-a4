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
  INFO_TRAFFICO = "infoTraffico",
  INFO_TRAFFICO_OVEST = "infoTrafficoOvest",
  INFO_TRAFFICO_EST = "infoTrafficoEst",
  WEBCAM = "webcam",
  WEBCAM_DETAIL = "webcamDetail",
  SOS = "sos",
  CANTIERI_ALTA_VELOCITA = "cantieriAltaVelocita",
  MANCATI_PAGAMENTI = "mancatiPagamenti",
  SERVICES = "services",
  SERVICE_DETAIL = "serviceDetail",
  SETTINGS = "settings",
  BACK = "back",
  CHANGE_LANGUAGE = "changeLanguage",
  SET_LANG_IT = "setLangIt",
  SET_LANG_EN = "setLangEn",
}
