import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-confirn-dialog',
  templateUrl: './confirn-dialog.component.html',
  styles: [
  ]
})
export class ConfirnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hero,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm():void{
    this.dialogRef.close(true)
  }
}
