import { Table, Model, Column, ForeignKey, DataType } from "sequelize-typescript";
import { Group } from "./groupModel";
import { Subject } from "./subjectModel";


@Table({
    timestamps: false,
    tableName: "GroupSubject",
})
export class GroupSubject extends Model<GroupSubject> {

    @ForeignKey(() => Group)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    group__id!: number;

    @ForeignKey(() => Subject)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    subject__id!: number;
}
