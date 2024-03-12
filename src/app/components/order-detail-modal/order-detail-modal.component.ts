import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.css']
})
export class OrderDetailModalComponent {

  constructor(
    public dialogRef: MatDialogRef<OrderDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}


