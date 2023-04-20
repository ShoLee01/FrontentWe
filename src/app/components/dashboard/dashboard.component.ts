import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil  } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  numColumns = 6;
  private destroy$ = new Subject<void>();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    ) {}
    ngOnInit(): void {
      this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
    ])
    .pipe(
      map((breakpointState) => {
        if (breakpointState.breakpoints[Breakpoints.XSmall]) { // (min-width: 600px) and (max-width: 959.98px)
          return 1; // 2 columnas para pantallas pequeñas
        } else if (breakpointState.breakpoints[Breakpoints.Small]) { // (min-width: 960px) and (max-width: 1279.98px)
          return 2; // 3 columnas para pantallas medianas
        } else if (breakpointState.breakpoints[Breakpoints.Medium]) { // (min-width: 1280px) and (max-width: 1919.98px)
          return 3; // 4 columnas para pantallas grandes
        } else if (breakpointState.breakpoints[Breakpoints.Large]) { // (min-width: 1920px) and (max-width: 5000px)
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

    console.log(this.numColumns);

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
      this.showSnackBar('Curso agregado');
    }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        /* return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
        ]; */
        return [
          { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
            start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
            { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
            start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
            { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
            start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
            { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
            start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
            { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
            start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
        ];      
}

return [
  { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
    start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
    { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
    start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
    { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
    start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
    { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
    start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
    { title: 'Ingenieria industrial', cols: 1, rows: 1, background_image:'https://imgs.search.brave.com/rwQr60QoOHukZjZ3sp5p2vSqh-xyD6WA5v1hJmOD6PU/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS82Mi85/MC9vd2s4UUguanBn',
    start_of_course:'2021-01-01', discount:'10', price:'100', program_type:'Diplomado Especializado', institution:'Univerdidad peruana de ciencias aplicadas', end_of_course:'2021-01-01', modalidad:'Semipresencial', turno:'mañana', duration:'3', horario1:'7:00am a 8:00am' },
];   
    })
  );


}
