import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// rxjs
import { switchMap } from 'rxjs/operators';

import { TaskModel } from './../../models/task.model';
import { TaskPromiseService } from '../../services';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: TaskModel;

  constructor(
    private taskPromiseService: TaskPromiseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.task = new TaskModel();

    // it is not necessary to save subscription to route.paramMap
    // when router destroys this component, it handles subscriptions automatically
    const observer = {
      next: (task: TaskModel) => (this.task = { ...task }),
      error: (err: any) => console.log(err)
    };
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.taskPromiseService.getTask(+params.get('taskID'))
        )
      )
      .subscribe(observer);
  }

  onSaveTask() {
    const task = { ...this.task } as TaskModel;

    if (task.id) {
      this.taskPromiseService
        .updateTask(task)
        .then( () => this.onGoBack() );
    } else {
      this.taskPromiseService.createTask(task);
    }

    this.onGoBack();
  }

  onGoBack(): void {
    this.router.navigate(['/home']);
  }
}
