import { Component } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { OrderService } from 'src/app/service/order/order.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Monthly Revenue'
    },
    xAxis: {
      categories: [] // Tên các tháng
    },
    yAxis: {
      title: {
        text: 'Revenue'
      }
    },
    series: [{
      type: 'column', // Chỉ định kiểu cho biểu đồ column
      name: 'Revenue',
      data: [] // Dữ liệu doanh thu theo tháng
    }]
  });

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getMonthlyRevenueByYear(2023);
  }
  getMonthlyRevenueByYear(year: number): void {
    this.orderService.getMonthlyRevenueByYear(year).subscribe(
      (data: { [key: string]: number }) => {
        console.log('Monthly Revenue:', data);

        // Chuyển đổi dữ liệu từ object thành mảng
        const months = Object.keys(data);
        const revenue = Object.values(data);

        console.log(months);
        console.log(revenue);

        if (this.chart && this.chart.ref && this.chart.ref.series[0]) {
          this.chart.ref.xAxis[0].setCategories(months);
          this.chart.ref.series[0].setData(revenue);

        }
      },
      (error) => {
        console.error('Error:', error);
        // Xử lý lỗi ở đây
      }
    );
  }
}
