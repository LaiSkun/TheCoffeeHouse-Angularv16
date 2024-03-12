import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailModalComponent } from 'src/app/components/order-detail-modal/order-detail-modal.component';
import { OrderService } from 'src/app/service/order/order.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css'],
})
export class AdminOrderComponent {
  page: number = 1;

  orderList: any[] = [];

  orderDetailList: any[] = [];

  // Biến để giữ tham chiếu đến modal hiện tại
  private isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
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
