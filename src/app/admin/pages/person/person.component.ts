import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Package1Service } from 'src/app/service/package1.service';
import { IPackage1 } from 'src/app/service/package1';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  package1List:IPackage1[];
  p:number=1;
  constructor(
    private package1Service:Package1Service,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.package1Service.getPackage1List().subscribe(ps=>this.package1List=ps);
    this.activatedRoute.queryParamMap.subscribe(
      query=>{
        const orderBy=query.get('orderby');
        console.log(orderBy);
      }
    )
  }

}
