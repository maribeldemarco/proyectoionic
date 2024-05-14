import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyImagesComponent } from './my-images.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [MyImagesComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [MyImagesComponent] // Exporta el componente para que pueda ser utilizado en otros módulos
})
export class MyImagesModule { }