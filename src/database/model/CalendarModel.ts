import { Sequelize, DataTypes, Model } from 'sequelize'

class CalendarModel extends Model {
  static define(db: Sequelize) {
    CalendarModel.init(
      {
        filename: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        source_link: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        requestCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: db,
        modelName: 'Calendar',
      }
    )
  }

  static Create(filename: string, path: string, source_link: string) {
    return CalendarModel.create({
      filename,
      path,
      source_link,
      requestCount: 0,
    })
  }
}

export default CalendarModel
