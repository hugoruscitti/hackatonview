App = Ember.Application.create();


var util = require('util');
var twitter = require('twitter');

// Variables de acceso global:
var stream = null;
var lista_de_twits = [];
var twit;

var setup = require('../src/setup.json');

window.twit = new twitter({
  consumer_key: setup.consumer_key,
  consumer_secret: setup.consumer_secret,
  access_token_key: setup.access_token_key,
  access_token_secret: setup.access_token_secret,
});


function reiniciar(busqueda) {

  twit.search('#boca', function(data) {

    for (var i in data.statuses) {
      var texto = data.statuses[i].text;

      if (lista_de_twits.indexOf(texto) == -1) {
        lista_de_twits.push(texto);
      }
    }
  });

}

function actualizar_twits(data) {
  for (var i in data.statuses) {
    var texto = data.statuses[i].text;

    if (lista_de_twits.indexOf(texto) == -1) {
      lista_de_twits.push(texto);
    }
  }
}

App.Router.map(function() {
  this.route('view');
  this.route('setup', {path: '/'});
});

App.SetupRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});

App.SetupController = Ember.ObjectController.extend({
  nombre: "pepe123",
  cantidad: 0,
  tick: 0,
  twits_encontrados: [],
  ultimo_twit: {},
  indice_ultimo_twit: -1,
  iniciar: function() {
    var controller = this;

    /*
     * Actualiza el último twit a mostrar en pantalla
     * si es necesario.
     */
    function evaluar_tick_de_twit() {
      if (controller.get('tick') > 3) {
        controller.set('tick', 0);

        var indice = controller.get('indice_ultimo_twit');
        var twits = controller.get('twits_encontrados');

        if (indice < twits.length) {
          indice += 1;
          controller.set('indice_ultimo_twit', indice);
        } else {
          console.log("eh, no hay tantos twits como para mostrar ahora... me quedo en el último por ahora...");
        }

        console.log(twits[indice])
        controller.set('ultimo_twit', twits[indice]);
      }
    }


    function buscar() {
      console.log("Buscando (cada 10 segundos)...");

      twit.search('#boca', function(data) {
        actualizar_twits(data);
        controller.set('cantidad', lista_de_twits.length);
        controller.set('tick', controller.get('tick') + 1);
        controller.set('twits_encontrados', lista_de_twits);
        evaluar_tick_de_twit();
      });

      setTimeout(buscar, 10000);
    }

    buscar();


  }.on('init'),
  actions: {
    guardar: function() {
      alert('guardando !!!');
      this.transitionTo('view');
    }
  }
})


App.ViewRoute = Ember.Route.extend({
});
