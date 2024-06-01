import { Table, Model, Column, DataType } from "sequelize-typescript";


@Table({
    timestamps: true,
    tableName: "Rank",
})
export class Rank extends Model<Rank> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      rank__id!: number;

      @Column(DataType.INTEGER)
      Rank!: Number;

      @Column(DataType.STRING)
      rank__name!: string;

   



}