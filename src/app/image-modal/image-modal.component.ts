import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Image } from '../home/home.page';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  
  @Input() image: Image = {} as Image

  
  constructor(
    private modalController: ModalController,        
  ) {}

  ngOnInit() {
    console.log(this.image)
   
  }

  closeModal() {
    this.modalController.dismiss();
  }
  
}