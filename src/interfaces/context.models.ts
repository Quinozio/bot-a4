import { DefaultCtx, GenericMenu } from "@quino/telegraf-menu";
import { Scenes } from "telegraf";
import { I18nContext } from "@edjopato/telegraf-i18n";

import { IServiceItem, ServiceSectionEnum } from "./service.models";

export interface IPosition {
  lat: string;
  long: string;
  description: string;
}

export enum Language {
  IT = "it",
  EN = "en",
}
export interface ILocalDbSession {
  id: string;
  data: ISession;
}
export interface ILocalDb {
  sessions: ILocalDbSession[];
}
export interface ISession {
  language: string;
  userId: string;
  keyboardMenu: GenericMenu;
  services?: IServiceItem[];
  serviceSectionSelected?: ServiceSectionEnum;
  serviceSelected: IServiceItem;
}
export type CurrentCtx = DefaultCtx & {
  i18n: I18nContext;
  session: ISession;
  scene: Scenes.SceneContextScene<any, CurrentCtx>;
};
