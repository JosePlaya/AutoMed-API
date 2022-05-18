var messagebird = require('messagebird')('HbN2vflvdwndrCNqFkcsAB5Hs');

// Configurar wsp
var params = {
    'to': '+56931059727',
    'from': 'e22d1dc8-d9d1-4070-8da8-7d703df148fd',
    'type': 'text',
    'content': {
      'text': 'WhatsApp de prueba!',
      'disableUrlPreview': false
    }
  };
  
  // Enviar wsp
  messagebird.conversations.send(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });