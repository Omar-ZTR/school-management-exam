import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { Exam } from "./examModel"; // Import the Exam model if it exists
import { Reponse } from "./reponseModel";
import { FileQuestion } from "./fileModel";

@Table({
    timestamps: true,
    tableName: "Question",
})
export class Question extends Model<Question> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    question__id!: number;

    @Column(DataType.STRING)
    question__text!: string;

    @ForeignKey(() => Exam)
    @Column
    exam__id!: number;

    // @BelongsTo(() => Exam)
    // exam!: Exam;
    @HasMany(() => FileQuestion)
    file!: FileQuestion[];
    @HasMany(() => Reponse)
    reponses!: Reponse[];

    @Column(DataType.FLOAT)  
    note!: number;

    @Column(DataType.STRING)
    question__type!: string;
}
