import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { SharedService } from 'src/app/service/shared.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiAdminService } from 'src/app/service/api-admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal-admin',
  templateUrl: './principal-admin.component.html',
  styleUrls: ['./principal-admin.component.css']
})

export class PrincipalAdminComponent implements OnInit {
  displayedColumns: string[] = ['name', 'activation_code'];
  clickEventsubscription: Subscription;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public api: ApiAdminService,
    private router: Router,
    private change: InterconnectionService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {

    this.clickEventsubscription=this.sharedService.getClickEvent().subscribe(()=>{
      this.getAllUniversity();
    });

  }
  ngOnInit(): void {
    
    this.getAllUniversity();

  }

  refresh(){

    this.getAllUniversity();

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showSnackBar(word: string): void {
    this.snackBar.open(word, 'Cerrar', {
      duration: 3000,
    });
  }

  copyToClipboard(textToCopy: string) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.showSnackBar('Código copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el texto al portapapeles: ', err);
    });
  }

  getAllUniversity(){
    this.api.getUniversities().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
