App = Ember.Application.create();

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
  actions: {
    guardar: function() {
      alert('guardando !!!');
      this.transitionTo('view');
    }
  }
})


App.ViewRoute = Ember.Route.extend({
});
