import { Table, Model, Column, ForeignKey, DataType, BelongsTo } from "sequelize-typescript";
import { Exam } from "./examModel";

import { Student } from "./studentModel";

@Table({
  tableName: "Subscribe",
  timestamps: false
})
export class Subscribe extends Model<Subscribe> {


    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      subscribe__id!: number;

  @BelongsTo(() => Exam)
  exams!: Exam;

  @ForeignKey(() => Exam)
  @Column
  exam__id!: number;


  @BelongsTo(() => Student)
  student!: Student;

  @ForeignKey(() => Student)
  @Column
  user__id!: number;


  @Column(DataType.BOOLEAN)
  acceptation!: boolean;

}
