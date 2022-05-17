// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function mailer(remitentes, nombreMedicamento, nombreCentroMedico, stockDisponible) {
//     console.log('Iniciando nodemailer...');
//     console.log('...creando transporter...');
//     const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//             user: "noreply.automed@gmail.com",
//             pass: "AutoMed123"
//         }
//     })
//     console.log('...transporter created: ',transporter);
//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"AutoMed" <noreply.automed@gmail.com>', // sender address
//       to: remitentes, // list of receivers
//       subject: "Nuevo Stock ✔", // Subject line
//       html: html(nombreMedicamento, nombreCentroMedico, stockDisponible)
//     }).then(r=>{
//         console.log(r);
//         return 200;
//     })
//     .catch(e=>{
//         console.log(e);
//         return 400;
//     });
//   }
  
//   //mailer().catch(console.error);

// // ------------------------------------------------- \\
// //                   PLANTILLA HTML                  \\
// // ------------------------------------------------- \\

// function html(nombreMedicamento, nombreCentroMedico, stockDisponible){
//     return `
//         <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="ffffff">
//         <tbody>
//         <tr>
//         <td align="center" valign="top">
//         <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="D92802">
//         <tbody>
//         <tr>
//         <td style="text-align: center; padding: 0px 20px 0px 0px;" valign="top" height="60">
//         <h1>NOTIFICACI&Oacute;N MEDICAMENTO</h1>
//         <h4>NOTIFICACI&Oacute;N DE MEDICAMENTO LISTO PARA RETIRAR</h4>
//         </td>
//         </tr>
//         <tr>
//         <td colspan="2">&nbsp;</td>
//         </tr>
//         </tbody>
//         </table>
//         <table style="margin: 7px 0px 18px 0px;" border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="ffffff">
//         <tbody>
//         <tr>
//         <td style="font-family: SF Pro Text,-apple-system,sans-serif; padding: 4px 0px 0px 15px; display: inline-block; color: #000; font-weight: 400; font-size: 16px; line-height: 20px;" colspan="2" align="left" valign="top">
//         <p style="margin-bottom: 5px;"><strong>Se informa del siguiente medicamento listo para ser retirado:</strong></p>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         <table style="margin: 7px 0px 18px 0px;" border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="ffffff">
//         <tbody>
//         <tr>
//         <td style="font-family: SF Pro Text,-apple-system,sans-serif; padding: 4px 0px 0px 15px; display: inline-block; color: #000; font-weight: 400; font-size: 12px; line-height: 18px;" colspan="2" align="left" valign="top">
//         <p style="margin-bottom: 5px;">&nbsp;</p>
//         <p>Nombre: ${nombreMedicamento}</p>
//         <p>Lugar para retirar: ${nombreCentroMedico}</p>
//         <p>Stock disponible: ${stockDisponible}</p>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="ffffff">
//         <tbody>
//         <tr>
//         <td>&nbsp;</td>
//         </tr>
//         <tr>
//         <td style="border-top: 1px solid #eeeeee; color: #514b61;" align="left" valign="top">
//         <p style="font-family: SF Pro Text,-apple-system,sans-serif; font-size: 12px; line-height: 16px; padding: 20px 0; margin: 0; text-align: center;">AUTOMED ©</p>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//      `
// }