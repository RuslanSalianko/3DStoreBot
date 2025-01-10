import { Context } from 'telegraf';
import { SceneContext, WizardContext } from 'telegraf/typings/scenes';
import { SessionContext } from 'telegraf/typings/session';

export type BotContext = Context &
  SceneContext &
  WizardContext &
  SessionContext<{
    isBan: boolean;
    isAdmin: boolean;
  }>;
