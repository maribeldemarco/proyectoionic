import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/services/global.service';
import { UserService } from 'src/services/user.service';
import { ApiService } from 'src/services/api.service';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';


export interface Image {
  src: { large: string };
  photographer: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchText: string = "";
  search: boolean = false;  
  

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private modalController: ModalController,
    public GlobalService: GlobalService,
    
  ){  
      // Suscripción a los favoritos del service 
      this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
      this.GlobalService.fav = favorites;
      });
    }

  ngOnInit(): void {
    // Carga los favoritos del service al cargar la página
    this.userService.initFavoritesFromDatabase(); 
  }

  onClick() {
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }

  ionViewDidEnter() {    
    this.callLoadImages();
  }

  // Carga las imágenes llamando al servicio de la api que hace el fetch
 callLoadImages() {
  this.GlobalService.images = []; // Reinicializar la lista de imágenes
  this.GlobalService.loadImages(this.searchText);
  }

onSearchChange(event:any, searchText: string) {
    this.GlobalService.onSearchChange(event, this.searchText);
  }  


 loadMore() {
    try {
      this.GlobalService.loadMore(this.searchText);
    } catch (error) {
      console.error('Error al cargar mas imagenes:', error);
    }
  }  
   
  isFavorite(image: Image) {       
    return this.GlobalService.isFavorite(image);
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
  onCorazon(image:Image){
    this.GlobalService.onCorazon(image)
  }
  
}