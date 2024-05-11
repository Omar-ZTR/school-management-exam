import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Exam } from "./examModel"; // Import the Exam model if it exists


@Table({
    timestamps: true,
    tableName: "File",
})
export class File extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    file__id!: number;

    @ForeignKey(() => Exam)
    @Column
    exam__id!: number;

    @BelongsTo(() => Exam)
    exam!: Exam;
    
    @Column(DataType.STRING)
    file__name!: string;

    @Column(DataType.STRING)
    file__path!: string;

    @Column(DataType.STRING)
    file__type!: string;

    // Assuming you have an Exam model defined


   
}