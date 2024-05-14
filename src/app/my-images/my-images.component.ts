import { Component, OnInit } from '@angular/core';
import { Image } from '../home/home.page';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-my-images',
  templateUrl: './my-images.component.html',
  styleUrls: ['./my-images.component.scss'],
})
export class MyImagesComponent  implements OnInit {

  myPicts: Image[] = [];
  capturedImageUrl: string = ''; 
  myImages:boolean = false;

  constructor() { }

  ngOnInit() {}

  async tomarFoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    })
    
    //si saco la foto la asigno a la variable
    if(image.webPath){
    this.capturedImageUrl = image.webPath;

    // con la foto creo una nueva Image para el array de imagenes
    const newImage: Image = {
      src: { large: this.capturedImageUrl },
      photographer: "mis fotos"
    };
    // agrego la nueva imagen
    this.myPicts.push(newImage);
    console.log(this.capturedImageUrl)    
 
    console.log('la lista de mis imagenes es: ', this.myPicts);
    
    //renderiza las imagener del array myPicts
    this.myImages =true;
   }
    
  }

}
