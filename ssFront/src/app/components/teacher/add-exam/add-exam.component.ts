import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css'
})
export class AddExamComponent {
urls: any[] = [];
  listFile:any[]=[]
  detectFiles(event:any) {
    
    let files = event.target.files;
    this.listFile.push(files)
    if (files) {
      for (let file of files) {
        const extension = getFileExtension(file.name);
        const fileType = getFileType(extension);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push({ name: file.name, type:fileType, url: e.target.result });
        }
        reader.readAsDataURL(file);
        console.log("f1,",file.name)
        console.log("fww,",this.urls)
      }
      console.log("fssss",files)
      console.log("hjklkjhgfh",this.listFile)
      
    }
  }
  

}
