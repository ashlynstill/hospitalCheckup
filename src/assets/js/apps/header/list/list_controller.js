HospitalCheckup.module("HeaderApp.List", function(List, HospitalCheckup, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = HospitalCheckup.request("header:entities");
      var headers = new List.Headers({collection: links});

      HospitalCheckup.regions.header.show(headers);
    },

    setActiveHeader: function(headerUrl){
      var links = HospitalCheckup.request("header:entities");
      var headerToSelect = links.find(function(header){
        return header.get("url") === headerUrl;
      });
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});