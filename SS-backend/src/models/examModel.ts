import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Question } from "./questionModel";
import {  FileExam } from "./fileModel";
import { Reservation } from "./reservationModel";


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

  @HasMany(() => Question)
  questions!: Question[];

  @HasMany(() => Reservation)
  reservation!: Reservation[];

  @HasMany(() => FileExam)
  file!: FileExam[];
}
