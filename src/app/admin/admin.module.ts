import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ShareModule } from '../share-module/share.module';
import { ChartModule } from 'angular-highcharts';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminProductComponent,
    AdminOrderComponent,
    AdminUserComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    AdminRoutingModule,
    ShareModule
  ]
})
export class AdminModule { }
