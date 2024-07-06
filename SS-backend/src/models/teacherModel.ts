import { Table, Model, Column, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import { users } from "./usress/userModel";
import { Exam } from "./examModel";
import { Subject } from "./subjectModel";
import { TeacherSubject } from "./teacherSubjectsModel";
import { Group } from "./groupModel";
import { TeacherGroup } from "./teacherGroupsModel";


@Table({
    tableName: "Teacher",
})
export class Teacher extends users<Teacher> {
    

  @BelongsToMany(() => Subject, () => TeacherSubject)
  subjects!: Subject[];

  @BelongsToMany(() => Group, () => TeacherGroup)
  groups!: Group[];

      @Column({type:DataType.STRING,
    allowNull: false,}
  )
    specialty!: string;

      @Column({type:DataType.STRING,
    allowNull: false,}
  )
    experience!: string;

      @Column({type:DataType.DATE,
    allowNull: false,}
  )
    date!: Date;

      @Column({type:DataType.STRING,
    allowNull: false,}
  )
    role!: string;

   @HasMany(() => Exam, {
        onDelete: 'CASCADE', // This will enable cascading delete
    })
  exam!: Exam[];


}