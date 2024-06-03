import { Table, Model, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { Group } from "./groupModel";
import { GroupSubject } from "./groupSubjectModel";


@Table({
    timestamps: true,
    tableName: "Subject",
})
export class Subject extends Model<Subject> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      subject__id!: number;

      @Column(DataType.INTEGER)
      min__Rank!: Number;

      @Column(DataType.STRING)
      subject__name!: string;

      @BelongsToMany(() => Group, () => GroupSubject)
      groups!: Group[];



}