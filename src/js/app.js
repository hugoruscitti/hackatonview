var gui = require('nw.gui');
var util = require('util');
var fs = require('fs');

App = Ember.Application.create();

function exit(mensaje) {
  alert(mensaje);
  gui.App.quit();
}

if (!fs.existsSync('../node_modules/twitter/index.js'))
  exit("No se encuentra la biblioteca twitter, ejecuta el comando 'make deps' antes.");

if (!fs.existsSync('../src/setup.json'))
  exit("Imposible encontrar el archivo 'src/setup.json', tienes que configurarlo antes de continuar.");


var twitter = require('twitter');

// Variables de acceso global:
var lista_de_twits = [];
var lista_de_twits_data = [];
var twit;


var setup = require('../src/setup.json');

window.twit = new twitter({
  consumer_key: setup.consumer_key,
  consumer_secret: setup.consumer_secret,
  access_token_key: setup.access_token_key,
  access_token_secret: setup.access_token_secret,
});

function actualizar_twits(data) {
  for (var i in data.statuses) {
    var texto = data.statuses[i].text;

    if (lista_de_twits.indexOf(texto) == -1) {
      lista_de_twits.push(texto);
      lista_de_twits_data.push(data.statuses[i]);
    }
  }
}

App.Router.map(function() {

});


function cargar_siguiente_twit(controller) {
  controller.set('tick', 0);

  var indice = controller.get('indice_ultimo_twit');
  var twits = controller.get('twits_encontrados');

  if (indice < twits.length -1) {
    indice += 1;
    controller.set('indice_ultimo_twit', indice);
  } else {
      console.log("eh, no hay tantos twits como para mostrar ahora... me quedo en el último por ahora...");
  }

  controller.set('ultimo_twit', twits[indice]);
  controller.set('ultimo_twit_safe', twits[indice].htmlSafe());

  window.ultimo_twit = twits[indice];
  window.ultimo_twit_data = lista_de_twits_data[indice];
}



App.IndexController = Ember.ObjectController.extend({
  nombre: "",
  cantidad: 0,
  tick: 4,
  modo_edicion: true,
  twits_encontrados: [],
  ultimo_twit: "...",
  busqueda: 'programar',
  ultimo_twit_safe: "safe ...",
  indice_ultimo_twit: -1,
  iniciar: function() {

    var controller = this;

    /*
    lista_de_twits = [];
    lista_de_twits_data = [];

    controller.set('cantidad', lista_de_twits.length);
    controller.set('tick', controller.get('tick') + 1);
    controller.set('twits_encontrados', lista_de_twits);

      */

    /*
     * Actualiza el último twit a mostrar en pantalla
     * si es necesario.
     */
    function evaluar_tick_de_twit() {
      if (controller.get('tick') > 3) {
        cargar_siguiente_twit(controller);
      }
    }


    function buscar() {
      console.log("Buscando (cada 10 segundos)...");

      twit.search(controller.get('busqueda'), function(data) {
        actualizar_twits(data);
        controller.set('cantidad', lista_de_twits.length);
        controller.set('tick', controller.get('tick') + 1);
        controller.set('twits_encontrados', lista_de_twits);
        evaluar_tick_de_twit();
      });

      setTimeout(buscar, 5000);
    }

    buscar();

  }.on('init'),
  actions: {
    guardar: function() {
      this.set('modo_edicion', false);
      this.iniciar();
    },
    saltar_este_twit: function() {
      cargar_siguiente_twit(this);
    },
    configurar: function() {
      this.set('modo_edicion', true);
    }
  }
})


App.ViewRoute = Ember.Route.extend({
});
