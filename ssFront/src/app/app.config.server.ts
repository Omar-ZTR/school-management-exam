import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorInterceptor } from './services/servicesUser/token-interceptor.interceptor';
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true },
    
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
