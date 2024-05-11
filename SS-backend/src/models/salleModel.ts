import { Table, Model, Column, DataType } from "sequelize-typescript";


@Table({
    timestamps: true,
    tableName: "Salle",
})
export class Salle extends Model<Salle> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      salle__id!: number;

      @Column(DataType.INTEGER)
      nb__place!: Number;

      @Column(DataType.STRING)
      salle__name!: string;



}