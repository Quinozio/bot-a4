import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const START_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    new KeyboardButton(
      "menu.start.button.infoTraffico",
      MenuAction.INFO_TRAFFICO
    ),
    new KeyboardButton("menu.start.button.webcam", MenuAction.WEBCAM),
  ],
  [
    new KeyboardButton(
      "menu.start.button.cantieri",
      MenuAction.CANTIERI_ALTA_VELOCITA
    ),
    new KeyboardButton("menu.start.button.servizi", MenuAction.SERVICES),
    
  ],
  [
    new KeyboardButton("menu.start.button.sos", MenuAction.SOS),
    new KeyboardButton(
      "menu.start.button.mancatiPagamenti",
      MenuAction.MANCATI_PAGAMENTI,
      "https://www.payonline.regione.lombardia.it/payonline/"
    ),
    // new KeyboardButton(
    //   "menu.start.button.infoCantieri",
    //   MenuAction.INFO_CANTIERI_ALTA_VELOCITA,
    //   "https://www.autobspd.it/viabilita/linea-ferroviaria-brescia-est-verona"
    // ),
  ],
  [
    new KeyboardButton("menu.start.button.settings", MenuAction.SETTINGS),
  ],
];
