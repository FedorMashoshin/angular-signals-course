import { Component, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../models/course.model";
import { EditCourseDialogData } from "./edit-course-dialog.data.model";
import { CoursesService } from "../services/courses.service";
import { LoadingIndicatorComponent } from "../loading/loading.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from "../course-category-combobox/course-category-combobox.component";
import { CourseCategory } from "../models/course-category.model";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  coursesService = inject(CoursesService);

  constructor() {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      category: this.data?.course?.category,
      iconUrl: this.data?.course?.iconUrl,
    });

  }

  onCancel() {
    this.dialogRef.close();
  }

  async onSave() {
    const course = this.form.value as Partial<Course>;
    if (this.data.mode === 'update') {
      this.saveCourse(this.data?.course!.id, course);
    }
  }

  async saveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const course = await this.coursesService.saveCourse(courseId, changes);
      this.dialogRef.close(course);
    } catch (error) {
      console.error('Error updating course', error);
      throw error;
    }
  }
}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const course$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(course$);
}
