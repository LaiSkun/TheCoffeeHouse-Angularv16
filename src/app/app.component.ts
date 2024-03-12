import { Component } from '@angular/core';
import { HeaderFooterService } from './service/show/header-footer.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'The Coffe House';

  constructor(public show : HeaderFooterService){}

  onActive(event : any) : void {
    const componentsWithoutHeader = ['OrderComponent', 'LoginComponent', 'RegisterComponent', 'ForgotPasswordComponent'];
    const showHeader = !componentsWithoutHeader.includes(event.contructor.name);
    this.show.setShowHeaderFooter(showHeader);
  }
}
