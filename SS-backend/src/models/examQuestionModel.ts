import { Table, Model, Column, ForeignKey } from "sequelize-typescript";
import { Exam } from "./examModel";
import { Question } from "./questionModel";

@Table({
  tableName: "ExamQuestion",
  timestamps: false
})
export class ExamQuestion extends Model<ExamQuestion> {
  @ForeignKey(() => Exam)
  @Column
  exam__id!: number;

  @ForeignKey(() => Question)
  @Column
  question__id!: number;
}
