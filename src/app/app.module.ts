import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {MainEditorComponent} from './editor/main-editor/main-editor.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GameOfLifeService} from './game-of-life.service';
import {PatternsComponent} from './patterns/patterns.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {RouterModule, Routes} from '@angular/router';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {RleService} from './patterns/rle.service';
import {PatternComponent} from './patterns/pattern/pattern.component';
import {EditorComponent} from './editor/editor.component';
import {PatternsService} from './patterns/patterns.service';
import {PatternDetailComponent} from './patterns/pattern/pattern-detail/pattern-detail.component';
import {LinkifyPipe} from './linkify.pipe';
import {EditorHudComponent} from './editor/editor-hud/editor-hud.component';
import {ConfigComponent} from './config/config.component';
import {ConfigService} from './config/config.service';
import {AboutComponent} from './about/about.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ColorPickerModule} from 'ngx-color-picker';
import {AboutGameOfLifeComponent} from './about/about-game-of-life/about-game-of-life.component';
import {AboutTheSiteComponent} from './about/about-the-site/about-the-site.component';
import {AboutLinksComponent} from './about/about-links/about-links.component';
import {SortPipe} from './sort.pipe';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {SearchComponent} from './patterns/search/search.component';
import {InputBadgeComponent} from './patterns/search/input-badge/input-badge.component';
import {TypeaheadService} from './patterns/search/typeahead.service';
import {SaveSearchService} from './patterns/search/save-search.service';
import {ViewModeButtonComponent} from './patterns/view-mode-button/view-mode-button.component';
import {ThemeButtonComponent} from './patterns/theme-button/theme-button.component';
import {ListModePatternComponent} from './patterns/list-mode-pattern/list-mode-pattern.component';
import {PatternPreviewModalComponent} from './patterns/pattern-preview-modal/pattern-preview-modal.component';
import {PencilModule} from '@jimeh87/pencil';

const appRoutes: Routes = [
    {
      path: '',
      redirectTo: '/editor',
      pathMatch: 'full'
    },
    {
      path: 'editor',
      component: MainEditorComponent
    },
    {
      path: 'editor/pattern/:rle',
      component: MainEditorComponent
    },
    {
      path: 'patterns',
      component: PatternsComponent
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
        }
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
    MainEditorComponent,
    PatternsComponent,
    ErrorPageComponent,
    MainMenuComponent,
    PatternComponent,
    EditorComponent,
    PatternDetailComponent,
    LinkifyPipe,
    EditorHudComponent,
    ConfigComponent,
    AboutComponent,
    AboutGameOfLifeComponent,
    AboutTheSiteComponent,
    AboutLinksComponent,
    SortPipe,
    SearchComponent,
    InputBadgeComponent,
    ViewModeButtonComponent,
    ThemeButtonComponent,
    ListModePatternComponent,
    PatternPreviewModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    NgbModule,
    NgxPaginationModule,
    ColorPickerModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
    PencilModule
  ],
  providers: [RleService, GameOfLifeService, PatternsService, ConfigService, TypeaheadService, SaveSearchService],
  bootstrap: [AppComponent],
  entryComponents: [PatternPreviewModalComponent]
})
export class AppModule {
  constructor() {
  }
}
