import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ApiService } from 'src/services/api.service';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';


export interface Image {
  src: { large: string };
  photographer: string;
}
@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {

  searchText: string = "";
  images: Image[] = [];
  page_num: number = 1;
  per_page: number = 14;
  search: boolean = false;
  loading: boolean = true;
  fav: Image[] = []; 
  favImages:boolean=true;
  defaultImages:boolean=true;
  busqueda:boolean = true;
  favoritos: boolean=false;
  buscar: boolean= true;
  

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
    private modalController: ModalController  
    
  ){  
      // Suscripción a los favoritos del service 
      this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
      this.fav = favorites;
      });
    }
  ngOnInit() {
      // Carga los favoritos del service al cargar la página
      this.userService.initFavoritesFromDatabase(); 
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  ionViewDidEnter() {
  
    this.loadImages();
  }

  // Carga las imágenes llamando al servicio de la api que hace el fetch
  async loadImages() {
    try {
      this.loading = true;
      const response = await this.apiService.loadImages(this.searchText, this.page_num, this.per_page);
      this.images = this.images.concat(response.photos);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching images:', error);
      this.loading = false;
    }
  }  

  onSearchChange(event: any) {
    this.images = [];
    this.page_num = 1;
    this.loading = true;
    this.loadImages();
  }

  loadMore() {
    this.page_num++;
    this.loadImages();
  }

  isFavorite(image: Image): boolean {
    return this.fav.some((favImage: Image) => favImage.src.large === image.src.large);
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

  verFav() {
    this.favImages = !this.favImages;
    this.defaultImages = !this.defaultImages;
    this.busqueda = !this.busqueda;
    this.favoritos = !this.favoritos;
    this.buscar = !this.buscar;  
    
    //if (!this.favImages) {
   //   this.loadImages();
   // }
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