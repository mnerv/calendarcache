import { Model, Optional, Sequelize, DataTypes } from 'sequelize'
import { nanoid } from 'nanoid'

interface CalendarAttributes {
  id: number
  name: string
  ics_filename: string
  source_link: string
  request_count: number
}

interface CalendarCreationAttributes
  extends Optional<CalendarAttributes, 'id' | 'request_count'> {}

class CalendarModel
  extends Model<CalendarAttributes, CalendarCreationAttributes>
  implements CalendarAttributes {
  id!: number
  name!: string
  ics_filename!: string
  source_link!: string
  request_count: number

  static define(sequelize: Sequelize) {
    CalendarModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          unique: true,
        },
        ics_filename: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          unique: true,
        },
        source_link: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        request_count: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'calendar',
      }
    )
  }
}

export default CalendarModel
