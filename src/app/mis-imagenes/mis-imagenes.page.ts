import { Component, OnInit } from '@angular/core';
import { Image } from '../home/home.page';
import { GlobalService } from 'src/services/global.service';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { UserService } from 'src/services/user.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-imagenes',
  templateUrl: './mis-imagenes.page.html',
  styleUrls: ['./mis-imagenes.page.scss'],
})
export class MisImagenesPage implements OnInit {
  myPicts: Image[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    public GlobalService: GlobalService
  ) {}

  ngOnInit() {
    // Cargar las imágenes al iniciar la página
    this.loadImages();
    // Observar los cambios en las imágenes del servicio UserService
    this.userService.imagesChanged.subscribe((images: Image[]) => {
      this.myPicts = images;
    });
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    const savedImage = await this.guardarFoto(image);
    if (savedImage) {
      this.userService.saveImage(savedImage); // Guardar la imagen en el servicio
    }
  }

  async guardarFoto(image: any): Promise<Image | null> {
    const fileName = new Date().getTime() + '.jpeg';
    try {
      const base64Data = await this.readAsBase64(image);
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
      return {
        src: { large: image.webPath ?? '' },
        photographer: "mis fotos"
      };
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      return null;
    }
  }

  async readAsBase64(image: any) {
    try {
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      throw error;
    }
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function(event) {
        reject(event.target?.error);
      };
      reader.onload = function() {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  async subirImagen() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    const savedImage = {
      src: { large: image.webPath ?? '' },
      photographer: "mis fotos"
    };
    this.userService.saveImage(savedImage);
  }

  onClick() {
    this.GlobalService.logout().catch(error => console.log(error));
  }

  isFavorite(image: Image) {
    return this.GlobalService.isFavorite(image);
  }

  onCorazon(image: Image) {
    this.GlobalService.onCorazon(image);
  }

  private loadImages() {
    // Cargar las imágenes del servicio al iniciar la página
    this.userService.imagesChanged.subscribe((images: Image[]) => {
      this.myPicts = images;
    });
  }
}
