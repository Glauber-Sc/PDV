// const moment = require("moment");
// const Sale = require("../models/Sale");
// const Cart = require("../lib/cart");
// const Product = require("../models/Product");
// const Entrance = require("../models/Entrance");
// const formatCurrency = require("../lib/formatCurrency");

// class SaleController {
//   async index(req, res) {
//     const filters = {};

//     let total = 0;

//     const { startDate, finalDate } = req.body;

//     if (startDate || finalDate) {
//       filters.createdAt = {};

//       const startDate = moment(req.body.startDate).format(
//         "YYYY-MM-DDT00:mm:ss.SSSZ"
//       );

//       const finalDate = moment(req.body.finalDate).format(
//         "YYYY-MM-DDT23:59:ss.SSSZ"
//       );

//       filters.createdAt.$gte = startDate;
//       filters.createdAt.$lte = finalDate;
//     }

//     let sales = await Sale.paginate(filters, {
//       page: req.query.page || 1,
//       limit: parseInt(req.query.limit_page) || 2000,
//       populate: ["sale.products.product"],
//       sort: "-createdAt",
//     });

//     const getSalesPromise = sales.docs.map(async (sale) => {
//       sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");
//       sale.sale.products.map((product) => {
//         product.formattedPrice = formatCurrency.brl(product.price);
//       });

//       sale.sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//       if (!sale.sale.descount) {
//         sale.sale.descount = 0;
//       }

//       return sale;
//     });

//     sales = await Promise.all(getSalesPromise);

//     let dateFilter = false;

//     if (startDate || finalDate) {
//       sales.map((sale) => {
//         total += sale.sale.total;
//       });

//       dateFilter = true;
//     }

//     if (!startDate || !finalDate) {
//       sales = sales.map((sale) => {
//         if (moment(sale.createdAt).month() === moment(Date.now()).month()) {
//           total += sale.sale.total;
//           return sale;
//         }
//       });
//     }

//     let salesFilter = [];

//     sales.map((sale) => {
//       if (sale != undefined) salesFilter.push(sale);
//     });

//     return res.render("sale/list", {
//       sales: salesFilter,
//       total: formatCurrency.brl(total),
//       dateFilter: dateFilter,
//       startDate,
//       finalDate,
//     });
//   }

//   async store(req, res) {
//     let { cart } = req.session;
//     const { descount } = req.body;

//     if (cart.items <= 0) return res.redirect("/cart");

//     const sale = await Sale.create({
//       sale: {
//         total: cart.total.price - (cart.total.price / 100) * descount,
//         descount,
//       },
//     });

//     await Promise.all(
//       cart.items.map(async (item) => {
//         sale.sale.products.push(item);
//       })
//     );

//     await sale.save();

//     cart.items.map(async (item) => {
//       const product = await Product.findById(item.product._id);

//       product.amount = product.amount - item.quantity;

//       await product.save();
//     });

//     await Entrance.create({
//       sale: sale._id,
//       value: cart.total.price - descount,
//     });

//     cart.items.map(async (item) => {
//       cart = Cart.init(cart).delete(item.product._id);
//       req.session.cart = cart;
//     });

//     return res.redirect("/cart");
//   }

//   async destroy(req, res) {
//     const { id } = req.params;

//     const sale = await Sale.findById(id);

//     sale.sale.products.map(async (item) => {
//       const product = await Product.findById(item.product);

//       product.amount = product.amount + item.quantity;

//       await product.save();
//     });

//     await Sale.findByIdAndDelete(id);

//     const entrance = await Entrance.find({ sale: sale._id });

//     await Entrance.findByIdAndRemove(entrance[0]._id);

//     return res.redirect("/sales");
//   }

//   async destroyAll(req, res) {
//     let { cart } = req.session;

//     if (cart.items <= 0) return res.redirect("/cart");

//     cart.items.map(async (item) => {
//       cart = Cart.init(cart).delete(item.product._id);
//       req.session.cart = cart;
//     });

//     return res.redirect("/cart");
//   }
// }

// module.exports = new SaleController();






// const moment = require("moment");
// const Sale = require("../models/Sale");
// const Cart = require("../lib/cart");
// const Product = require("../models/Product");
// const Entrance = require("../models/Entrance");
// const formatCurrency = require("../lib/formatCurrency");

// class SaleController {

//   async index(req, res) {
//     try {
//       const filters = {};
//       let total = 0;

//       const { startDate, finalDate } = req.body;

//       if (startDate || finalDate) {
//         filters.createdAt = {};

//         const startDateFormatted = moment(req.body.startDate).format(
//           "YYYY-MM-DDT00:mm:ss.SSSZ"
//         );

//         const finalDateFormatted = moment(req.body.finalDate).format(
//           "YYYY-MM-DDT23:59:ss.SSSZ"
//         );

//         filters.createdAt.$gte = startDateFormatted;
//         filters.createdAt.$lte = finalDateFormatted;
//       }

//       const page = req.query.page || 1;
//       const perPage = 12; // ajuste conforme necessário
//       const offset = (page - 1) * perPage;

//       let sales = await Sale.findAll({
//         where: filters,
//         order: [['createdAt', 'DESC']],
//         limit: perPage,
//         offset: offset,
//       });


//       // Certifique-se de que sales seja sempre uma array
//       sales = Array.isArray(sales) ? sales : [sales];

//       sales = sales.map((sale) => {
//         sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

//         sale.products = sale.sale.products.map((product) => {
//           product.formattedPrice = formatCurrency.brl(product.price);
//           return product;
//         });


//         sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//         if (!sale.sale.descount) {
//           sale.sale.descount = 0;
//         }

//         return sale;
//       });


//       let dateFilter = false;

//       if (startDate || finalDate) {
//         sales.forEach((sale) => {
//           sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

//           sale.products = sale.sale.products.map((product) => {
//             product.formattedPrice = formatCurrency.brl(product.price);
//             return product;
//           });

//           sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//           if (!sale.sale.descount) {
//             sale.sale.descount = 0;
//           }

//           total += sale.sale.total;
//         });

//         dateFilter = true;
//       }

//       if (!startDate || !finalDate) {
//         sales = sales.filter((sale) => moment(sale.createdAt).month() === moment(Date.now()).month());
//         sales.forEach((sale) => {
//           sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

//           sale.products = sale.sale.products.map((product) => {
//             product.formattedPrice = formatCurrency.brl(product.price);
//             return product;
//           });

//           sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//           if (!sale.sale.descount) {
//             sale.sale.descount = 0;
//           }

//           total += sale.sale.total;
//         });
//       }



//       const totalSales = await Sale.count({ where: filters });
//       const totalPages = Math.ceil(totalSales / perPage);
//       const currentPage = parseInt(page);

//       return res.render("sale/list", {
//         sales: sales,
//         total: formatCurrency.brl(total),
//         dateFilter: dateFilter,
//         startDate,
//         finalDate,
//         totalPages,
//         currentPage,
//       });

//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }




//   async store(req, res) {
//     try {
//       let { cart } = req.session;
//       const { descount } = req.body;

//       if (cart.items <= 0) return res.redirect("/cart");

//       const sale = await Sale.create({
//         sale: {
//           total: cart.total.price - (cart.total.price / 100) * descount,
//           descount,
//           products: cart.items, // Adicione os produtos diretamente aqui
//         },
//       });

//       await Promise.all(
//         cart.items.map(async (item) => {
//           sale.sale.products.push(item);
//         })
//       );

//       await sale.save();

//       cart.items.map(async (item) => {

//         const product = await Product.findByPk(item.product.id);


//         product.amount = product.amount - item.quantity;

//         await product.save();
//       });

//       await Entrance.create({
//         sale: sale._id,
//         value: cart.total.price - descount,
//       });

//       cart.items.map(async (item) => {
//         cart = Cart.init(cart).delete(item.product._id);
//         req.session.cart = cart;
//       });

//       console.log("Sale successfully processed. Clearing cart.");

//       // Zerar o total do carrinho após a venda
//       cart.total.price = 0;

//       // Limpar itens do carrinho
//       cart.items = [];



//       return res.redirect("/cart");
//     } catch (error) {
//       console.error('Error in SaleController.store:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }



//   async destroy(req, res) {
//     const { id } = req.params;

//     try {
//       const sale = await Sale.findByPk(id);

//       if (!sale) {
//         return res.status(404).send("Venda não encontrada.");
//       }

//       sale.sale.products.map(async (item) => {
//         const product = await Product.findByPk(item.product.id);

//         if (product) {
//           product.amount = product.amount + item.quantity;
//           await product.save();
//         }
//       });

//       await Sale.destroy({
//         where: { id: sale.id },
//       });

//       const entrance = await Entrance.findOne({ where: { saleId: sale.id } });

//       if (entrance) {
//         await Entrance.destroy({
//           where: { id: entrance.id },
//         });
//       }

//       return res.status(200).send("Venda deletada com sucesso.");
//     } catch (error) {
//       console.error('Error in SaleController.destroy:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }




//   async destroyAll(req, res) {
//     let { cart } = req.session;

//     // Se o carrinho não existe ou não possui itens, redirecione para "/cart"
//     if (!cart || !cart.items || cart.items.length <= 0) {
//       return res.redirect("/cart");
//     }

//     if (cart.items <= 0) return res.redirect("/cart");

//     cart.items.map(async (item) => {
//       cart = Cart.init(cart).delete(item.product.id);
//       req.session.cart = cart;
//     });

//     return res.redirect("/cart");
//   }
// }

// module.exports = new SaleController();













// //CODIGO OFICIAL
// const { Op } = require('sequelize');

// const moment = require("moment");
// const Sale = require("../models/Sale");
// const Cart = require("../lib/cart");
// const Product = require("../models/Product");
// const Entrance = require("../models/Entrance");
// const formatCurrency = require("../lib/formatCurrency");

// class SaleController {

//   async index(req, res) {
//     try {
//       const filters = {};
//       let total = 0;

//       const { startDate, finalDate } = req.body;

//       // if (startDate || finalDate) {
//       //   filters.createdAt = {};

//       //   const startDateFormatted = moment(req.body.startDate).format(
//       //     "YYYY-MM-DDT00:mm:ss.SSSZ"
//       //   );

//       //   const finalDateFormatted = moment(req.body.finalDate).format(
//       //     "YYYY-MM-DDT23:59:ss.SSSZ"
//       //   );

//       //   filters.createdAt.$gte = startDateFormatted;
//       //   filters.createdAt.$lte = finalDateFormatted;
//       // }



//       if (startDate && finalDate) {
//         filters.createdAt = {
//           [Op.between]: [
//             moment(startDate).startOf('day').toDate(),
//             moment(finalDate).endOf('day').toDate(),
//           ],
//         };
//       }



//       const page = req.query.page || 1;
//       const perPage = 12; // ajuste conforme necessário
//       const offset = (page - 1) * perPage;

//       let sales = await Sale.findAll({
//         where: filters,
//         order: [['createdAt', 'DESC']],
//         limit: perPage,
//         offset: offset,
//       });


//       // Certifique-se de que sales seja sempre uma array
//       sales = Array.isArray(sales) ? sales : [sales];

//       sales = sales.map((sale) => {
//         sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

//         sale.products = sale.sale.products.map((product) => {
//           product.formattedPrice = formatCurrency.brl(product.price);
//           return product;
//         });


//         sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//         if (!sale.sale.descount) {
//           sale.sale.descount = 0;
//         }

//         return sale;
//       });


//       // let dateFilter = false;

//       let dateFilter = startDate || finalDate; // Defina diretamente o valor booleano


//       if (!startDate || !finalDate) {
//         sales = sales.filter((sale) => moment(sale.createdAt).month() === moment(Date.now()).month());
//         sales.forEach((sale) => {
//           sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

//           sale.products = sale.sale.products.map((product) => {
//             product.formattedPrice = formatCurrency.brl(product.price);
//             return product;
//           });

//           sale.formattedTotal = formatCurrency.brl(sale.sale.total);

//           if (!sale.sale.descount) {
//             sale.sale.descount = 0;
//           }

//           total += sale.sale.total;
//         });
//       }



//       const totalSales = await Sale.count({ where: filters });
//       const totalPages = Math.ceil(totalSales / perPage);
//       const currentPage = parseInt(page);

//       return res.render("sale/list", {
//         sales: sales,
//         total: formatCurrency.brl(total),
//         dateFilter: startDate || finalDate,  // Adicione isso para verificar se há filtro de data
//         // dateFilter, // Use diretamente a variável
//         startDate,
//         finalDate,
//         totalPages,
//         currentPage,
//       });

//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }




//   async store(req, res) {
//     try {
//       let { cart } = req.session;
//       const { descount } = req.body;

//       if (cart.items <= 0) return res.redirect("/cart");

//       const sale = await Sale.create({
//         sale: {
//           total: cart.total.price - (cart.total.price / 100) * descount,
//           descount,
//           products: cart.items, // Adicione os produtos diretamente aqui
//         },
//       });

//       await Promise.all(
//         cart.items.map(async (item) => {
//           sale.sale.products.push(item);
//         })
//       );

//       await sale.save();

//       cart.items.map(async (item) => {

//         const product = await Product.findByPk(item.product.id);


//         product.amount = product.amount - item.quantity;

//         await product.save();
//       });

//       await Entrance.create({
//         sale: sale._id,
//         value: cart.total.price - descount,
//       });

//       cart.items.map(async (item) => {
//         cart = Cart.init(cart).delete(item.product._id);
//         req.session.cart = cart;
//       });

//       console.log("Sale successfully processed. Clearing cart.");

//       // Zerar o total do carrinho após a venda
//       cart.total.price = 0;

//       // Limpar itens do carrinho
//       cart.items = [];



//       return res.redirect("/cart");
//     } catch (error) {
//       console.error('Error in SaleController.store:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }



//   async destroy(req, res) {
//     const { id } = req.params;

//     try {
//       const sale = await Sale.findByPk(id);

//       if (!sale) {
//         return res.status(404).send("Venda não encontrada.");
//       }

//       sale.sale.products.map(async (item) => {
//         const product = await Product.findByPk(item.product.id);

//         if (product) {
//           product.amount = product.amount + item.quantity;
//           await product.save();
//         }
//       });

//       await Sale.destroy({
//         where: { id: sale.id },
//       });

//       const entrance = await Entrance.findOne({ where: { saleId: sale.id } });

//       if (entrance) {
//         await Entrance.destroy({
//           where: { id: entrance.id },
//         });
//       }

//       return res.status(200).send("Venda deletada com sucesso.");
//     } catch (error) {
//       console.error('Error in SaleController.destroy:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }




//   async destroyAll(req, res) {
//     let { cart } = req.session;

//     // Se o carrinho não existe ou não possui itens, redirecione para "/cart"
//     if (!cart || !cart.items || cart.items.length <= 0) {
//       return res.redirect("/cart");
//     }

//     if (cart.items <= 0) return res.redirect("/cart");

//     cart.items.map(async (item) => {
//       cart = Cart.init(cart).delete(item.product.id);
//       req.session.cart = cart;
//     });

//     return res.redirect("/cart");
//   }
// }

// module.exports = new SaleController();






const { Op } = require('sequelize');

const moment = require("moment");
const Sale = require("../models/Sale");
const Cart = require("../lib/cart");
const Product = require("../models/Product");
const Entrance = require("../models/Entrance");
const formatCurrency = require("../lib/formatCurrency");

class SaleController {

  async index(req, res) {
    try {
      const filters = {};
      let total = 0;

      const { startDate, finalDate } = req.query;


      if (startDate && finalDate) {
        filters.createdAt = {
          [Op.between]: [
            moment(startDate).startOf('day').toDate(),
            moment(finalDate).endOf('day').toDate(),
          ],
        };
      }



      const page = req.query.page || 1;
      const perPage = 12; // ajuste conforme necessário
      const offset = (page - 1) * perPage;

      let sales = await Sale.findAll({
        where: filters,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: offset,
      });


      // Certifique-se de que sales seja sempre uma array
      sales = Array.isArray(sales) ? sales : [sales];

      sales = sales.map((sale) => {
        sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

        sale.products = sale.sale.products.map((product) => {
          product.formattedPrice = formatCurrency.brl(product.price);
          return product;
        });


        sale.formattedTotal = formatCurrency.brl(sale.sale.total);

        if (!sale.sale.descount) {
          sale.sale.descount = 0;
        }

        return sale;
      });


      // let dateFilter = false;

      let dateFilter = startDate || finalDate; // Defina diretamente o valor booleano


      if (!startDate || !finalDate) {
        sales = sales.filter((sale) => moment(sale.createdAt).month() === moment(Date.now()).month());
        sales.forEach((sale) => {
          sale.formattedDate = moment(sale.createdAt).format("DD-MM-YYYY");

          sale.products = sale.sale.products.map((product) => {
            product.formattedPrice = formatCurrency.brl(product.price);
            return product;
          });

          sale.formattedTotal = formatCurrency.brl(sale.sale.total);

          if (!sale.sale.descount) {
            sale.sale.descount = 0;
          }

          total += sale.sale.total;
        });
      }



      const totalSales = await Sale.count({ where: filters });
      const totalPages = Math.ceil(totalSales / perPage);
      const currentPage = parseInt(page);

      return res.render("sale/list", {
        sales: sales,
        total: formatCurrency.brl(total),
        dateFilter: startDate || finalDate,  // Adicione isso para verificar se há filtro de data
        // dateFilter, // Use diretamente a variável
        startDate,
        finalDate,
        totalPages,
        currentPage,
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }




  async store(req, res) {
    try {
      let { cart } = req.session;
      const { descount } = req.body;

      if (cart.items <= 0) return res.redirect("/cart");

      const sale = await Sale.create({
        sale: {
          total: cart.total.price - (cart.total.price / 100) * descount,
          descount,
          products: cart.items, // Adicione os produtos diretamente aqui
        },
      });

      await Promise.all(
        cart.items.map(async (item) => {
          sale.sale.products.push(item);
        })
      );

      await sale.save();

      cart.items.map(async (item) => {

        const product = await Product.findByPk(item.product.id);


        product.amount = product.amount - item.quantity;

        await product.save();
      });

      await Entrance.create({
        sale: sale.id,
        value: cart.total.price - (cart.total.price / 100) * descount,
      });
      

      cart.items.map(async (item) => {
        cart = Cart.init(cart).delete(item.product.id);
        req.session.cart = cart;
      });

      console.log("Sale successfully processed. Clearing cart.");

      // Zerar o total do carrinho após a venda
      cart.total.price = 0;

      // Limpar itens do carrinho
      cart.items = [];



      return res.redirect("/cart");
    } catch (error) {
      console.error('Error in SaleController.store:', error);
      return res.status(500).send('Internal Server Error');
    }
  }



  async destroy(req, res) {
    const { id } = req.params;

    try {
      const sale = await Sale.findByPk(id);

      if (!sale) {
        return res.status(404).send("Venda não encontrada.");
      }

      sale.sale.products.map(async (item) => {
        const product = await Product.findByPk(item.product.id);

        if (product) {
          product.amount = product.amount + item.quantity;
          await product.save();
        }
      });

      await Sale.destroy({
        where: { id: sale.id },
      });

      const entrance = await Entrance.findOne({ where: { saleId: sale.id } });

      if (entrance) {
        await Entrance.destroy({
          where: { id: entrance.id },
        });
      }

      return res.status(200).send("Venda deletada com sucesso.");
    } catch (error) {
      console.error('Error in SaleController.destroy:', error);
      return res.status(500).send('Internal Server Error');
    }
  }




  async destroyAll(req, res) {
    let { cart } = req.session;

    // Se o carrinho não existe ou não possui itens, redirecione para "/cart"
    if (!cart || !cart.items || cart.items.length <= 0) {
      return res.redirect("/cart");
    }

    if (cart.items <= 0) return res.redirect("/cart");

    cart.items.map(async (item) => {
      cart = Cart.init(cart).delete(item.product.id);
      req.session.cart = cart;
    });

    return res.redirect("/cart");
  }
}

module.exports = new SaleController();
