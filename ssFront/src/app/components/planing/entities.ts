// <div
// *ngIf="
//   examForm.get('exam__type')?.value === 'QCM' ||
//   examForm.get('exam__type')?.value === 'Normal'
// "
// class="quistionForm box"
// >
// <!-- <div class="ADD" (click)="addQuestion()">ADD Question</div> -->
// <!-- Your question and answer form here -->
// <div [formGroup]="questionsForm">
//   <legend>Question</legend>
//   <!-- Text -->
//   <div class="inputs bordercorner">
//     <div class="Row">
//       <div>
//         <div class="noteDiv">
//           <label for="number">Note :</label>

//           <input
//             type="number"
//             id="number"
//             formControlName="note"
//             min="1"
//             max="5"
//           />
//         </div>
//       </div>
//       <div class="Row radio-group">
//         <input
//           type="radio"
//           id="QCM_Q"
//           name="question__type"
//           formControlName="question__type"
//           value="QCM"
//         />
//         <label for="QCM_Q">QCM</label>
//         <input
//           type="radio"
//           id="NormalQ"
//           name="question__type"
//           formControlName="question__type"
//           value="Normal"
//           checked="true"
//         />
//         <label for="NormalQ">Normal</label>
//         <input
//           type="radio"
//           id="Problem_Q"
//           name="question__type"
//           formControlName="question__type"
//           value="Problem"
//         />
//         <label for="Problem_Q">Problem</label>
//       </div>
//     </div>
//     <div class="Row">
//       <div
//         *ngIf="
//           questionsForm.get('note')?.invalid &&
//           (questionsForm.get('note')?.dirty ||
//             questionsForm.get('note')?.touched)
//         "
//         style="margin-left: 0"
//       >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['note'].errors?.['required']"
//           >This field is mandatory.</span
//         >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['note'].errors?.['msg']"
//           >Note must be in
//           {{ questionsForm.controls['note'].errors?.['msg'] }}.</span
//         >
//       </div>
//       <div
//         *ngIf="
//           questionsForm.get('question__type')?.invalid &&
//           (questionsForm.get('question__type')?.dirty ||
//             questionsForm.get('question__type')?.touched)
//         "
//       >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['question__type'].errors?.['required']"
//           >This field is mandatory.</span
//         >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['question__type'].errors?.['pattern']"
//           >This field is invalid.</span
//         >
//       </div>
//     </div>
//     <div>
//       <label for="text">Question</label>
//       <textarea id="text" formControlName="question__text"></textarea>
//       <div
//         *ngIf="
//           questionsForm.get('question__text')?.invalid &&
//           (questionsForm.get('question__text')?.dirty ||
//             questionsForm.get('question__text')?.touched)
//         "
//       >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['question__text'].errors?.['required']"
//           >This field is mandatory.</span
//         >
//         <span
//           class="error"
//           *ngIf="questionsForm.controls['question__text'].errors?.['pattern']"
//           >This field is invalid.</span
//         >
//       </div>
//       <div class="supportQuestion">
//         <div class="custome-file" Style="margin-top: 10px">
//           <span>
//             <img
//               src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDY0IDY0IiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGlkPSJDbGlwIj48cGF0aCBkPSJtMTIuMDggNTcuNzQ5YTkgOSAwIDAgMCAxMi43MjggMGwzMS4xMTItMzEuMTEzYTEzIDEzIDAgMSAwIC0xOC4zODQtMTguMzg1bC0yMC41MDcgMjAuNTA2IDEuNDE1IDEuNDE1IDIwLjUwNi0yMC41MDZhMTEgMTEgMCAxIDEgMTUuNTU2IDE1LjU1NmwtMzEuMTEyIDMxLjExMmE3IDcgMCAwIDEgLTkuOS05LjlsMjYuODctMjYuODdhMyAzIDAgMCAxIDQuMjQyIDQuMjQzbC0xNi4yNjMgMTYuMjY0IDEuNDE0IDEuNDE0IDE2LjI2NC0xNi4yNjNhNSA1IDAgMCAwIC03LjA3MS03LjA3MWwtMjYuODcgMjYuODdhOSA5IDAgMCAwIDAgMTIuNzI4eiIvPjwvZz48L3N2Zz4="
//               alt=""
//             />Attach File
//           </span>
//           <input
//             type="file"
//             accept=".doc, .docx, .pdf, .txt, .rtf, .md, .jpg, .jpeg, .png, .ppt, .pptx, .xls, .xlsx, .zip, .rar"
//             multiple
//             (change)="QuestionFiles($event)"
//           />
          
//         </div>
        
//         <div class="QuestFileView" *ngFor="let file of fileQuest; let i = index">
           
//               <div  [matTooltip]="file.name">
//                 <div class="removeFile" style="
//                 right: 0px; top: -15px; box-shadow: none;" (click)="removeFile(i)">
//                   <i class="fa-solid fa-xmark fa-xl"></i>
//                 </div>
               

//                 <div class="fileTitle">{{ file.name }}</div>
//               </div>
            
//           </div>
       
//       </div> <div class="button-34" (click)="addAnswer()" style="max-height:50px ;">
//           <i class="fa-solid fa-plus" style="color: #ff8b43 ;"></i>Answer
//         </div>
//     </div>

//     <!-- answerQuiz -->

//     <div
//       *ngIf="questionsForm.get('question__type')?.value !== ''"
//       class="repQuiz"
//     >
//       <div formArrayName="reponses">
//         <div
//           *ngFor="
//             let answer of $any(questionsForm.get('reponses'))
//               .controls;
//             let j = index
//           "
//           formGroupName="{{ j }}"
//         >
//           <div class="answer-container">
//             <div class="rmAns" (click)="removeAnswer(j)">
//               <i
//                 class="fa-solid fa-eraser fa-lg"
//                 style="color: #d50707; margin-top: 20px"
//               ></i>
//             </div>
//             <div class="answer">
//               <label for="text">Answer</label>
//               <textarea
//                 id="text"
//                 formControlName="reponse__text"
//               ></textarea>
//             </div>
//             <label class="label">
//               <input
//                 class="label__checkbox"
//                 type="checkbox"
//                 formControlName="reponse__statut"
//               />
//               <span class="label__text">
//                 <span class="label__check">
//                   <i class="fa fa-check icon"></i>
//                 </span>
//               </span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
 
//     <span class="border_btm"></span>
//   </div>
//   <div class="button-34"  (click)="addQuestionAndReset()">
//     <i class="fa-solid fa-list-check" style="color: #ff8b43 ;"> </i> Add to the list
//   </div>
// </div>
// </div>


// "@progress/kendo-angular-buttons": "^16.0.0",
// "@progress/kendo-angular-common": "^16.0.0",
// "@progress/kendo-angular-dateinputs": "^16.0.0",
// "@progress/kendo-angular-dialog": "^16.0.0",
// "@progress/kendo-angular-dropdowns": "^16.0.0",
// "@progress/kendo-angular-icons": "^16.0.0",
// "@progress/kendo-angular-inputs": "^16.0.0",
// "@progress/kendo-angular-intl": "^16.0.0",
// "@progress/kendo-angular-l10n": "^16.0.0",
// "@progress/kendo-angular-label": "^16.0.0",
// "@progress/kendo-angular-popup": "^16.0.0",
// "@progress/kendo-angular-scheduler": "^16.0.0",
// "@progress/kendo-angular-tooltip": "^16.0.0",
// "@progress/kendo-data-query": "^1.7.0",
// "@progress/kendo-date-math": "^1.5.13",
// "@progress/kendo-drawing": "^1.20.1",
// "@progress/kendo-licensing": "^1.3.5",
// "@progress/kendo-recurrence": "^1.0.3",
// "@progress/kendo-theme-default": "^8.0.1",