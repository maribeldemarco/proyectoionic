import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisImagenesPageRoutingModule } from './mis-imagenes-routing.module';

import { MisImagenesPage } from './mis-imagenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisImagenesPageRoutingModule
  ],
  declarations: [MisImagenesPage]
})
export class MisImagenesPageModule {}
