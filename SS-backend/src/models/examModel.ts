import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Question } from "./questionModel";
import { File } from "./fileModel";


@Table({
  timestamps: true,
  tableName: "Exam",
})
export class Exam extends Model<Exam> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  exam__id!: number;

  @Column(DataType.STRING)
  exam__name!: string;

  @Column(DataType.STRING)
  exam__type!: string;

  @HasMany(() => Question)
  questions!: Question[];

  @HasMany(() => File)
  file!: File[];
}
