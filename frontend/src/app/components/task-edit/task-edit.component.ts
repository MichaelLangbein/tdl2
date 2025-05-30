import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, Observable, BehaviorSubject } from 'rxjs';
import { secondsToTimestring } from 'src/app/pipes/seconds-to-timestring.pipe';
import { EstimateService } from 'src/app/services/estimate.service';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.css'],
})
export class TaskEditComponent implements OnInit {

    showDeleteModal = false;
    currentTask$ = new BehaviorSubject<TaskTree | null>(null);
    form: FormGroup;
    estimate: any = undefined;

    constructor(private taskSvc: TaskService, private estimateSvc: EstimateService) {
        this.form = new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            deadline: new FormControl(),
        });

        this.taskSvc.watchCurrentTask().subscribe(this.currentTask$);

        this.currentTask$.subscribe((task) => {
            if (task) {
                this.form.setValue(
                    {
                        title: task.title,
                        description: task.description,
                        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : null,
                    },
                    {
                        // prevents looping between `currentTask$` and `valueChanges`
                        emitEvent: false,
                    }
                );

                this.estimate = this.estimateSvc.estimateCached(task.id);
            }
        });

        this.form.valueChanges
            .pipe(
                debounceTime(1000),
                distinctUntilChanged((prev, cur) => shallowEqual(prev, cur))
            )
            .subscribe(({ title, description, deadline }) => {
                this.taskSvc.editCurrent(title, description, deadline ? new Date(deadline).getTime() : null);
            });
    }

    ngOnInit(): void {}

    addChildTask() {
        this.taskSvc.addChildToCurrent('untitled', '');
    }

    addSiblingTask() {
        this.taskSvc.addSiblingToCurrent('untitled', '');
    }

    estimateTime() {
        const currentTask = this.currentTask$.value;
        if (currentTask === null) return;
        this.estimateSvc.estimateLive(currentTask.id).subscribe((r: any) => {
            const d = new Date();
            const newText = `
        Latest estimate: ${d.toISOString()} ${d.toLocaleTimeString()}
            buvs: ${secondsToTimestring(r['buvs'])}
            tdvs: ${secondsToTimestring(r['tdvs'])}
            estimated percentage: ${Math.round(
                (100 * this.recursiveTimeActive(currentTask)) / ((r['buvs'] + r['tdvs']) / 2)
            )}%
      `;
            this.appendToDescription(newText);
            this.estimate = r;
        });
    }

    completeTask() {
        this.taskSvc.completeCurrent();
    }

    reactivateTask() {
        this.taskSvc.reactivateCurrent();
    }

    template() {
        const textToAppend = `

    1.  Understand the problem
        * What are you asked to find or show?
        * Can you restate the problem in your own words?
        * Can you think of a picture or a diagram that might help you understand the problem?
        * Is there enough information to enable you to find a solution?
        * Do you understand all the words used in stating the problem?
        * Do you need to ask a question to get the answer?
    2.  Make a plan
        * Guess and check
        * Make an orderly list
        * Eliminate possibilities
        * Use symmetry
        * Consider special cases
        * Use direct reasoning
        * Solve an equation
        * Look for a pattern
        * Draw a picture
        * Solve a simpler problem
        * Use a model
        * Work backward
        * Use a formula
        * Be creative
        * Use your head/noggin
    3.  Carry out the plan.
    4. If you can't solve a problem, then there is an easier problem you can solve: find it.
    5.  Look back on your work. How could it be better?
          `;
        this.appendToDescription(textToAppend);
    }

    deleteTask() {
        this.taskSvc.deleteCurrent();
        this.showDeleteModal = false;
    }

    removeAttachment(attachmentId: number) {
        this.taskSvc.removeAttachmentFromCurrent(attachmentId);
    }

    getAttachment(attachmentId: number) {
        console.log("getting attachment", attachmentId);
        this.taskSvc.downloadAttachmentFromCurrentTask(attachmentId);
    }

    private appendToDescription(textToAppend: string) {
        const currentValue = this.form.value;
        this.form.setValue({
            ...currentValue,
            description: (currentValue.description += textToAppend),
        });
    }

    recursiveTimeActive(tt: TaskTree): number {
        let sum = tt.secondsActive;
        for (const child of tt.children) {
            sum += this.recursiveTimeActive(child);
        }
        return sum;
    }
}

function shallowEqual(o1: any, o2: any) {
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    const union: string[] = [];
    for (const key of keys1) {
        if (!union.includes(key)) union.push(key);
    }
    for (const key of keys2) {
        if (!union.includes(key)) union.push(key);
    }
    if (union.length !== keys1.length) return false;
    if (union.length !== keys2.length) return false;

    for (const key of keys1) {
        if (o1[key] !== o2[key]) return false;
    }
    return true;
}
