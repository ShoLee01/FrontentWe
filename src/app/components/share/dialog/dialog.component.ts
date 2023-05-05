import {Component, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  constructor(private dialogRef : MatDialogRef<DialogComponent>) { 
    dialogRef.disableClose = true; // Desactiva el cierre automático
   }

  closeDialogSi() {
    this.dialogRef.close('Yes');
  }

  closeDialogNo() {
    this.dialogRef.close('No');
  }



  
}
