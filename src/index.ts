import dotenv from "dotenv";
import * as path from "path";
import { Telegraf, Composer, Scenes } from "telegraf";
import { I18n } from "@edjopato/telegraf-i18n";
import { GenericMenu } from "@quino/telegraf-menu";
import LocalSession from "telegraf-session-local";

import { commands, MenuAction } from "./interfaces/commands.models";
import { CurrentCtx } from "./interfaces/context.models";
import { initStartMenu } from "./menu/start.menu";
import { initSession } from "./middlewares/init-session";
import { initWebcamMenu } from "./menu/webcam.menu";
import { initChangeLanguageMenu } from "./menu/change-language.menu";
import { initSettingsMenu } from "./menu/settings.menu";
import { initServicesMenu } from "./menu/services.menu";
import { initServiceDetailMenu } from "./menu/service-detail.menu";
import { initTrafficoDirectionMenu } from "./menu/traffico-direction.menu";
import { adminScene } from "./scenes/admin.scenes";
const fs = require("fs");

dotenv.config();

const bot = new Telegraf<CurrentCtx>(process.env.BOT_TOKEN ?? "");
const dbPath = process.env.DB_FOLDER + "local.db.json";

if (!fs.existsSync(dbPath)) {
  fs.appendFile(dbPath, "", (err: string) => {
    if (err) throw err;
    console.log("Saved!");
  });
}

const session = new LocalSession({
  database: process.env.DB_FOLDER + "local.db.json",
});
const i18n = new I18n({
  defaultLanguage: "it",
  directory: path.resolve(__dirname, "i18n"),
  useSession: true,
  sessionName: "session",
});

bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(initSession);
const stage = new Scenes.Stage<Scenes.SceneContext>([adminScene as any], {
  ttl: 10,
});
bot.use(stage.middleware() as any);

bot.use(GenericMenu.middleware());

bot.telegram.setMyCommands(commands);

bot.command(MenuAction.START, initStartMenu as any);
bot.command(MenuAction.MENU, initStartMenu as any);
bot.command(MenuAction.SETTINGS, initSettingsMenu as any);
bot.action(
  new RegExp(MenuAction.START),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initStartMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.MENU),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initStartMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.WEBCAM),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initWebcamMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.SERVICES),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initServicesMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.SERVICE_DETAIL),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initServiceDetailMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.INFO_TRAFFICO),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initTrafficoDirectionMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.CHANGE_LANGUAGE),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initChangeLanguageMenu as any
  )
);

const adminIds = [452970611];
bot.command(
  "admin",
  Composer.acl(adminIds, (ctx) => ctx.scene.enter("adminScene"))
);
if (process.env.NODE_ENV === "production") {
  const port = process.env.PORT ? +process.env.PORT : 3000;
  const domain = "https://bewildered-worm-zipper.cyclic.app/";
  bot
    .launch({
      webhook: {
        domain,
        port,
      },
    })
    .then(() => console.log("Webhook bot listening on port", port));
} else {
  bot.launch();
}

console.log("Bot is running!");

process.on("unhandledRejection", (err) => {
  console.log("Caught exception: " + err);
});
process.on("uncaughtException", (err) => {
  console.log("Caught exception: " + err);
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
