import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import fetch from "node-fetch";
import { MenuAction } from "../interfaces/commands.models";
import { IWebcam } from "../interfaces/webcam.models";

export const WEBCAM_MENU_FILTERS: () => Promise<
  MenuFilters<MenuAction>[]
> = async () => {
  const res = await fetch(`${process.env.API_URL}/o/map-rest/webcam/A4AAA`);
  const json: IWebcam[] = await res.json();
  console.log(json);

  const listWebcamAttive = [
    "TVCIO228-Ovest",
    "TVCIO244-Ovest",
    "TVCIE251-Est",
    "TVCIO259-Ovest",
    "TVCIO270-Ovest",
    "TVCIE291-Est",
    "TVCIE303-Est",
    "TVCIO316-Ovest",
    "TVCIE328-Est",
    "TVCIE336-Est",
    "TVCIE336-Est",
  ];
  const webcams = json.filter((item) => listWebcamAttive.includes(item.id));
  const buttons = webcams.map(
    (item) => new KeyboardButton(item.id, item.url) as any
  );
  const rowSize = 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  return rows;
};
