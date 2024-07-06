import { Table, Model, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import { Subject } from "./subjectModel";
import { GroupSubject } from "./groupSubjectModel";
import { Student } from "./studentModel";
import { ExamGroup } from "./examGroupModel";
import { Exam } from "./examModel";
import { Teacher } from "./teacherModel";
import { TeacherGroup } from "./teacherGroupsModel";


@Table({
    timestamps: true,
    tableName: "Group",
})
export class Group extends Model<Group> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      group__id!: number;

      @Column(DataType.INTEGER)
      Rank!: Number;

      @Column(DataType.STRING)
      group__name!: string;

      @Column(DataType.STRING)
      subject!: string;
  
      @BelongsToMany(() => Subject, () => GroupSubject)
      subjects!: Subject[];

      @HasMany(() => Student)
      students!: Student[];

      @BelongsToMany(() => Teacher, () => TeacherGroup)
      teachers!: Teacher[];


      @BelongsToMany(() => Exam, () => ExamGroup)
      exams!: Exam[];

}