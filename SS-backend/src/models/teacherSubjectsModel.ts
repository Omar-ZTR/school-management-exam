import { Table, Model, Column, ForeignKey } from "sequelize-typescript";
import { Exam } from "./examModel";
import { Question } from "./questionModel";
import { Teacher } from "./teacherModel";
import { Subject } from "./subjectModel";

@Table({
  tableName: "TeacherSubject",
  timestamps: false
})
export class TeacherSubject extends Model<TeacherSubject> {
  @ForeignKey(() => Teacher)
  @Column
  user__id!: number;

  @ForeignKey(() => Subject)
  @Column
  subject__id!: number;
}
