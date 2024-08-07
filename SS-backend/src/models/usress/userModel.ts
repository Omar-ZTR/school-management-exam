import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "users",
})
export class users<T extends users<T>> extends Model<T> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  user__id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first__name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last__name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
   unique: "user_email_unique_constraint"
  })
  user__email!: string;

  @Column(DataType.BOOLEAN)
  active!: boolean;


  @Column(DataType.BOOLEAN)
  emailVerifed!: boolean;


@Column(DataType.STRING,)
codeVerifey!:string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({type:DataType.STRING,
    allowNull: false,}
  )
  description!: string;


      @Column({type:DataType.DATE,
    allowNull: false,}
  )
  birthday!: Date;
  
  @Column({type:DataType.STRING,
    allowNull: true,}
  )
  CV__path!: string;


  @Column({type:DataType.STRING,
  }
  )
  img__path!: string;


}