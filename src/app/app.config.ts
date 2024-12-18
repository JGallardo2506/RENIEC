import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

export const appConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(RouterModule)
  ]
};
