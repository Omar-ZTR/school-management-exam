import { Table, Model, Column, DataType, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { Exam } from "./examModel";
import { Reponse } from "./reponseModel";
import { FileQuestion } from "./fileModel";
import { ExamQuestion } from "./examQuestionModel";
import { Teacher } from "./teacherModel";

@Table({
  timestamps: true,
  tableName: "Question",
})
export class Question extends Model<Question> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  question__id!: number;

  @Column(DataType.STRING)
  question__text!: string;

  @Column(DataType.FLOAT)
  note!: number;

  @Column(DataType.STRING)
  question__type!: string;

  @Column(DataType.STRING)
  question__subject!: string;

  @BelongsToMany(() => Exam, () => ExamQuestion)
  exams!: Exam[];

  @HasMany(() => FileQuestion)
  file!: FileQuestion[];

  @HasMany(() => Reponse)
  reponses!: Reponse[];

  @Column(DataType.INTEGER)
question__result!: number;


@ForeignKey(() => Teacher)
@Column
user__id!: number;

}










// import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
// import { Exam } from "./examModel"; // Import the Exam model if it exists
// import { Reponse } from "./reponseModel";
// import { FileQuestion } from "./fileModel";

// @Table({
//     timestamps: true,
//     tableName: "Question",
// })
// export class Question extends Model<Question> {

//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     })
//     question__id!: number;

//     @Column(DataType.STRING)
//     question__text!: string;

//     @ForeignKey(() => Exam)
//     @Column({
//         type: DataType.INTEGER,
//         allowNull: true, // Make this column optional
//     })
//     exam__id!: number | null;
  
//     @HasMany(() => FileQuestion)
//     file!: FileQuestion[];
    
//     @HasMany(() => Reponse)
//     reponses!: Reponse[];

//     @Column(DataType.FLOAT)  
//     note!: number;

//     @Column(DataType.STRING)
//     question__type!: string;

//     @Column(DataType.STRING)
//     question__subject!: string;
// }
