import { Package2ManagerComponent } from './pages/package2-manager/package2-manager.component';
import { AccountManagerComponent } from './pages/account-manager/account-manager.component';
import { PostComponent } from './pages/post/post.component';
import { AccountComponent } from './pages/account/account.component';
import { HotronguoingheoComponent } from './pages/hotronguoingheo/hotronguoingheo.component';
import { SidebarComponent } from './block/sidebar/sidebar.component';
import { AdminDefaultLayoutComponent } from './block/admin-default-layout/admin-default-layout.component';
import { HeaderComponent } from './block/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

import { BrowserModule } from '@angular/platform-browser';
import { AdminRoutingModule } from './admin-routing.module';
import { DashBoardComponent } from './pages/dash-board/dash-board.component';
import { PersonComponent } from './pages/person/person.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ReceivefoodComponent } from './pages/receivefood/receivefood.component';
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    HeaderComponent,
    DashBoardComponent,
    SidebarComponent,
    HotronguoingheoComponent,
    AdminDefaultLayoutComponent,
    AccountComponent,
    PersonComponent,
    PostComponent,
    AccountManagerComponent,
    Package2ManagerComponent,
    ReceivefoodComponent
  ],
  imports: [
   // SocketIoModule.forRoot(config),

    CommonModule,
    ReactiveFormsModule,
    Ng2OrderModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule,
    BrowserModule,
    AdminRoutingModule,
  ],
  providers: [],

})
export class AdminModule { }
