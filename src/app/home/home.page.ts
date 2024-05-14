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
 
  page_num: number = 1;
  per_page: number = 14;
  
  
  
  favImages:boolean=false;
  defaultImages:boolean=true;
  busqueda:boolean = true;
  favoritos: boolean=false;
  buscar: boolean= true;
  

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
  async callLoadImages() {
    try {
      await this.GlobalService.loadImages(this.searchText);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  async onSearchChange(event:any, searchText: string) {
    try {
      await this.GlobalService.onSearchChange(event, this.searchText);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }
  



  

  loadMore() {
    this.page_num++;
    this.callLoadImages();
  }

  isFavorite(image: Image): boolean {
    return this.GlobalService.fav.some((favImage: Image) => favImage.src.large === image.src.large);
  }

  onImageClick(image: Image) {
    // Primero se hace la modificación de favoritos de manera local en array fav  
    if (!this.GlobalService.fav.some((favimage: Image) => favimage.src.large === image.src.large)) {
      this.GlobalService.fav.push(image);
    }
    else {
      this.GlobalService.fav = this.GlobalService.fav.filter((favImage: Image) => favImage.src.large !== image.src.large);   
    }
    console.log('la lista de favoritos es: ', this.GlobalService.fav);
     
    // Luego se actualizan los favoritos en el servicio y se sincronizan con la base de datos
    this.userService.setFavorites(this.GlobalService.fav); 
    this.userService.synchronizeFavoritesWithDatabase() 
      .then(() => {
        console.log('Favoritos sincronizados con la base de datos.');
      })
      .catch(error => {
        console.error('Error al sincronizar los favoritos con la base de datos:', error);
      });
  }

  verFav() {
    this.favImages = !this.favImages;
    this.defaultImages = !this.defaultImages;
    this.busqueda = !this.busqueda;
    this.favoritos = !this.favoritos;
    this.buscar = !this.buscar;  
    
   // if (!this.favImages) {
     // this.loadImages();
  //  }
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
    this.onImageClick(image)
  }
  
}