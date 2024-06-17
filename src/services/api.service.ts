import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apikey = "R92mAvgFs3ezQwGZhyvvEatUgxxpSjz15q97jbfhMmidxRTx7K49OZNf";
  constructor() { }

  /**
  * @function loadImages  
  * @descripción utiliza la función fetch para hace una solicitud HTTP a la URL de la API de imagenes de pexels con la apikey provista por esta. Si la respuesta es exitosa, se retorna un objeto json con propiedades de las imagenes.
  * @param {string} searchText se envia como parametro los valores a buscar.
  * @param {number} page variable que indica la pagina actual.
  * @param {number} perPage variable que indica la cantidad de imagenes por pagina que devolvera la api.
  * @return {Promise<any>}
  */  
  async loadImages(searchText: string, page: number, perPage: number): Promise<any> {
    let url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
    if (searchText) {
      url = `https://api.pexels.com/v1/search?query=${searchText}&page=${page}&per_page=${perPage}`;
    }    
    const response = await fetch(url, {
      headers: {
        'Authorization': this.apikey
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }
}
