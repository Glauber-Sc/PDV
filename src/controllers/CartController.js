


const { Op } = require('sequelize');
const moment = require('moment');
const Cart = require('../lib/cart');
const Product = require('../models/Product');
const formatCurrency = require('../lib/formatCurrency');

class CartController {


  async index(req, res) {
    try {
      const filters = {};

      if (req.body.nome) {
        filters.nome = {
          [Op.iLike]: `%${req.body.nome}%`,
        };

        let products = await Product.findAll({
          where: {
            name: filters.nome,
          },
        });

        const getProductsPromise = products.map(async (product) => {
          product.formattedExpirationDate = moment(product.expirationDate).format(
            'DD-MM-YYYY'
          );

          // Adicione a formatação do preço para a pesquisa por nome
          product.formattedSalePrice = formatCurrency.brl(product.salePrice);

          return product;
        });

        products = await Promise.all(getProductsPromise);

        let { cart } = req.session;

        cart = Cart.init(cart);

        return res.render('cart/list', { cart, products });
      }

      if (req.body.searchBarcode) {
        let products = await Product.findAll({
          where: {
            barcode: req.body.searchBarcode,
          },
        });

        const getProductsPromise = products.map(async (product) => {
          product.formattedExpirationDate = moment(product.expirationDate).format(
            'DD-MM-YYYY'
          );

          product.formattedSalePrice = formatCurrency.brl(product.salePrice);

          return product;
        });

        products = await Promise.all(getProductsPromise);

        let { cart } = req.session;

        cart = Cart.init(cart);

        return res.render('cart/list', { cart, products });
      }

      let { cart } = req.session;

      cart = Cart.init(cart);

      const getItemsPromise = cart.items.map(async (item) => {
        const product = await Product.findByPk(item.product.id);
        item.product = product;
        item.formattedPrice = formatCurrency.brl(item.price);
        return item;
      });

      cart.items = await Promise.all(getItemsPromise);

      cart.total.formattedPrice = formatCurrency.brl(cart.total.price);


      try {
        const { cart } = req.session;
        const cartInstance = Cart.init(cart);

        const productsPerPage = 10;
        let currentPage = parseInt(req.query.page) || 1;

        // Garanta que a página não seja menor que 1
        currentPage = Math.max(1, currentPage);

        // Se a página fornecida for menor que 1, redirecione para a página 1
        if (parseInt(req.query.page) < 1) {
          return res.redirect('/cart?page=1');
        }


        const offset = (currentPage - 1) * productsPerPage;

        const { count, rows: products } = await Product.findAndCountAll({
          limit: productsPerPage,
          offset: Math.max(0, offset), // Garanta que o offset não seja negativo
        });

        // Formatar os preços para todos os produtos
        const getProductsPromise = products.map(async (product) => {
          product.formattedExpirationDate = moment(product.expirationDate).format(
            'DD-MM-YYYY'
          );

          // Adicione a formatação do preço para a pesquisa por nome
          product.formattedSalePrice = formatCurrency.brl(product.salePrice);

          return product;
        });

        const formattedProducts = await Promise.all(getProductsPromise);

        const totalPages = Math.ceil(count / productsPerPage);

        // Se a página fornecida for maior que o total de páginas, redirecione para a última página
        if (currentPage > totalPages) {
          return res.redirect(`/cart?page=${totalPages}`);
        }

        return res.render('cart/list', {
          cart: cartInstance,
          products: formattedProducts,
          totalPages,
          currentPage,
        });
      } catch (error) {
        console.error('Error in CartController.index:', error);
        return res.status(500).send('Internal Server Error');
      }



    } catch (error) {
      console.error('Error in CartController.index:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  async addOne(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);

      let { cart } = req.session;

      cart = Cart.init(cart);
      cart.addOne(product);

      req.session.cart = cart;

      return res.redirect('/cart');
    } catch (error) {
      console.error('Error in CartController.addOne:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  async removeOne(req, res) {
    try {
      let { id } = req.params;

      let { cart } = req.session;

      if (!cart) return res.redirect('/cart');

      cart = Cart.init(cart).removeOne(id);

      req.session.cart = cart;

      return res.redirect('/cart');
    } catch (error) {
      console.error('Error in CartController.removeOne:', error);
      return res.status(500).send('Internal Server Error');
    }
  }



  async delete(req, res) {
    try {
      let { id } = req.params;
      console.log('Deleting item with id:', id); // Adicione este log
  
      let { cart } = req.session;
  
      if (!cart) return res.redirect('/cart');
  
      cart = Cart.init(cart).delete(id);
  
      req.session.cart = cart;
  
      console.log('Cart after deletion:', cart); // Adicione este log
  
      return res.redirect('/cart');
    } catch (error) {
      console.error('Error in CartController.delete:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
  

  
}

module.exports = new CartController();
