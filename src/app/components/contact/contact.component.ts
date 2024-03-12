// contact.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/service/order/order.service';
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {



  orderList: any[] = [];

  orderDetailList: any[] = [];

  // Biến để giữ tham chiếu đến modal hiện tại
  private isModalOpen = false;


  constructor( private route: ActivatedRoute , private dialog: MatDialog,
    private orderService: OrderService){
  }
  ngOnInit(): void {
    this.loadOrder();
   }

   loadOrder(){
    this.orderService.getAllOrder().subscribe((orders) => {
      this.orderList = orders;
    });
  }

   onOrderIdSelected(orderId: number): void {
    if (this.isModalOpen) {
      return; // Nếu modal đã mở, không làm gì cả
    }

    this.isModalOpen = true;

    // Gọi service để lấy orderdetail
    this.orderService.filterOrderdetailByOrder(orderId).subscribe(
      (orderDetails) => {
        this.orderDetailList = orderDetails;

        // Mở modal với dữ liệu order detail
        const dialogRef = this.dialog.open(OrderDetailModalComponent, {
          data: orderDetails, // Truyền order detail vào modal
        });

        // Đăng ký sự kiện khi modal được đóng
        dialogRef.afterClosed().subscribe(() => {
          this.isModalOpen = false; // Đặt lại cờ khi modal được đóng
        });
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.isModalOpen = false; // Đặt lại cờ nếu có lỗi khi lấy dữ liệu
      }
    );
   }
 }
