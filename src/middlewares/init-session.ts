import { CurrentCtx, Language } from "../interfaces/context.models";

export const initSession = async <T extends CurrentCtx>(
  ctx: T,
  next: Function
) => {
  if (!ctx.session.language) {
    ctx.session.language = Language.IT;
  }
  return next();
};
