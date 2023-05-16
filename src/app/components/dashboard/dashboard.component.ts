import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Subject, concat, forkJoin, from } from 'rxjs';
import { catchError, concatMap, map, retry, switchMap, toArray } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogCourseComponent } from '../dialog-course/dialog-course.component';
import { ApiService } from 'src/app/service/api.service';
import { Observable, of } from 'rxjs';
import { DialogComponent } from '../share/dialog/dialog.component';
import { tap } from 'rxjs/operators';
import { InterconnectionService } from 'src/app/service/interconnection.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  numColumns = 6;
  loading = true;
  paginator = false;
  element: any;
  cards: any;
  indexPage = 1;

 /*  cards : any; */
  private destroy$ = new Subject<void>();
  constructor(
    private api : ApiService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private change: InterconnectionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {}


    ngOnInit(): void {
      this.getCourses(1);

      this.breakpointObserver
    .observe([
      '(max-width: 757px)',  // XSmall
      '(min-width: 758px) and (max-width: 1120px)',  // Small
      '(min-width: 1121px) and (max-width: 1455px)',  // Medium
      '(min-width: 1456px) and (max-width: 1800px)',  // Large
      '(min-width: 1801px)' // ExtraLarge
    ])
    .pipe(
      map((breakpointState) => {
        if (breakpointState.breakpoints['(max-width: 757px)']) { // (min-width: 600px) and (max-width: 959.98px)
          return 1; // 2 columnas para pantallas pequeñas
        } else if (breakpointState.breakpoints['(min-width: 758px) and (max-width: 1120px)']) { // (min-width: 960px) and (max-width: 1279.98px)
          return 2; // 3 columnas para pantallas medianas
        } else if (breakpointState.breakpoints['(min-width: 1121px) and (max-width: 1455px)']) { // (min-width: 1280px) and (max-width: 1919.98px)
          return 3; // 4 columnas para pantallas grandes
        } else if (breakpointState.breakpoints['(min-width: 1456px) and (max-width: 1800px)']) { // (min-width: 1920px) and (max-width: 5000px)
          return 4; // 5 columnas para pantallas muy grandes
        } else {
          return 5; // 6 columnas para pantallas muy muy grandes
        }
      })
    )
    .subscribe((numColumns) => {
      this.numColumns = numColumns;
      this.changeDetector.markForCheck();
    });
   
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    showSnackBar(word: string): void {
      this.snackBar.open(word, 'Cerrar', {
        duration: 3000,
      });
    }

    addCard() {
      this.dialog.open(DialogCourseComponent, {
       width: '100%',
      }).afterClosed().subscribe(result => {
        if(result === 'true'){
          this.showSnackBar('Curso agregado');
          this.loading = true;
          this.paginator = false;
          this.getCourses();
          this.changeDetector.detectChanges();
        } 
      });
    }

    editCard(card: any) {
      this.api.getShiftsByCourse(card.id).subscribe({
        next: (result: any) => {
          card.shifts = result;
          this.dialog.open(DialogCourseComponent, {
            width: '100%',
            data: card
          }).afterClosed().subscribe(result => {
            if(result === 'update'){
              this.loading = true;
              this.showSnackBar('Curso editado');
              this.getCourses();
              this.changeDetector.detectChanges();
            }
          });
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }

    deleteCard(card: any) {
      this.dialog.open(DialogComponent, {
        height: '150px',
        width: '400px',
      }).afterClosed().subscribe(result => {
        if(result === 'Yes'){
             /* Categories */
         // Convertir arrays a Observables
        this.loading = true;
        this.paginator = false;
        this.changeDetector.detectChanges();

        this.api.deleteCourse(card.id).subscribe({
          next: (result: any) => {
            this.showSnackBar('Curso eliminado');
            this.loading = true;
            this.paginator = false;
            this.getCourses();
            this.changeDetector.detectChanges();
          },
          error: (error: any) => {
            this.showSnackBar('Error al eliminar el curso');
          }
        });
        }
      });
    }

    getCourses(page: number = 1) {
      (this.indexPage > 1) ? this.indexPage : this.indexPage = page;
      this.loading = true;
      this.api.getCoursesByUniversity(this.indexPage).subscribe({
        next: (result: any) => {
          console.log(result);
          this.element = result;
          this.cards = result.results;
          this.cards = this.cards.map((card: any) => {
            if (card.shifts && card.shifts.length > 0) {
              card.shift = card.shifts[0].start_time.slice(0, -3) + ' - ' + card.shifts[0].end_time.slice(0, -3);
            }
            return card;
          });
          
          console.log(this.loading);
        },
        error: (error: any) => {
          console.log(error);
          this.showSnackBar('Error al obtener los cursos');
        },
        complete: () => {
          if(this.cards.length == 0){
            this.paginator = false;
            this.showSnackBar('No hay cursos registrados');
          }else{
            this.loading = false;
            this.paginator = true;
            this.changeDetector.detectChanges();
          }
        }
      });
      
    }

    cambiarPagina(event: PageEvent) {
      const pageIndex = event.pageIndex;
      const pageSize = event.pageSize;
      const previousPageIndex = event.previousPageIndex;
      if (previousPageIndex !== undefined && pageIndex > previousPageIndex) {
        this.indexPage = pageIndex + 1;
        console.log('Avanzar a la página ' + pageIndex);
        this.getCourses(pageIndex + 1);
      } else if (previousPageIndex !== undefined && pageIndex < previousPageIndex) {
        this.indexPage = pageIndex + 1;
        this.getCourses(pageIndex + 1);
      }
    }
    
    

}
