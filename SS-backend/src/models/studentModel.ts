import { Table, Model, Column, DataType } from "sequelize-typescript";
import { users } from "./usress/userModel";

@Table({
  tableName: "Student",
})
export class Student extends users<Student> {

  @Column({type:DataType.STRING,
    allowNull: false,}
  )
  role!: string;

   @Column({type:DataType.STRING,
    allowNull: false,}
  )
  diploma!: string;

   @Column({type:DataType.STRING,
    allowNull: false,}
  )
  Locations!: string;

  @Column({type:DataType.DATE,
    allowNull: false,}
  )
  date__diploma!: Date;

  
}
