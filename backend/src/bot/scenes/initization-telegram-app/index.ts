import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { Language } from 'src/bot/language';
import { SCENE_ID } from 'src/bot/constants';
import { TEXT } from './text.constants';
import { BotContext } from 'src/bot/interface/bot-context.type';
import { AuthTelegramService } from 'src/bot/auth-telegram.service';

@Wizard(SCENE_ID.initializationTelegramApp)
export class InitializationTelegramAppWizardScene extends Language {
  constructor(private readonly authTelegram: AuthTelegramService) {
    super(new ConfigService());
  }

  @WizardStep(1)
  async step1(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT[this.language].setPhone);

    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: BotContext, @Message('text') phoneNumber: string) {
    const { phoneCodeHash } = await this.authTelegram.sendCode(phoneNumber);
    ctx.scene.state = {
      telegramApp: {
        phoneNumber,
        phoneCodeHash,
      },
    };

    ctx.reply('password');
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: BotContext, @Message('text') password: string) {
    ctx.scene.state['telegramApp']['password'] = password;
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: BotContext, @Message('text') phoneCode: string) {
    try {
      console.log('login');
      const state = ctx.scene.state as any;
      const { phoneNumber, password } = state.telegramApp;

      const session = await this.authTelegram.login(
        phoneNumber,
        phoneCode,
        password,
      );
      console.log('session ', session);
      console.log('end login');
      await ctx.scene.leave();
    } catch (error) {
      ctx.reply('password');
      ctx.scene.leave();
    }
  }
}
