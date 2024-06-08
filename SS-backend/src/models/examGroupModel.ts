import { Table, Model, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Exam } from './examModel';
import { Group } from './groupModel';

@Table({
    tableName: 'ExamGroup',
    timestamps: false,
})
export class ExamGroup extends Model<ExamGroup> {
    @ForeignKey(() => Exam)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    examId!: number;

    @ForeignKey(() => Group)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    groupId!: number;
}