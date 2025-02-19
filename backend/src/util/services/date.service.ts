import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class DateService {
  constructor(private readonly i18n: I18nService) {}

  nowYYYDDMM() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseExpirationToSeconds(expiration: string) {
    const regex = /^(\d+)([smhdwy])$/;
    const match = expiration.match(regex);

    if (!match) {
      throw new Error(this.i18n.t('exception.formatSMHDWY'));
    }

    const value = parseInt(match[1], 10); // Number
    const unit = match[2]; // s, m, h, d, w, y

    const unitToSeconds = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      y: 31536000,
    };

    return value * (unitToSeconds[unit] || 0);
  }
}
