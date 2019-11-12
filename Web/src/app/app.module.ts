import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { GameAreaComponent } from './game-area/game-area.component';
import { GamePageComponent } from './game-page/game-page.component';
import { TestRenderComponent } from './test-render/test-render.component';
import { CardComponent, DraggableDirective } from './card/card.component';
import { HandComponent } from './hand/hand.component';
import { BenchComponent } from './bench/bench.component';
import { BattleComponent } from './battle/battle.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    RegisterComponent,
    GameAreaComponent,
    GamePageComponent,
    TestRenderComponent,
    CardComponent,
    DraggableDirective,
    HandComponent,
    BenchComponent,
    BattleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [
    DraggableDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
