HospitalCheckup.module("HomeApp.Home", function(Home, HospitalCheckup, Backbone, Marionette, $, _){
  Home.HomeView = Marionette.ItemView.extend({
    template: "#homepage-template",
    initialize: function(){
      $(window).on("resize", this.fix_gap);
    },

    remove: function() {
      $(window).off("resize",this.fix_gap);
      //call the superclass remove method
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    fix_gap: function(){
      // if home page is too short for height of browser window, make footer the length of the rest of the window
      var windowHeight = $(window).height(),
      $footer = $('#homepage-bottom');
      var gap = windowHeight - $footer.position().top - parseInt($footer.css("borderTopWidth"));

      if (gap > $footer.height()){
      	$footer.height(gap);
      }
    }
  });

  //using the main navigation header.js entity to build these and its corresponding controller to handle the routing and triggers
  Home.IconView = Marionette.ItemView.extend({
    template: "#homepage-icon-link",
    className: "small-4 columns",
    events: {
      "click a": "navigate" 
    },

    navigate: function(e){
      e.preventDefault();
      Marionette.triggerMethodOn(HospitalCheckup.module("HeaderApp.List.headers").children.findByModel(this.model), "navigate", this.model);
    }
  });

  Home.IconCollectionView = Marionette.CollectionView.extend({
    template: "#empty-template",
    el: "#home-icon-row",
    childView: Home.IconView,
    filter: function(child, index, collection){ //don't use the "home" nav item
      return child.has("icon")
    }
  });
});