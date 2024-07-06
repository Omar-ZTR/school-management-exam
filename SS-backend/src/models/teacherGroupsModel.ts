import { Table, Model, Column, ForeignKey } from "sequelize-typescript";

import { Teacher } from "./teacherModel";
import { Subject } from "./subjectModel";
import { Group } from "./groupModel";

@Table({
  tableName: "TeacherGroup",
  timestamps: false
})
export class TeacherGroup extends Model<TeacherGroup> {
  @ForeignKey(() => Teacher)
  @Column
  user__id!: number;

  @ForeignKey(() => Group)
  @Column
  group__id!: number;
}
