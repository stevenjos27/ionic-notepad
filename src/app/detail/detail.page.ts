import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { NotesService } from "../services/notes.service";
import { Note } from "../interfaces/note";
import { ThemeSwitcherService } from "../services/theme-switcher.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  private note: Note;

  constructor( private navCtrl: NavController, private route: ActivatedRoute, 
    private notesService: NotesService,  public themeSwitcher: ThemeSwitcherService,
    private storage: Storage ) { 
    // Initialise a placeholder note until the actual note can be loaded in
    this.note = {
      id: '',
      title: '',
      content: ''
    };

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

  ngOnInit() {
    // Get the id of the note from the URL
    let noteId = this.route.snapshot.paramMap.get('id');

    // Check that the data is loaded before getting the note
    // This handles the case where the detail page is loaded directly via the URL
    if(this.notesService.loaded){
      this.note = this.notesService.getNote(noteId);
    }else {
      this.notesService.load().then(() => {
        this.note = this.notesService.getNote(noteId)
      });
    }
  }

  noteChanged(){
    this.notesService.save();
  }

  deleteNote(){
    this.notesService.deleteNote(this.note);
    this.navCtrl.navigateBack('/notes');
  }

}
