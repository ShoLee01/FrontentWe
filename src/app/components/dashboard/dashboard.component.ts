import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogCourseComponent } from '../dialog-course/dialog-course.component';
import { ApiService } from 'src/app/service/api.service';
import { Observable, of } from 'rxjs';
import { DialogComponent } from '../share/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  numColumns = 6;
  loading = true;
  cards: any;
 /*  cards : any; */
  private destroy$ = new Subject<void>();
  constructor(
    private api : ApiService,
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {}


    ngOnInit(): void {
      this.api.getProfile().pipe(
        retry(3) // intenta la petición hasta 3 veces antes de emitir un error
      ).subscribe({
        next: (result: any) => {
          if(result.number_of_courses == 0){
            this.showSnackBar('No hay cursos registrados');
            this.changeDetector.markForCheck();
            this.loading = false;
          }else{
            this.getCourses();
          }
          console.log(result);
        },
        error: (error: any) => {
          console.log(error);
        }
      });

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

    

 /*    console.log(this.numColumns); */

     /*  setTimeout(() => {
        this.loading = false; // actualizar la variable loading después de 3 segundos
        this.changeDetector.detectChanges(); // invocar la función changeDetector.detectChanges() después de 3 segundos
      }, 3000); 
      setTimeout(() => { }, 3000);*/

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
          this.getCourses();
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
              this.showSnackBar('Curso editado');
              this.getCourses();
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
          for(let categories of card.category){
            this.api.deleteCategoryAndCourse(categories.id,card.id).subscribe({
              next: (result: any) => {
                console.log(result);
              },
              error: (error: any) => {
                console.log(error);
              }
            });
          }
          /* types of programs */
          for(let types of card.type_of_program){
            this.api.deleteProgramTypeAndCourse(types.id,card.id).subscribe({
              next: (result: any) => {
                console.log(result);
              },
              error: (error: any) => {
                console.log(error);
              }
            });
          }
          /* Modalities */
          for(let modalities of card.modality){
            this.api.deleteModalityAndCourse(modalities.id,card.id).subscribe({
              next: (result: any) => {
                console.log(result);
              },
              error: (error: any) => {
                console.log(error);
              }
            });
          }
          /* Shifts */
          this.api.getShiftsByCourse(card.id).subscribe({
            next: (result: any) => {
              for(let shifts of result){
                this.api.deleteShift(shifts.id).subscribe({
                  next: (result: any) => {
                    console.log(result);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });
              }
            },
            error: (error: any) => {
              console.log(error);
            }
          });
          /* Course */
          setTimeout(() => { 
            this.api.deleteCourse(card.id).subscribe({
              next: (result: any) => {
                this.showSnackBar('Curso eliminado');
                this.getCourses();
              },
              error: (error: any) => {
                this.showSnackBar('Error al eliminar el curso');
              }
            });
          }, 1000);
        
        }
      });
    }

    diffInMonthsOrDays(start_date:any, end_date:any) {
      const start = new Date(start_date);
      const end = new Date(end_date);
    
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Calcular diferencia en meses
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
      // Retornar resultado
      if (diffDays < 30) {
        return `${diffDays} días`;
      } else if (diffMonths === 1) {
        return `1 mes`;
      } else {
        return `${diffMonths} meses`;
      }
    }

    getCourses(){

        this.api.getCoursesByUniversity().subscribe({
          next: (result: any) => {
            console.log(result);
            /* this.cards = of(result); */
            this.cards = result;
            console.log(this.loading);
          },
          error: (error: any) => {
            console.log(error);
            this.showSnackBar('Error al obtener los cursos');
          },
          complete: () => {
            // Actualizar el estado de loading aquí
            if(this.cards.length == 0){
              this.showSnackBar('No hay cursos registrados');
            }
  
            for (let [index, card] of this.cards.entries()) {
              this.api.getShiftsByCourse(card.id).subscribe({
                next: (result: any) => {
                  if(result.length > 0){
                    this.cards[index].shift = result[0].start_time.slice(0, -3) + ' - ' + result[0].end_time.slice(0, -3);
                  }
                  console.log(result);
                },
                error: (error: any) => {
                  console.log(error);
                },
                complete: () => {
                  this.loading = false;
                  this.changeDetector.detectChanges();
                  console.log(this.loading);
                }
              });
            }
  
            /*  */
            for (let [index, card] of this.cards.entries()) {
              this.api.getShiftsBySchedule(card.id).subscribe({
                next: (result: any) => {
                    this.cards[index].turno = result.shifts;
                    console.log(result);
                },
                error: (error: any) => {
                  console.log(error);
                },
                complete: () => {
                  this.loading = false;
                  this.changeDetector.detectChanges();
                  console.log(this.loading);
                }
              });
            }
          }
        });
    }

    
    
    
    
    

}
