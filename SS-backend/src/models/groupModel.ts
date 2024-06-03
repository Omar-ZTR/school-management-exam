import { Table, Model, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { Subject } from "./subjectModel";
import { GroupSubject } from "./groupSubjectModel";


@Table({
    timestamps: true,
    tableName: "Group",
})
export class Group extends Model<Group> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      })
      group__id!: number;

      @Column(DataType.INTEGER)
      Rank!: Number;

      @Column(DataType.STRING)
      group__name!: string;

      @Column(DataType.STRING)
      subject!: string;
  
      @BelongsToMany(() => Subject, () => GroupSubject)
      subjects!: Subject[];



}