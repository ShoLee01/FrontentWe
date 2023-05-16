import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ApiService } from 'src/app/service/api.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'app-dialog-course',
  templateUrl: './dialog-course.component.html',
  styleUrls: ['./dialog-course.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DialogCourseComponent implements OnInit {
  courseForm !: FormGroup;
  actionBtn : string = "Guardar";
  languages = ["Español", "Ingles",]
  program_types : any;
  categories : any;
  categoriesSelected : { id: any; name: any, number_of_courses: any }[] = [];
  modalities : any;
  //Paises de latinoamerica
  shifts: { start_time: string; end_time: string, weekday: string }[] = [];
  countries = ["Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"]
  day = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]; // Agrega un array para guardar los dias
  weekday_cro : any;// Agrega un array para guardar los dias
  backgroundFile: File | null = null;
  backgroundName: string = '';
  values = 0;
  type_of_program_selected: any;
  modality_selected: any;
  constructor(private formBuider :FormBuilder,
    private api : ApiService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public editData: any,
   private dialogRef : MatDialogRef<DialogCourseComponent>) { 
    dialogRef.disableClose = true; // Desactiva el cierre automático
   }

   ngOnInit(): void {

    this.weekday_cro ={
      Lunes: 'Lun',
      Martes: 'Mar',
      Miercoles: 'Mie',
      Jueves: 'Jue',
      Viernes: 'Vie',
      Sabado: 'Sab',
      Domingo: 'Dom'
    }

    /* Programs Types */
    this.api.getPrograms().subscribe({
      next: (data: any) => {
        this.program_types = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    /* Categories */
    this.api.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    /* Modalities */
    this.api.getModalities().subscribe({
      next: (data: any) => {
        this.modalities = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });


    this.courseForm = this.formBuider.group({
      //Titulo del curso (input type="text")
      title : ['', Validators.required],
      // Link que se mostrará en la página de inicio del curso (input type="text")
      link : ['', Validators.required],
      // Imagen de fondo del curso  (type="file")
      background_image : [null],
      // Boleam que indica si requiere requisitos para llevarlo (mat-radio-group)
      requirements : [false],
      // numero de estrellas que tendrá el curso (mat-slider) que va de 0 a 5
      // Fecha de inicio del curso (mat-datepicker-toggle)
      start_of_course : ['', Validators.required],
      // Fecha de fin del curso (mat-datepicker-toggle)
      end_of_course : ['', Validators.required],
      // Número de meses que durará el curso (input type="number")
      numer_of_months : [0],
      // Descuento que tendrá el curso (mat-slider) que va de 0 a 100
      discount : [0],
      // Precio del curso (input type="number")
      price : [0, Validators.required],
      // País donde se llevará a cabo el curso (mat-select) (mat-option)
      country : ['', Validators.required],
      // Ciudad donde se llevará a cabo el curso (input type="text")
      city : ['', Validators.required],
      // Fecha de inscripción del curso (mat-datepicker-toggle)
      registration_date : ['', Validators.required],
      // Idioma en el que se llevará a cabo el curso (mat-select) (mat-option)
      language : ['', Validators.required],
      // Número de horas que tendrá el curso (input type="number")
      number_of_teachers : [0],
      // Booleam que indica si se puede pagar en cuotas (mat-radio-group)
      accept_installments : [false],
      // Catergoría del curso (mat-select) (mat-option)
      category : [''],
      // Moderidad del curso (mat-select) (mat-option)
      modality : [0, Validators.required],
      // Tipo de programa del curso (mat-select) (mat-option)
      type_of_program : [0, Validators.required],
    })

    
    this.courseForm.get('start_of_course')?.valueChanges.subscribe(() => {
      this.calculateMonths();
    });

    this.courseForm.get('end_of_course')?.valueChanges.subscribe(() => {
      this.calculateMonths();
    });

    if(this.editData){
      this.actionBtn = "Actualizar";
      console.log(this.editData);
      this.editData.start_of_course = new Date(this.editData.start_of_course);
      this.editData.end_of_course = new Date(this.editData.end_of_course);
      this.editData.registration_date = new Date(this.editData.registration_date);
      this.courseForm.patchValue(this.editData); // patch the form with the data
      this.type_of_program_selected = this.editData.type_of_program[0].id;
      this.modality_selected = this.editData.modality[0].id;
      this.calculateMonths();

      for(let i of this.editData.category){
        this.categoriesSelected.push(i);
      }
      //this.shifts.push(
      for(let i of this.editData.shifts){
        this.shifts.push(i);
      }
    }
  }
  CategorySelected() {
    let obj =this.categories.find((o: any) => o.id === this.courseForm.value.category);
    this.categoriesSelected.push(obj);
    console.log(this.categoriesSelected);
  }

  CustomCategorySelected() {
    if (this.categoriesSelected.length > 0){
      return this.categories?.filter((i: any) => !this.categoriesSelected.some((j: any) => i.id === j.id));
    } else {
      return this.categories;
    }
  }

  calculateMonths() {
    let start = this.courseForm.get('start_of_course')?.value;
    let end = this.courseForm.get('end_of_course')?.value;

    if (start && end && this.courseForm.value.start_of_course != '' && this.courseForm.value.end_of_course != '') {
      const startDate = moment(start);
      const endDate = moment(end);
      const duration = moment.duration(endDate.diff(startDate));
      const months = duration.asMonths();
      start = startDate.toISOString().split('T')[0];
      end = endDate.toISOString().split('T')[0];
      if(this.courseForm.value.numer_of_months == 0){
        this.courseForm.get('numer_of_months')?.setValue(Math.round(months));
      }else if(this.courseForm.value.start_of_course != this.editData.start_of_course || this.courseForm.value.end_of_course != this.editData.end_of_course){
        this.courseForm.get('numer_of_months')?.setValue(Math.round(months));
      }
    }
  }
  
  formatDate(event: any): void {
    const formattedDate = this.datePipe.transform(event.value, 'dd/MM/yyyy');
    // Use the formatted date as needed
  }

  deleteCategory(index: any){
    this.categoriesSelected.splice(index, 1);
  }
  
  showSnackBar(word: string): void {
    this.snackBar.open(word, 'Cerrar', {
      duration: 3000,
    });
  }
  onSliderChange(value: number) {
    console.log('Valor del slider:', value);
    this.changeDetectorRef.detectChanges();
  }

  onFileChange(event: any, type: 'background') {
      if (event.target.files.length > 0) {
        if (type === 'background') {
          this.backgroundName = event.target.files[0].name;
          this.backgroundFile = event.target.files[0];
      }
    }
  }

  isShiftValid(startTime: string, endTime: string, weeday: string): boolean {
    // Implementa la lógica para validar el turno
    console.log(startTime, endTime, weeday);
    if (startTime === endTime) return false;
    if (startTime >= endTime) return false;
    if (weeday == undefined) return false;
    startTime = startTime + ':00';
    endTime = endTime + ':00'; 
    for (let shift of  this.shifts) {
        console.log(shift);
      if (shift.start_time == startTime && shift.end_time == endTime && shift.weekday == weeday) {
        this.showSnackBar('El turno ya existe');
        return false;
      }
    }
    return true;
  }

  deleteShift(index: number): void {
    this.shifts.splice(index, 1);
  }

  addShift(startTime: string, endTime: string, weeday: string): void {
    // Implementa la lógica para agregar un turno
    if (this.isShiftValid(startTime, endTime, weeday)) {
      startTime = startTime + ':00';
      endTime = endTime + ':00'; 
      this.shifts.push({ start_time: startTime, end_time: endTime, weekday: weeday });
    } else {
      this.showSnackBar('El turno no es válido');
    };
  }

  findElementsByDelete(Presente: any[], Pasado: any[]): any[] {
    // Encuentra elementos en B que no están en A
    const elementsInBnotInA = Pasado.filter(itemB => !Presente.find(itemA => itemB.id === itemA.id));
    return elementsInBnotInA;
  }

  findElementsByAdd(Presente: any[], Pasado: any[]): any[] {
    // Encuentra elementos en A que no están en B
    const elementsInANotInB = Presente.filter(itemA => !Pasado.find(itemB => itemA.id === itemB.id));
    return elementsInANotInB;
  }

  /* Shifts  find*/

  findShiftsByDelete(Presente: any[], Pasado: any[]): any[] {
    // Encuentra elementos en B que no están en A
    const elementsInBnotInA = Pasado.filter(itemB => !Presente.find(itemA => itemB.start_time === itemA.start_time && itemB.end_time === itemA.end_time));
    return elementsInBnotInA;
  }

  findShiftsByAdd(Presente: any[], Pasado: any[]): any[] {
    // Encuentra elementos en A que no están en B
    const elementsInANotInB = Presente.filter(itemA => !Pasado.find(itemB => itemA.start_time === itemB.start_time && itemA.end_time === itemB.end_time));
    return elementsInANotInB;
  }

  /*  */

  arraysAreEqual(arrayA: any[], arrayB: any[]): boolean {
    // Comprueba si ambos arrays tienen la misma longitud
    if (arrayA.length !== arrayB.length) {
      return false;
    }
    // Comprueba si todos los elementos de A están en B y viceversa
    const aHasAllElementsInB = arrayA.every(itemA => arrayB.find(itemB => itemA.id === itemB.id));
    const bHasAllElementsInA = arrayB.every(itemB => arrayA.find(itemA => itemB.id === itemA.id));
    return aHasAllElementsInB && bHasAllElementsInA;
  }
  
  
  

  submitForm(){
    if (this.courseForm.valid) {
        /* Validando fechas */
        if(this.courseForm.value.start_of_course < this.courseForm.value.end_of_course && this.courseForm.value.start_of_course != this.courseForm.value.end_of_course){
          if(this.courseForm.value.registration_date > this.courseForm.value.start_of_course){
            this.showSnackBar('La fecha de inscripción no puede ser mayor a la fecha de inicio del curso');
            return;
          }else{
            console.log(this.courseForm.value.registration_date);
            this.courseForm.value.registration_date = this.courseForm.value.registration_date.toISOString().split('T')[0];
          }
          if(this.categoriesSelected.length > 0){
            console.log(this.courseForm.value.start_of_course);
            console.log(this.courseForm.value.end_of_course);           
            this.courseForm.value.start_of_course = this.courseForm.value.start_of_course.toISOString().split('T')[0];
          this.courseForm.value.end_of_course = this.courseForm.value.end_of_course.toISOString().split('T')[0];
          
          if (this.editData) {
            /* Edita la informacion */
            if(this.editData.type_of_program[0].id != this.courseForm.value.type_of_program){

                
                this.api.deleteProgramTypeAndCourse(this.editData.type_of_program[0].id, this.editData.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });

                this.api.createProgramTypeAndCourse(this.courseForm.value.type_of_program, this.editData.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });
            }
            /* Modalidad de curso */
            if(this.editData.modality[0].id != this.courseForm.value.modality){
                
                this.api.deleteModalityAndCourse(this.editData.modality[0].id, this.editData.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });

                this.api.createModalityAndCourse(this.courseForm.value.modality, this.editData.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });

            }
            /* Actualizar Categoria */
            if(!this.arraysAreEqual(this.editData.category, this.categoriesSelected)){
              /* Elimiar Categoria */
              let toDelete = this.findElementsByDelete(this.categoriesSelected, this.editData.category);
              if(toDelete.length > 0){
                for(let category of toDelete){
                  this.api.deleteCategoryAndCourse(category.id, this.editData.id).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
              }
              /* Agregar Categoria */
              let toAdd = this.findElementsByAdd(this.categoriesSelected, this.editData.category);
              if(toAdd.length > 0){
                for(let category of toAdd){
                  this.api.createCategoryAndCourse(category.id, this.editData.id).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
              }
            }
            /* Actualizar Shifts */
            if(!this.arraysAreEqual(this.editData.shifts, this.shifts)){
              /* Elimiar Shifts */
              let toDelete = this.findElementsByDelete(this.shifts, this.editData.shifts);
              if(toDelete.length > 0){
                for(let shift of toDelete){
                  this.api.deleteShift(shift.id).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
              }
              /* Agregar Shifts */
              let toAdd = this.findElementsByAdd(this.shifts, this.editData.shifts);
              if(toAdd.length > 0){
                for(let shift of toAdd){
                  this.api.createSchedule(this.editData.id, shift).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
              }
            }

            /* Actualizar Curso */
            this.courseForm.value.background_image = null;
            console.log(this.courseForm.value);
            this.api.updateCourse(this.editData.id, this.courseForm.value).subscribe({
              next: (course: any) => {
                if(this.backgroundFile){
                  const logo = new FormData();
                  logo.append('background_image', this.backgroundFile as Blob);
                  this.api.updateCoursePatch(this.editData.id, logo).subscribe({
                    next: (data: any) => {
                      console.log(data);
                      this.dialogRef.close('update');
                    },
                    error: (error: any) => {
                      this.showSnackBar('Error al subir la imagen de fondo');
                      console.log(error);
                    }
                  });
                }else{
                console.log(course);
                this.dialogRef.close('update');
                }
              },
              error: (error: any) => {
                this.showSnackBar('Error al actualizar el curso');
                console.log(error);
              }
            });

          } else {
            this.courseForm.value.background_image = null; 
            this.api.createCourse(this.courseForm.value).subscribe({
              next: (course: any) => {
                console.log(course);
                /* Crando conecciones para el curso */
                if(this.backgroundFile){
                  const logo = new FormData();
                  logo.append('background_image', this.backgroundFile as Blob);
                  this.api.updateCoursePatch(course.id, logo).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      this.showSnackBar('Error al subir la imagen de fondo');
                      console.log(error);
                    }
                  });
                }
                for(let category of this.categoriesSelected){
                  this.api.createCategoryAndCourse(category.id, course.id).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
                this.api.createModalityAndCourse(this.courseForm.value.modality, course.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });
    
                this.api.createProgramTypeAndCourse(this.courseForm.value.type_of_program, course.id).subscribe({
                  next: (data: any) => {
                    console.log(data);
                  },
                  error: (error: any) => {
                    console.log(error);
                  }
                });
                /* Fin */
                /* Horarios */
                console.log(this.shifts);
                for(let shift of this.shifts){
                  console.log(shift);
                  this.api.createSchedule(course.id, shift).subscribe({
                    next: (data: any) => {
                      console.log(data);
                    },
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
                this.dialogRef.close('true');
              },
              error: (error: any) => {
                console.log(error);
                this.showSnackBar('Error al crear el curso');
              }
            });
          }
          }else{
            this.showSnackBar('Seleccione al menos una categoría');
          }
        }else{
          this.showSnackBar("La fecha de inicio debe ser menor a la fecha de fin");
        }
    }else{
      this.showSnackBar('Complete los campos requeridos');
      this.courseForm.markAllAsTouched();
    }
     
  }

}
