// // const moment = require("moment");
// // const Entrance = require("../models/Entrance");
// // const formatCurrency = require("../lib/formatCurrency");

// // class EntranceController {
// //   async index(req, res) {
// //     const filters = {};

// //     let total = 0;

// //     const { startDate, finalDate } = req.body;

// //     if (startDate || finalDate) {
// //       filters.createdAt = {};

// //       const startDate = moment(req.body.startDate).format(
// //         "YYYY-MM-DDT00:mm:ss.SSSZ"
// //       );

// //       const finalDate = moment(req.body.finalDate).format(
// //         "YYYY-MM-DDT23:59:ss.SSSZ"
// //       );

// //       filters.createdAt.$gte = startDate;
// //       filters.createdAt.$lte = finalDate;
// //     }

// //     let entrances = await Entrance.paginate(filters, {
// //       page: req.query.page || 1,
// //       limit: parseInt(req.query.limit_page) || 2000,
// //       populate: ["sale"],
// //       sort: "-createdAt",
// //     });

// //     const getEntrancePromise = entrances.docs.map(async (entrance) => {
// //       entrance.formattedDate = moment(entrance.createdAt).format("DD-MM-YYYY");
// //       entrance.formattedValue = formatCurrency.brl(entrance.value);
// //       return entrance;
// //     });

// //     entrances = await Promise.all(getEntrancePromise);

// //     let dateFilter = false;

// //     if (startDate || finalDate) {
// //       dateFilter = true;
// //       entrances.map((entrance) => {
// //         total += entrance.value;
// //       });
// //     }

// //     if (!startDate || !finalDate) {
// //       entrances = entrances.map((entrance) => {
// //         if (moment(entrance.createdAt).month() === moment(Date.now()).month()) {
// //           total += entrance.value;
// //           return entrance;
// //         }
// //       });
// //     }

// //     let entrancesFilter = [];

// //     entrances.map((sale) => {
// //       if (sale != undefined) entrancesFilter.push(sale);
// //     });

// //     return res.render("entrance/list", {
// //       entrances: entrancesFilter,
// //       total: formatCurrency.brl(total),
// //       dateFilter: dateFilter,
// //       startDate,
// //       finalDate,
// //     });
// //   }
// // }

// // module.exports = new EntranceController();



// //CODIGO ORIGINAL
// const moment = require("moment");
// const { Op } = require("sequelize");
// const Entrance = require("../models/Entrance");
// const formatCurrency = require("../lib/formatCurrency");

// class EntranceController {
//   async index(req, res) {
//     const filters = {};
//     let total = 0;

//     const { startDate, finalDate } = req.body;

//     if (startDate || finalDate) {
//       filters.createdAt = {
//         [Op.between]: [
//           moment(startDate).startOf("day").toDate(),
//           moment(finalDate).endOf("day").toDate(),
//         ],
//       };
//     }

//     try {
//       let offset = 0;

//       if (req.query.page && req.query.limit_page) {
//         const page = parseInt(req.query.page);
//         const limitPage = parseInt(req.query.limit_page) || 2000;

//         if (!isNaN(page) && !isNaN(limitPage)) {
//           offset = (page - 1) * limitPage;
//         }
//       }

//       let entrances = await Entrance.findAll({
//         where: filters,
//         order: [['createdAt', 'DESC']],
//         limit: parseInt(req.query.limit_page) || 2000,
//         offset: offset,
//       });

//       entrances = entrances.map((entrance) => {
//         entrance.formattedDate = moment(entrance.createdAt).format("DD/MM/YYYY");
//         entrance.formattedValue = formatCurrency.brl(entrance.value);
//         total += entrance.value;
//         return entrance;
//       });

//       return res.render("entrance/list", {
//         entrances: entrances,
//         total: formatCurrency.brl(total),
//         dateFilter: startDate || finalDate,
//         startDate,
//         finalDate,
//       });
//     } catch (error) {
//       console.error("Error fetching entrance data:", error);
//       return res.status(500).send("Internal Server Error");
//     }
//   }
// }

// module.exports = new EntranceController();


const moment = require("moment");
const { Op } = require("sequelize");
const Entrance = require("../models/Entrance");
const formatCurrency = require("../lib/formatCurrency");

class EntranceController {
  async index(req, res) {
    const filters = {};
    let total = 0;

    //const { startDate, finalDate } = req.body;

    const { startDate, finalDate } = { ...req.body, ...req.query };

    if (startDate || finalDate) {
      filters.createdAt = {
        [Op.between]: [
          moment(startDate).startOf("day").toDate(),
          moment(finalDate).endOf("day").toDate(),
        ],
      };
    }

    try {
      let offset = 0;
      const page = req.query.page || 1;
      const perPage = 12; // ajuste conforme necessário

      if (page > 1) {
        offset = (page - 1) * perPage;
      }

      let entrances = await Entrance.findAll({
        where: filters,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: offset,
      });

      entrances = entrances.map((entrance) => {
        entrance.formattedDate = moment(entrance.createdAt).format("DD/MM/YYYY");
        entrance.formattedValue = formatCurrency.brl(entrance.value);
        total += entrance.value;
        return entrance;
      });

      const totalEntrances = await Entrance.count({ where: filters });
      const totalPages = Math.ceil(totalEntrances / perPage);
      const currentPage = parseInt(page);

      return res.render("entrance/list", {
        entrances: entrances,
        total: formatCurrency.brl(total),
        dateFilter: startDate || finalDate,
        startDate,
        finalDate,
        totalPages,
        currentPage,
      });
    } catch (error) {
      console.error("Error fetching entrance data:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new EntranceController();
