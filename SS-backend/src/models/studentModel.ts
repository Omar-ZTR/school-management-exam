import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { users } from "./usress/userModel";
import { Group } from "./groupModel";
import { Subscribe } from "./subscribeModel";
import { Answer } from "./answerModel";

@Table({
  tableName: "Student",
  timestamps: true
})
export class Student extends users<Student> {

  @Column({type:DataType.STRING,
    allowNull: false,}
  )
  role!: string;



  @ForeignKey(() => Group)
  @Column({type: DataType.INTEGER, allowNull: true})
  group__id?: number;

  @BelongsTo(() => Group)
  group?: Group;
  @HasMany(() => Answer)
  answers!: Subscribe[];

  @HasMany(() => Subscribe)
  subscribes!: Subscribe[];
  
}
