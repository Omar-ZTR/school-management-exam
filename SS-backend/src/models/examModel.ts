import { Table, Model, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import { Question } from "./questionModel";
import { ExamQuestion } from "./examQuestionModel";
import { FileExam } from "./fileModel";
import { Reservation } from "./reservationModel";
import { ExamGroup } from "./examGroupModel";
import { Group } from "./groupModel";

@Table({
  timestamps: true,
  tableName: "Exam",
})
export class Exam extends Model<Exam> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  exam__id!: number;

  @Column(DataType.INTEGER)
  nb__reserve!: number;

  @Column(DataType.STRING)
  subject!: string;

  @Column(DataType.STRING)
  exam__type!: string;

  @Column(DataType.BOOLEAN)
  obligatoire!: boolean;

  @BelongsToMany(() => Question, () => ExamQuestion)
  questions!: Question[];

  @HasMany(() => Reservation)
  reservation!: Reservation[];

  @HasMany(() => FileExam)
  file!: FileExam[];

  @BelongsToMany(() => Group, () => ExamGroup)
  groups!: Group[];
}







// import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
// import { Question } from "./questionModel";
// import { FileExam } from "./fileModel";
// import { Reservation } from "./reservationModel";

// @Table({
//   timestamps: true,
//   tableName: "Exam",
// })
// export class Exam extends Model<Exam> {
//   @Column({
//     type: DataType.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   })
//   exam__id!: number;

//   @Column(DataType.INTEGER)
//   nb__reserve!: number;

//   @Column(DataType.STRING)
//   subject!: string;

//   @Column(DataType.STRING)
//   exam__type!: string;

//   @Column(DataType.BOOLEAN)
//   obligatoire!: boolean;

//   @HasMany(() => Question)
//   questions!: Question[];

//   @HasMany(() => Reservation)
//   reservation!: Reservation[];

//   @HasMany(() => FileExam)
//   file!: FileExam[];
// }
