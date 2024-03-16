import { ApplicationConfig } from '@angular/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { ptBR } from 'date-fns/locale';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DateFnsConfigurationService, useFactory: () => {
        const config = new DateFnsConfigurationService();
        config.setLocale(ptBR);
        return config;
      }
    }
  ],
};
