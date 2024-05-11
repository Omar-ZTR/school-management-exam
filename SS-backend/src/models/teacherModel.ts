import { Table, Model, Column, DataType } from "sequelize-typescript";
import { users } from "./usress/userModel";


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


}