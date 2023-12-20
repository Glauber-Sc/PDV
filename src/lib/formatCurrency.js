// // const formatCurrency = {
// //   brl(value) {
// //     value = new Intl.NumberFormat("pt-BR", {
// //       style: "currency",
// //       currency: "BRL",
// //     }).format(value);

// //     return value;
// //   },
// // };

// // module.exports = formatCurrency;


// const formatDate = {
//   brl(value) {
//     value = new Intl.NumberFormat("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     }).format(value);

//     return value;
//   },

//   formatTime(dateTimeString) {
//     const options = {
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       hour12: false, // Usar formato de 24 horas
//       timeZone: "America/Sao_Paulo", // Substitua pela sua zona horária
//     };

//     const formattedTime = new Intl.DateTimeFormat("pt-BR", options).format(new Date(dateTimeString));

//     return formattedTime;
//   },
// };

// module.exports = formatDate;


const formatDate = {
  brl(value) {
    value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

    return value;
  },

  formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000); // Subtrai o offset para obter a hora local

    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false, // Usar formato de 24 horas
      timeZone: "America/Sao_Paulo",
    };

    const formattedTime = new Intl.DateTimeFormat("pt-BR", options).format(localDate);

    return formattedTime;
  },
};

module.exports = formatDate;
