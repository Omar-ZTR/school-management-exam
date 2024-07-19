import { Table, Model, Column, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import { users } from "./usress/userModel";
import { Exam } from "./examModel";
import { Subject } from "./subjectModel";
import { TeacherSubject } from "./teacherSubjectsModel";
import { Group } from "./groupModel";
import { TeacherGroup } from "./teacherGroupsModel";
import { Question } from "./questionModel";


@Table({
    tableName: "Teacher",
})
export class Teacher extends users<Teacher> {
    

  @BelongsToMany(() => Subject, () => TeacherSubject)
  subjects!: Subject[];

  @BelongsToMany(() => Group, () => TeacherGroup)
  groups!: Group[];

      @Column({type:DataType.STRING,
    allowNull: true,}
  )
    specialty!: string;




      @Column({type:DataType.STRING,
    allowNull: false,}
  )
    role!: string;

   @HasMany(() => Exam, {
        onDelete: 'CASCADE', // This will enable cascading delete
    })
  exam!: Exam[];

  @HasMany(() => Question)
  questions!: Question[];
}