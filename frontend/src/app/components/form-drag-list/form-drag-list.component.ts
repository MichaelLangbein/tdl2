import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-form-drag-list',
  templateUrl: './form-drag-list.component.html',
  styleUrls: ['./form-drag-list.component.css']
})
export class FormDragListComponent {

  public files: NgxFileDropEntry[] = [];

  constructor(private taskSvc: TaskService) {}


  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.taskSvc.addFileToCurrent(file, droppedFile.relativePath);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }


}
