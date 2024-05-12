import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { MatTooltipModule } from '@angular/material/tooltip';
import { url } from 'inspector';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, MatTooltipModule,  FormsModule ],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css',
})
export class AddExamComponent {
  selectedOption: string = '';
  urls: any[] = [];
  listFile: any[] = [];
  fakelist: any[] = [];
  async detectFiles(event: any) {
    let files = event.target.files;
this.fakelist=[]
console.log("fakelist1",this.fakelist)
    if (files) {
      for (let file of files) {
        this.listFile.push(file);
        this.fakelist.push(file);
      }
      console.log("fakelist1",this.fakelist)

      for (let file of this.fakelist) {
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);

        await this.readFileAsync(file).then((url: any) => {
          this.urls.push({ name: file.name, type: fileType, url: url });
        });
      }
    }
    console.log("urls>>>>>>>>",this.urls)
    console.log("list>>>>>>>>",this.listFile)
  }

  readFileAsync(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
  removeFile(index: number) {
    console.log('list11', this.listFile);
    this.listFile.splice(index, 1);
    this.urls.splice(index, 1);

    console.log('rm', this.listFile);
  }
}
