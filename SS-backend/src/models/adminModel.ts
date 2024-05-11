import { Table, Model, Column, DataType } from "sequelize-typescript";
import { users } from "./usress/userModel";


@Table({
    tableName: "Admin",
})
export class Admin extends users<Admin> {
    
    @Column({type:DataType.STRING,
        allowNull: false,}
      )
    role!: string;


}