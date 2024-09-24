import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CoursesService } from "../services/courses.service";
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../messages/messages.service";
import { catchError, from, throwError } from "rxjs";
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  beginnerCourses = computed(() => this.#courses().filter(course => course.category === 'BEGINNER'));
  advancedCourses = computed(() => this.#courses().filter(course => course.category === 'ADVANCED'));

  coursesService = inject(CoursesService);

  constructor() {
    effect(() => {
      console.log('beginnerCourses', this.beginnerCourses());
      console.log('advancedCourses', this.advancedCourses());
    });

    this.loadCourses();
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses);
    } catch (error) {
      console.error(error);
    }
  }

  onCourseUpdated(course: Course) {
    const courses = this.#courses();
    const newCourses = courses.map(c => c.id === course.id ? course : c);
    this.#courses.set(newCourses);
  }
}
