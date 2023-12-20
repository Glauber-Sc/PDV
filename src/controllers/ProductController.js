


// const { Op } = require('sequelize');
// const moment = require("moment");
// const formatCurrency = require("../lib/formatCurrency");
// const Product = require("../models/Product");

// class ProductController {
//   create(req, res) {
//     return res.render("product/register");
//   }

//   createUpdate(req, res) {
//     return res.render("product/updateproduct");
//   }



//   // Altere a assinatura da função index no seu ProductController
//   async index(req, res) {


//     try {
//       const { page = 1, pageSize = 10, searchBarcode, nome } = req.query;

//       // Construa o objeto de condição para a pesquisa
//       const condition = {};
//       if (searchBarcode) {
//         condition.barcode = searchBarcode;
//       }


//       // Modifique a pesquisa por nome para suportar pesquisa por uma única letra
//       if (nome) {
//         condition.name = {
//           [Op.iLike]: `${nome}%`,
//         };
//       }

//       // Use o método findAndCountAll do Sequelize com a condição
//       const { rows: products, count: total } = await Product.findAndCountAll({
//         where: condition,
//         offset: (page - 1) * pageSize,
//         limit: parseInt(pageSize),
//       });

//       const totalPages = Math.ceil(total / pageSize);

//       const productsWithFormatting = products.map((product) => {
//         product.formattedExpirationDate = moment(product.expirationDate).format(
//           "DD-MM-YYYY"
//         );

//         product.formattedPrice = formatCurrency.brl(product.price);
//         product.formattedSalePrice = formatCurrency.brl(product.salePrice);
//         return product;
//       });

//       return res.render("product/list", {
//         products: productsWithFormatting,
//         totalPages,
//         currentPage: page,
//         totalItems: total,
//         searchBarcode, // Para manter o valor do campo de pesquisa na renderização
//         nome, // Para manter o valor do campo de nome na renderização
//       });
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }



//   async store(req, res) {
//     const { name, salePrice, amount, expirationDate, barcode } = req.body;

//     if (!name || !salePrice || !amount) {
//       let products = await Product.findAll();

//       const getProductsPromise = products.map(async (product) => {
//         product.formattedExpirationDate = moment(product.expirationDate).format(
//           "DD-MM-YYYY"
//         );
//         product.formattedPrice = formatCurrency.brl(product.price);
//         product.formattedSalePrice = formatCurrency.brl(product.salePrice);
//         return product;
//       });

//       products = await Promise.all(getProductsPromise);

//       return res.render("product/list", {
//         name,
//         salePrice,
//         amount,
//         barcode,
//         products: products,
//         expirationDate: moment(expirationDate).format("YYYY-MM-DD"),
//         message: "Preencha os campos obrigatórios (*) para continuar!",
//         messageClass: "alert-danger", // Adicione esta linha para definir a classe da mensagem
//       });
//     }

//     await Product.create({
//       ...req.body,
//       expirationDate: !req.body.expirationDate
//         ? null
//         : moment(req.body.expirationDate).format(),
//     });

//     return res.redirect("/productslist");
//   }

//   async edit(req, res) {
//     const { id } = req.params;

//     try {
//       let product = await Product.findByPk(id);

//       product.formattedExpirationDate = moment(product.expirationDate).format(
//         "YYYY-MM-DD"
//       );
//       console.log("AAAAAAAA", product)
//       return res.render("product/update", {
//         product: product,
//       });
//     } catch (error) {
//       console.error('Error fetching product for edit:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }

//   async update(req, res) {
//     const { id } = req.params;
//     const { name, salePrice, amount } = req.body;

//     try {
//       if (!name || !salePrice || !amount) {
//         let product = await Product.findByPk(id);

//         product.formattedExpirationDate = moment(product.expirationDate).format(
//           "YYYY-MM-DD"
//         );

//         return res.render("product/update", {
//           product: product,
//           message: "Preencha os campos obrigatórios (*) para continuar!",
//         });
//       }

//       await Product.update(
//         {
//           ...req.body,
//           expirationDate: !req.body.expirationDate
//             ? null
//             : moment(req.body.expirationDate).format(),
//         },
//         { where: { id } }
//       );

//       return res.redirect("/productslist");
//     } catch (error) {
//       console.error('Error updating product:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }

//   async destroy(req, res) {
//     const { id } = req.params;

//     try {
//       await Product.destroy({
//         where: {
//           id: id,
//         },
//       });

//       return res.redirect("/productslist");
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       return res.status(500).send('Internal Server Error');
//     }
//   }


// }

// module.exports = new ProductController();






const { Op } = require('sequelize');
const moment = require("moment");
const formatCurrency = require("../lib/formatCurrency");
const Product = require("../models/Product");

class ProductController {
  create(req, res) {
    return res.render("product/register");
  }

  createUpdate(req, res) {
    return res.render("product/updateproduct");
  }




  // async index(req, res) {
  //   try {
  //     const { page = 1, pageSize = 10, searchBarcode, nome } = req.query;

  //     // Construa o objeto de condição para a pesquisa
  //     const condition = {};
  //     if (searchBarcode) {
  //       condition.barcode = searchBarcode;
  //     }


  //     // Modifique a pesquisa por nome para suportar pesquisa por uma única letra
  //     if (nome) {
  //       condition.name = {
  //         [Op.iLike]: `${nome}%`,
  //       };
  //     }

  //     // Use o método findAndCountAll do Sequelize com a condição
  //     const { rows: products, count: total } = await Product.findAndCountAll({
  //       where: condition,
  //       offset: (page - 1) * pageSize,
  //       limit: parseInt(pageSize),
  //     });

  //     const totalPages = Math.ceil(total / pageSize);

  //     const productsWithFormatting = products.map((product) => {
  //       product.formattedExpirationDate = moment(product.expirationDate).format(
  //         "DD-MM-YYYY"
  //       );

  //       product.formattedPrice = formatCurrency.brl(product.price);
  //       product.formattedSalePrice = formatCurrency.brl(product.salePrice);
  //       return product;
  //     });

  //     return res.render("product/list", {
  //       products: productsWithFormatting,
  //       totalPages,
  //       currentPage: page,
  //       totalItems: total,
  //       searchBarcode, // Para manter o valor do campo de pesquisa na renderização
  //       nome, // Para manter o valor do campo de nome na renderização
  //     });
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     return res.status(500).send('Internal Server Error');
  //   }
  // }



  async index(req, res) {
    try {
      const { page = 1, pageSize = 10, searchBarcode, nome } = req.query;

      // Construa o objeto de condição para a pesquisa
      const condition = {};
      if (searchBarcode) {
        condition.barcode = searchBarcode;
      }


      // Modifique a pesquisa por nome para suportar pesquisa por uma única letra
      if (nome) {
        condition.name = {
          [Op.iLike]: `${nome}%`,
        };
      }

      // Use o método findAndCountAll do Sequelize com a condição
      const { rows: products, count: total } = await Product.findAndCountAll({
        where: condition,
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
      });

      const totalPages = Math.ceil(total / pageSize);

      const productsWithFormatting = products.map((product) => {
        // product.formattedExpirationDate = moment(product.expirationDate).format(
        //   "DD-MM-YYYY"
        // );
        product.formattedExpirationDate = product.expirationDate ? moment(product.expirationDate).format("DD/MM/YYYY") : '';


        product.formattedPrice = formatCurrency.brl(product.price);
        product.formattedSalePrice = formatCurrency.brl(product.salePrice);
        return product;
      });

      return res.render("product/list", {
        products: productsWithFormatting,
        totalPages,
        currentPage: page,
        totalItems: total,
        searchBarcode, // Para manter o valor do campo de pesquisa na renderização
        nome, // Para manter o valor do campo de nome na renderização
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  async store(req, res) {
    const { name, salePrice, amount, expirationDate, barcode } = req.body;

    if (!name || !salePrice || !amount) {
      let products = await Product.findAll();

      const getProductsPromise = products.map(async (product) => {
        // product.formattedExpirationDate = moment(product.expirationDate).format(
        //   "DD-MM-YYYY"
        // );
        product.formattedExpirationDate = product.expirationDate ? moment(product.expirationDate).format("DD/MM/YYYY") : '';

        product.formattedPrice = formatCurrency.brl(product.price);
        product.formattedSalePrice = formatCurrency.brl(product.salePrice);
        return product;
      });

      products = await Promise.all(getProductsPromise);

      return res.render("product/list", {
        name,
        salePrice,
        amount,
        barcode,
        products: products,
        expirationDate: moment(expirationDate).format("YYYY-MM-DD"),
        message: "Preencha os campos obrigatórios (*) para continuar!",
        messageClass: "alert-danger", // Adicione esta linha para definir a classe da mensagem
      });
    }

    await Product.create({
      ...req.body,
      expirationDate: !req.body.expirationDate
        ? null
        : moment(req.body.expirationDate).format(),
    });

    return res.redirect("/productslist");
  }

  async edit(req, res) {
    const { id } = req.params;

    try {
      let product = await Product.findByPk(id);

      // product.formattedExpirationDate = moment(product.expirationDate).format(
      //   "YYYY-MM-DD"
      // );
      product.formattedExpirationDate = product.expirationDate ? moment(product.expirationDate).format("DD/MM/YYYY") : '';

      console.log("AQUI ESTA", product)
      return res.render("product/update", {
        product: product,
      });
    } catch (error) {
      console.error('Error fetching product for edit:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, salePrice, amount } = req.body;

    try {
      if (!name || !salePrice || !amount) {
        let product = await Product.findByPk(id);

        // product.formattedExpirationDate = moment(product.expirationDate).format(
        //   "YYYY-MM-DD"
        // );
        product.formattedExpirationDate = product.expirationDate ? moment(product.expirationDate).format("DD/MM/YYYY") : '';

        return res.render("product/update", {
          product: product,
          message: "Preencha os campos obrigatórios (*) para continuar!",
        });
      }

      await Product.update(
        {
          ...req.body,
          expirationDate: !req.body.expirationDate
            ? null
            : moment(req.body.expirationDate).format(),
        },
        { where: { id } }
      );

      return res.redirect("/productslist");
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    try {
      await Product.destroy({
        where: {
          id: id,
        },
      });

      return res.redirect("/productslist");
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


}

module.exports = new ProductController();
