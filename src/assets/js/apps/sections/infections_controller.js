HospitalCheckup.module("SectionsApp.Section", function(Section, HospitalCheckup, Backbone, Marionette, $, _){

  Section.Controller = {

    listInfections: function(id, criterion){
      this.buildLayout(id, criterion, "cdiff", "Infection", "infections", "than national benchmark", "ratio");
    },

    listSurgeries: function(id, criterion){
      this.buildLayout(id, criterion, "complication", "Surgery", "surgery", "than national rate", "rate");
    },

    buildLayout: function(id, criterion, defaultMeasure, entityID, sectionID, legendLabel, stat){
      var isMobile = document.body.clientWidth < 405;
      var loadingView = new HospitalCheckup.Common.Views.Loading();
      HospitalCheckup.regions.main.show(loadingView);

      var fetchingData = HospitalCheckup.request("chart:entities", entityID, sectionID);

      var listLayout = new Section.Layout(),
      hospitalLayout = new HospitalCheckup.SectionsApp.Hospital.HospitalLayout(),
      headlineView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["headline"]}),
      introView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["intro_text"]}),
      menuView = new Section.Menu({collection: HospitalCheckup.Entities[entityID+"Labels"], section: sectionID}),
      legendView = new Section.Legend({label: legendLabel}),
      bottomView = new Section.TextBlock({text: HospitalCheckup.Entities[entityID+"IntroTxt"]["bottom_text"]}),
      hospitalInfoView = new HospitalCheckup.SectionsApp.Hospital.HospitalInfo(),
      hospitalMeasuresView = new HospitalCheckup.SectionsApp.Hospital["Hospital"+entityID+"ItemList"]({collection: new Backbone.Collection(), section: sectionID, labelArr: entityID}),
      listView;
      if(sectionID === "infections"){
        var hospitalLegendView = new HospitalCheckup.SectionsApp.Hospital.InfectionLegend();
      }

      $.when(fetchingData).done(function(collection){

        if(!isMobile){
          listView = new Section.MainChart();
        } else {
          listView = new Section.MobileList({collection: collection, measure: criterion || defaultMeasure });
          listView.listenTo(menuView, sectiondID+":filter", listView.onFilter);
        }

        listLayout.on("show", function(){
          listLayout.headlineRegion.show(headlineView);
          listLayout.introRegion.show(introView);
          listLayout.menuRegion.show(menuView);
          listLayout.legendRegion.show(legendView);
          listLayout.listRegion.show(listView);
          listLayout.hospitalRegion.show(hospitalLayout);
          listLayout.bottomRegion.show(bottomView); //currently only infections has bottomView, the others are empty string placeholders
        });

        listView.on("hospital:change", function(id){ //triggered by behaviors
          HospitalCheckup.trigger("hospital:change", id, sectionID, hospitalInfoView, hospitalMeasuresView);
        });

        //wait for #main-chart to be rendered
        listView.on("show", function(){
          if(!isMobile){
            Section.chartView = new HospitalCheckup.Common.Chart.BarRangeDot({ //adding it to List module so we can target it later
              el: "#main-chart",
              collection: collection,
              base_height: 700,
              bar_padding: 4,
              margin: {left: 195, right: 10, bottom: 20, top: 25},
              measure: criterion || defaultMeasure,
              section: sectionID,
              stat: stat
            });
            Section.chartView.render(); //for some reason this breaks filtering when chained with initialization above
          }
        });

        menuView.on(sectionID+":filter", function(filterCriterion){
          HospitalCheckup.trigger(sectionID+":filter", filterCriterion); //update routes
          Marionette.triggerMethodOn(HospitalCheckup.module("SectionsApp.Section.chartView"), "update:chart", filterCriterion);
        });

        menuView.once("show", function(){ //TODO we only need to do this manually when user enters the page via a filter URL
          menuView.triggerMethod("set:filter:criterion", criterion);
        });

        hospitalLayout.on("show", function(){
          var defaultModel = collection.at(0);
          HospitalCheckup.trigger("hospital:show", id, hospitalInfoView, hospitalMeasuresView, defaultModel);
          hospitalLayout.topRegion.show(hospitalInfoView);
          if(sectionID === "infections"){
            hospitalLayout.legendRegion.show(hospitalLegendView);
          }
          hospitalLayout.measuresRegion.show(hospitalMeasuresView);
        });

        HospitalCheckup.regions.main.show(listLayout);
      });
    }
  }
});