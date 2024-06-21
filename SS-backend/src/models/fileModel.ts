import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Exam } from "./examModel"; // Import the Exam model if it exists
import { Question } from "./questionModel";
import { Answer } from "./answerModel";

// Define a base class for common file attributes
@Table({
    timestamps: true,
    tableName: "File",
})
class File extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    file__id!: number;

    @Column(DataType.STRING)
    file__name!: string;

    @Column(DataType.STRING)
    file__path!: string;

    @Column(DataType.STRING)
    file__type!: string;
}

@Table({
    timestamps: true,
    tableName: "FileExam",
})
export class FileExam extends File {
    @ForeignKey(() => Exam)
    @Column
    exam__id!: number;

    @BelongsTo(() => Exam)
    exam!: Exam;
}

@Table({
    timestamps: true,
    tableName: "FileQuestion",
})
export class FileQuestion extends File {
    @ForeignKey(() => Question)
    @Column
    question__id!: number;

    @BelongsTo(() => Question)
    question!: Question;
}


@Table({
    timestamps: true,
    tableName: "FileAnswer",
})
export class FileAnswer extends File {
    @ForeignKey(() => Answer)
    @Column
    ans__id!: number;

    @BelongsTo(() => Answer)
    answer!: Answer;
}
























// import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
// import { Exam } from "./examModel"; // Import the Exam model if it exists
// import { Question } from "./questionModel";


// @Table({
//     timestamps: true,
//     tableName: "FileExam",
// })
// export class FileExam extends Model {

//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     })
//     file__id!: number;

//     @ForeignKey(() => Exam)
//     @Column
//     exam__id!: number;

//     @BelongsTo(() => Exam)
//     exam!: Exam;
    
//     @Column(DataType.STRING)
//     file__name!: string;

//     @Column(DataType.STRING)
//     file__path!: string;

//     @Column(DataType.STRING)
//     file__type!: string;

//     // Assuming you have an Exam model defined


   
// }
// @Table({
//     timestamps: true,
//     tableName: "FileQuestion",
// })
// export class FileQuestion extends Model {

//     @Column({
//         type: DataType.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     })
//     file__id!: number;

//     @ForeignKey(() => Question)
//     @Column
//     question__id!: number;

//     @BelongsTo(() => Question)
//     question!: Question;
    
//     @Column(DataType.STRING)
//     file__name!: string;

//     @Column(DataType.STRING)
//     file__path!: string;

//     @Column(DataType.STRING)
//     file__type!: string;

//     // Assuming you have an Exam model defined


   
// }