// const moment = require("moment");
// const Entrance = require("../models/Entrance");
// const Exit = require("../models/Exit");
// const formatCurrency = require("../lib/formatCurrency");

// class EntranceAndExitController {
//   async index(req, res) {
//     let items = {
//       entrances: [],
//       exits: [],
//       totalEntrance: 0,
//       totalExit: 0,
//       balance: 0,
//     };

//     const filtersEntrance = {};
//     const filtersExit = {};

//     const { startDate, finalDate } = req.body;

//     let dateFilter = false;

//     if (startDate || finalDate) {
//       dateFilter = true;

//       filtersEntrance.createdAt = {};
//       filtersExit.date = {};

//       const startDate = moment(req.body.startDate).format(
//         "YYYY-MM-DDT00:mm:ss.SSSZ"
//       );

//       const finalDate = moment(req.body.finalDate).format(
//         "YYYY-MM-DDT23:59:ss.SSSZ"
//       );

//       filtersEntrance.createdAt.$gte = startDate;
//       filtersEntrance.createdAt.$lte = finalDate;

//       filtersExit.date.$gte = startDate;
//       filtersExit.date.$lte = finalDate;
//     }

//     let entrances = await Entrance.paginate(filtersEntrance, {
//       page: req.query.page || 1,
//       limit: parseInt(req.query.limit_page) || 2000,
//       sort: "-createdAt",
//     });

//     let exits = await Exit.paginate(filtersExit, {
//       page: req.query.page || 1,
//       limit: parseInt(req.query.limit_page) || 2000,
//       sort: "-date",
//     });

//     if (!startDate || !finalDate) {
//       entrances = entrances.docs.map((entrance) => {
//         if (moment(entrance.createdAt).month() === moment(Date.now()).month()) {
//           return entrance;
//         }
//       });

//       exits = exits.docs.map((exit) => {
//         if (moment(exit.date).month() === moment(Date.now()).month()) {
//           return exit;
//         }
//       });
//     }

//     if (!startDate || !finalDate) {
//       entrances.map((entrance) => {
//         if (entrance) {
//           items.entrances.push(entrance);
//           items.totalEntrance += entrance.value;
//         }
//       });

//       exits.map((exit) => {
//         if (exit) {
//           items.exits.push(exit);
//           items.totalExit += exit.value;
//         }
//       });
//     } else {
//       entrances.docs.map((entrance) => {
//         if (entrance) {
//           items.entrances.push(entrance);
//           items.totalEntrance += entrance.value;
//         }
//       });

//       exits.docs.map((exit) => {
//         if (exit) {
//           items.exits.push(exit);
//           items.totalExit += exit.value;
//         }
//       });
//     }

//     items.balance = items.totalEntrance - items.totalExit;

//     return res.render("entranceandexitdatails/list", {
//       totalEntrance: formatCurrency.brl(items.totalEntrance),
//       totalExit: formatCurrency.brl(items.totalExit),
//       balance: formatCurrency.brl(items.balance),
//       dateFilter: dateFilter,
//       startDate,
//       finalDate,
//     });
//   }
// }

// module.exports = new EntranceAndExitController();



const moment = require("moment");
const Entrance = require("../models/Entrance");
const Exit = require("../models/Exit");
const formatCurrency = require("../lib/formatCurrency");

const { Op } = require('sequelize');


class EntranceAndExitController {


  async index(req, res) {
    let items = {
      entrances: [],
      exits: [],
      totalEntrance: 0,
      totalExit: 0,
      balance: 0,
    };

    const { startDate, finalDate, searchValue } = req.body;
    const filtersEntrance = {};
    const filtersExit = {};
    let dateFilter = false;

    if (startDate && finalDate) {
      dateFilter = true;

      // Ajuste para incluir o intervalo completo do dia
      filtersEntrance.createdAt = {
        [Op.between]: [
          moment(startDate).startOf('day').toDate(),  // Início do dia
          moment(finalDate).endOf('day').toDate(),    // Fim do dia
        ],
      };

      filtersExit.date = {
        [Op.between]: [
          moment(startDate).startOf('day').toDate(),
          moment(finalDate).endOf('day').toDate(),
        ],
      };

      if (searchValue) {
        filtersEntrance.description = {
          [Op.iLike]: `%${searchValue}%`,
        };

        filtersExit.descriptionExit = {
          [Op.iLike]: `%${searchValue}%`,
        };
      }
    }


    try {
      const entrances = await Entrance.findAll({
        where: filtersEntrance,
        order: [['createdAt', 'DESC']],
      });

      const exits = await Exit.findAll({
        where: filtersExit,
        order: [['date', 'DESC']],
      });

      entrances.forEach((entrance) => {
        items.entrances.push(entrance);
        items.totalEntrance += entrance.value;
      });

      exits.forEach((exit) => {
        items.exits.push(exit);
        items.totalExit += exit.value;
      });

      items.balance = items.totalEntrance - items.totalExit;

      return res.render("entranceandexitdatails/list", {
        totalEntrance: formatCurrency.brl(items.totalEntrance),
        totalExit: formatCurrency.brl(items.totalExit),
        balance: formatCurrency.brl(items.balance),
        dateFilter: dateFilter,
        startDate,
        finalDate,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).send("Internal Server Error");
    }
  }


}

module.exports = new EntranceAndExitController();
