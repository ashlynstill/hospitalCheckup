HospitalCheckup.module("InfectionsApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){

  List.Controller = {
    listInfections: function(id, criterion){
      var isMobile = document.body.clientWidth < 405,
      defaultMeasure = "cdiff";
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingInfections = HospitalCheckup.request("chart:entities", "Infection", "infections");

      var infectionsListLayout = new List.Layout(),
      hospitalLayout = new HospitalCheckup.InfectionsApp.Show.HospitalLayout(),
      infectionsHeadlineView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["headline"]}),
      infectionsIntroView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["intro_text"]}),
      infectionsMenuView = new List.Menu({collection: HospitalCheckup.Entities.InfectionLabels, section: "infections"}),
      infectionsLegendView = new List.Legend(),
      infectionsBottomView = new List.TextBlock({text: HospitalCheckup.Entities.InfectionsIntroTxt["bottom_text"]}),
      hospitalShowView = new HospitalCheckup.InfectionsApp.Show.Hospital(),
      hospitalLegendView = new HospitalCheckup.InfectionsApp.Show.Legend(),
      hospitalChartsView = new HospitalCheckup.InfectionsApp.Show.HospitalItemList({collection: new Backbone.Collection(), section: "infections", labelArr: "Infection"}),
      infectionsListView;

      $.when(fetchingInfections).done(function(infections){

        if(!isMobile){
          infectionsListView = new List.InfectionsChart();
        } else {
          infectionsListView = new List.MobileList({collection: infections, measure: criterion || defaultMeasure });
          infectionsListView.listenTo(infectionsMenuView, "infections:filter", infectionsListView.onInfectionsFilter);
        }

        infectionsListLayout.on("show", function(){
          infectionsListLayout.headlineRegion.show(infectionsHeadlineView);
          infectionsListLayout.introRegion.show(infectionsIntroView);
          infectionsListLayout.menuRegion.show(infectionsMenuView);
          infectionsListLayout.legendRegion.show(infectionsLegendView);
          infectionsListLayout.listRegion.show(infectionsListView);
          infectionsListLayout.hospitalRegion.show(hospitalLayout);
          infectionsListLayout.bottomRegion.show(infectionsBottomView);
        });

        infectionsListView.on("hospital:change", function(id){ //triggered by behaviors
          HospitalCheckup.trigger("hospital:change", id, hospitalShowView, hospitalChartsView);
        });

        //wait for #main-chart to be rendered
        infectionsListView.on("show", function(){
          if(!isMobile){
            List.infectionsChartView = new HospitalCheckup.Common.Chart.BarRangeDot({ //adding it to List module so we can target it later
              el: "#main-chart",
              collection: infections,
              base_height: 700,
              bar_padding: 4,
              margin: {left: 195, right: 10, bottom: 20, top: 25},
              measure: criterion || defaultMeasure,
              section: "infections",
              stat: "ratio"
            });
            List.infectionsChartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        infectionsMenuView.on("infections:filter", function(filterCriterion){
          HospitalCheckup.trigger("infections:filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("InfectionsApp.List.infectionsChartView"), "update:chart", filterCriterion);
        });

        infectionsMenuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          infectionsMenuView.triggerMethod("set:filter:criterion", criterion);
        });

        hospitalLayout.on("show", function(){
          var defaultModel = infections.at(0);
          HospitalCheckup.trigger("hospital:show", id, hospitalShowView, hospitalChartsView, defaultModel);
          hospitalLayout.topRegion.show(hospitalShowView);
          hospitalLayout.legendRegion.show(hospitalLegendView);
          hospitalLayout.chartRegion.show(hospitalChartsView);
        });

        HospitalCheckup.regions.main.show(infectionsListLayout);
      });
    }
  }
});