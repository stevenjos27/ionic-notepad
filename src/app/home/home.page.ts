import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from "@ionic/angular";
import { NotesService } from "../services/notes.service";
import { ThemeSwitcherService } from "../services/theme-switcher.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController,
    private notesService: NotesService, public themeSwitcher: ThemeSwitcherService,
    private storage: Storage ) { }

  ngOnInit() {
    this.notesService.load();
    this.storage.get('theme').then((theme) => {
      // Only set this.notes to the returned value if there were values stored
      if(theme != null){
        this.themeSwitcher.setTheme(theme);
      }
      else {
        this.themeSwitcher.setTheme("default");
      }
    });
  }

  addNote() {

    this.alertCtrl.create({
      header: 'New Note',
      message: 'What should the title of this note be?',
      inputs: [
        {
          type: 'text',
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            this.notesService.createNote(data.title);
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });

  }

  changeTheme(){
    this.themeSwitcher.cycleTheme();
  }
}
