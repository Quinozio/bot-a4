import dotenv from "dotenv";
import * as path from "path";
import { Telegraf, Composer, Scenes } from "telegraf";
import { I18n } from "@edjopato/telegraf-i18n";
import { GenericMenu } from "@quino/telegraf-menu";
import LocalSession from "telegraf-session-local";
import { telegrafThrottler } from "telegraf-throttler";
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
import { initServiceSectionsMenu } from "./menu/service-sections.menu";
import { Database } from "sqlite3";
import { startCommand } from "./commands/start.command";
import { initCantieriMenu } from "./menu/cantieri.menu";
import { adminIds } from "./utils/admin.utils";
import { initProfilazioneMenu } from "./menu/profilazione.menu";
import { initWebcamDirectionMenu } from "./menu/webcam-direction.menu";
import {
  attivaNotifiche,
  initNotificheMenu,
  silenziaNotifiche,
} from "./menu/notifiche.menu";

dotenv.config();

const bot = new Telegraf<CurrentCtx>(process.env.BOT_TOKEN ?? "");

const throttler = telegrafThrottler();
bot.use(throttler);

const session = new LocalSession({
  database: process.env.DB_FOLDER + "local.db.json",
});
const i18n = new I18n({
  defaultLanguage: "it",
  directory: process.env.I18N_FOLDER || path.resolve(__dirname, "i18n"),
  useSession: true,
  sessionName: "session",
});
const db = new Database("db");

const createDatabase = () => {
  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS user (userId TEXT UNIQUE, notifiche INTEGER)"
    );
    global.database = db;
  });
};

createDatabase();

bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(initSession);
const stage = new Scenes.Stage<Scenes.SceneContext>([adminScene as any], {
  ttl: 10,
});
bot.use(stage.middleware() as any);

bot.use(GenericMenu.middleware());

bot.telegram.setMyCommands(commands);

bot.command(MenuAction.START, startCommand as any);
bot.command(MenuAction.MENU, initStartMenu as any);
bot.command(MenuAction.SETTINGS, initSettingsMenu as any);
bot.command(MenuAction.ATTIVA_NOTIFICHE, (ctx) => {
  let userId: string = ctx.chat.id.toString();
  if (userId) {
    userId = userId.toString().replace(".0", "");
  }
  attivaNotifiche(userId, ctx as any);
});
bot.command(MenuAction.SILENZIA_NOTIFICHE, (ctx) => {
  let userId: string = ctx.chat.id.toString();
  if (userId) {
    userId = userId.toString().replace(".0", "");
  }
  silenziaNotifiche(userId, ctx as any);
});

// bot.action(
//   new RegExp(MenuAction.START),
//   GenericMenu.onAction(
//     (ctx: any) => ctx.session.keyboardMenu,
//     initStartMenu as any
//   )
// );
bot.action(
  new RegExp(MenuAction.MENU),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initStartMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.WEBCAM_DIRECTION),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initWebcamDirectionMenu as any
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
    initServiceSectionsMenu as any
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
  new RegExp(MenuAction.CANTIERI_ALTA_VELOCITA),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initCantieriMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.START_PROFILAZIONE),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initProfilazioneMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.GESTIONE_NOTIFICHE),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initNotificheMenu as any
  )
);
bot.action(
  new RegExp(MenuAction.CHANGE_LANGUAGE),
  GenericMenu.onAction(
    (ctx: any) => ctx.session.keyboardMenu,
    initChangeLanguageMenu as any
  )
);

bot.command(
  "admin",
  Composer.acl(adminIds, (ctx) => ctx.scene.enter("adminScene"))
);
bot.command(
  "deleteDatabase",
  Composer.acl(adminIds, (ctx) => {
    db.run("DROP TABLE IF EXISTS user");
    createDatabase();
  })
);
bot.command(
  "readDatabase",
  Composer.acl(adminIds, (ctx) => {
    db.each("SELECT * FROM user", (err: string, row: any) => {
      console.log(row);
      ctx.sendMessage("User: " + row.userId);
    });
  })
);
bot.launch();

console.log("Bot is running da qua?!");

process.on("unhandledRejection", (err) => {
  console.log("Caught exception: " + err);
});
process.on("uncaughtException", (err) => {
  console.log("Caught exception: " + err);
});
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  db.close();
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  db.close();
});
