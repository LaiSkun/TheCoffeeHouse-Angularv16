import { NgModule } from '@angular/core';
import { formatCurrency } from './formatCurrency.pipe';
import { DatePipe } from './date.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortDescriptionPipe } from './short-description.pipe';



@NgModule({
  declarations: [
    formatCurrency,
    DatePipe,
    ShortDescriptionPipe
  ],
  exports: [
    formatCurrency,
    DatePipe,
    ShortDescriptionPipe,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ShareModule { }
