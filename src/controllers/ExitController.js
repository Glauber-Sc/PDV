const moment = require("moment");
const Exit = require("../models/Exit");
const formatCurrency = require("../lib/formatCurrency");

const { Op } = require("sequelize");

class ExitController {

  async index(req, res) {
    const filters = {};
    let total = 0;

    const { startDate, finalDate } = req.body;

    if (startDate || finalDate) {
      filters.date = {
        [Op.between]: [
          moment(startDate).startOf("day").toDate(),
          moment(finalDate).endOf("day").toDate(),
        ],
      };
    }

    try {
      let offset = 0;

      if (req.query.page && req.query.limit_page) {
        const page = parseInt(req.query.page);
        const limitPage = parseInt(req.query.limit_page) || 2000;

        if (!isNaN(page) && !isNaN(limitPage)) {
          offset = (page - 1) * limitPage;
        }
      }

      let exits = await Exit.findAll({
        where: filters,
        order: [['date', 'DESC']],
        limit: parseInt(req.query.limit_page) || 2000,
        offset: offset,
      });

      exits = exits.map((exit) => {
        exit.formattedDate = moment(exit.date).format("DD/MM/YYYY");
        exit.formattedValue = formatCurrency.brl(exit.value);
        total += exit.value;
        return exit;
      });

      return res.render("exit/list", {
        exits: exits,
        total: formatCurrency.brl(total),
        dateFilter: startDate || finalDate,
        startDate,
        finalDate,
      });
    } catch (error) {
      console.error("Error fetching exit data:", error);
      return res.status(500).send("Internal Server Error");
    }
  }


  async store(req, res) {
    const { descriptionExit, value, date } = req.body;

    let total = 0;

    if (!descriptionExit || !value || !date) {
      let exits = await Exit.find().sort("-date");

      const getExitPromise = exits.map(async (exit) => {
        exit.formattedDate = moment(exit.date).format("DD/MM/YYYY");
        exit.formattedValue = formatCurrency.brl(exit.value);

        return exit;
      });

      exits = await Promise.all(getExitPromise);

      let dateFilter = false;

      exits = exits.map((exit) => {
        if (moment(exit.date).month() === moment(Date.now()).month()) {
          total += exit.value;
          return exit;
        }
      });

      let exitsFilter = [];

      exits.map((exit) => {
        if (exit != undefined) exitsFilter.push(exit);
      });

      return res.render("exit/list", {
        exits: exitsFilter,
        total: formatCurrency.brl(total),
        dateFilter: dateFilter,
        value,
        descriptionExit,
        date: moment(date).format("YYYY-MM-DD"),
        message: "Preencha os campos obrigatórios (*) para continuar!",
      });
    }

    await Exit.create({ ...req.body, date: moment(req.body.date).format() });

    return res.redirect("/exits");
  }

  async edit(req, res) {
    const { id } = req.params;

    let exit = await Exit.findByPk(id);

    exit.formattedDate = moment(exit.date).format("YYYY-MM-DD");

    return res.render("exit/update", { exit: exit });
  }


  async update(req, res) {
    const { id } = req.params;
    const { descriptionExit, value, date } = req.body;

    if (!descriptionExit || !value || !date) {
        let exit = await Exit.findByPk(id);

        exit.formattedDate = moment(exit.date).format("YYYY-MM-DD");

        return res.render("exit/update", {
            exit: exit,
            message: "Preencha os campos obrigatórios (*) para continuar!",
        });
    }

    try {
        await Exit.update(
            {
                descriptionExit,
                value,
                date: moment(date).format(),
            },
            {
                where: { id: id },
            }
        );

        return res.redirect("/exits");
    } catch (error) {
        console.error('Error in ExitController.update:', error);
        return res.status(500).send('Internal Server Error');
    }
}



  async destroy(req, res) {
    const { id } = req.params;

    try {
        await Exit.destroy({
            where: { id: id }
        });

        return res.redirect("/exits");
    } catch (error) {
        console.error('Error in ExitController.destroy:', error);
        return res.status(500).send('Internal Server Error');
    }
}

}

module.exports = new ExitController();
