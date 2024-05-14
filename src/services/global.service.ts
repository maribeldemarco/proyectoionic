import { Injectable } from "@angular/core";
import { Image } from "src/app/home/home.page";
import { UserService } from "./user.service";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";

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

    
  
  constructor(private userService: UserService, private router: Router, private apiService: ApiService) { }

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
  }

  }

  

 