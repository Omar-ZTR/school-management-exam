import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { users } from "./usress/userModel";
import { Exam } from "./examModel";


@Table({
    tableName: "Teacher",
})
export class Teacher extends users<Teacher> {
    
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

    @HasMany(() => Exam)
  exam!: Exam[];


}