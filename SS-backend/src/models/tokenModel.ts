import { Table, Model, Column, DataType } from "sequelize-typescript";


@Table({
    timestamps: true,
    tableName: "Token",
})
export class Token extends Model<Token> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      token__id!: number;

      @Column(DataType.INTEGER)
      user__id!: Number;

      @Column(DataType.STRING)
      token!: string;



}