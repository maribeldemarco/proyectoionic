import { Injectable } from "@angular/core";
import { Image } from "src/app/home/home.page";
import { UserService } from "./user.service";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from "src/app/image-modal/image-modal.component";
@Injectable({
    providedIn: 'root'
  })
  export class GlobalService {
  
  images: Image[] = [];
  page_num: number = 1;
  per_page: number = 14; 
  loading: boolean = true;
  fav: Image[] = []; 
  favImages:boolean=false;
  defaultImages:boolean=true;
  busqueda:boolean = true;
  favoritos: boolean=false;
  buscar: boolean= true;

    
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private apiService: ApiService, 
    private modalController: ModalController) { }

  async logout() {
    try {
      await this.userService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
      throw error;
    }
  }

  
  async loadImages(searchText: string) {
    try {
      this.loading = true;
      const response = await this.apiService.loadImages(searchText, this.page_num, this.per_page);
      this.images = this.images.concat(response.photos);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching images:', error);
      this.loading = false;
    }
  }

  onSearchChange(event: any, searchText: string) {
    this.images = [];
    this.page_num = 1;
    this.loading = true;
    this.loadImages(searchText);
    console.log(searchText);
  }

  loadMore(searchText: string) {
    this.page_num++;
    this.loadImages(searchText);
  }

  isFavorite(image: Image): boolean {
    return this.fav.some((favImage: Image) => favImage.src.large === image.src.large);
  }

  onCorazon(image:Image){
    this.onImageClick(image)
  }

  onImageClick(image: Image) {
    // Primero se hace la modificación de favoritos de manera local en array fav  
    if (!this.fav.some((favimage: Image) => favimage.src.large === image.src.large)) {
      this.fav.push(image);
    }
    else {
      this.fav = this.fav.filter((favImage: Image) => favImage.src.large !== image.src.large);   
    }
    console.log('la lista de favoritos es: ', this.fav);
     
    // Luego se actualizan los favoritos en el servicio y se sincronizan con la base de datos
    this.userService.setFavorites(this.fav); 
    this.userService.synchronizeFavoritesWithDatabase() 
      .then(() => {
        console.log('Favoritos sincronizados con la base de datos.');
      })
      .catch(error => {
        console.error('Error al sincronizar los favoritos con la base de datos:', error);
      });
  }
  async openImageModal(imageUrl: string, photographer: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        image: { src: { large: imageUrl }, photographer: photographer }, 
        
      }
    });
    return await modal.present();
  }  

  }

  

 