import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-form-drag-list',
  templateUrl: './form-drag-list.component.html',
  styleUrls: ['./form-drag-list.component.css']
})
export class FormDragListComponent {

  public files: any[] = [];

  constructor(private taskSvc: TaskService) {}

  public async openFileSelector() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
    // @ts-ignore
    const fileHandles = await window.showOpenFilePicker();
    this.upload(fileHandles);
    this.files = fileHandles;
  }


  private async upload(fileHandles: FileSystemFileHandle[]) {
    for (const fileHandle of fileHandles) {
      // Is it a file?
      if (fileHandle.kind === "file") {
        const file = await fileHandle.getFile();
        // Here you can access the real file
        this.taskSvc.addFileToCurrent(file, file.name);
      }
    }
  }


}
