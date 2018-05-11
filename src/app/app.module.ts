import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {MainGameBoardComponent} from './main-game-board/main-game-board.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GameOfLifeService} from './game-of-life.service';
import {TemplatesComponent} from './templates/templates.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {RouterModule, Routes} from '@angular/router';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {RleService} from './templates/rle.service';
import {TemplateComponent} from './templates/template/template.component';
import {GameBoardComponent} from './game-board/game-board.component';
import {TemplatesService} from './templates/templates.service';
import {TemplateDetailComponent} from './templates/template/template-detail/template-detail.component';
import {LinkifyPipe} from './linkify.pipe';
import {GameBoardHudComponent} from './game-board-hud/game-board-hud.component';
import {ConfigComponent} from './config/config.component';
import {ConfigService} from './config/config.service';
import {AboutComponent} from './about/about.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {TemplateFilterPipe} from './template-filter.pipe';
import {SpinnerComponent} from './spinner/spinner.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {AboutMenuComponent} from './about/about-menu/about-menu.component';
import {AboutGameOfLifeComponent} from './about/about-game-of-life/about-game-of-life.component';
import {AboutTheSiteComponent} from './about/about-the-site/about-the-site.component';
import {AboutLinksComponent} from './about/about-links/about-links.component';
import {SortPipe} from './sort.pipe';
import {HttpClientModule} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
    {
      path: '',
      redirectTo: '/game-board',
      pathMatch: 'full'
    },
    {
      path: 'game-board',
      component: MainGameBoardComponent
    },
    {
      path: 'game-board/template/:rle',
      component: MainGameBoardComponent
    },
    {
      path: 'templates',
      component: TemplatesComponent
    },
    {
      path: 'themes',
      component: ConfigComponent
    },
    {
      path: 'about',
      component: AboutComponent,
      children: [
        {
          path: '',
          redirectTo: 'site',
          pathMatch: 'full'
        },
        {
          path: 'game-of-life',
          component: AboutGameOfLifeComponent
        },
        {
          path: 'site',
          component: AboutTheSiteComponent
        },
        {
          path: 'links',
          component: AboutLinksComponent
        },
      ]
    },
    {
      path: 'not-found',
      component: ErrorPageComponent,
      data: {
        message: 'Page not found!'
      }
    },
    {
      path: '**',
      redirectTo: '/not-found'
    }
  ]
;

@NgModule({
  declarations: [
    AppComponent,
    MainGameBoardComponent,
    TemplatesComponent,
    ErrorPageComponent,
    MainMenuComponent,
    TemplateComponent,
    GameBoardComponent,
    TemplateDetailComponent,
    LinkifyPipe,
    GameBoardHudComponent,
    ConfigComponent,
    AboutComponent,
    TemplateFilterPipe,
    SpinnerComponent,
    AboutMenuComponent,
    AboutGameOfLifeComponent,
    AboutTheSiteComponent,
    AboutLinksComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    NgxPaginationModule,
    ColorPickerModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [RleService, GameOfLifeService, TemplatesService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
