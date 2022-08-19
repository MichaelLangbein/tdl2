import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-form-drag-list',
  templateUrl: './form-drag-list.component.html',
  styleUrls: ['./form-drag-list.component.css']
})
export class FormDragListComponent implements ControlValueAccessor {

  public files: NgxFileDropEntry[] = [];

  constructor() { }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }


  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }


}
