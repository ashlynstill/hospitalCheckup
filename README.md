# Hospital Checkup
Explore hospital quality data for Atlanta area hospitals.

- Published: by Sept. 1!
- Lives here:
- Hosted here:

## Dependencies

 - [Node.js](https://nodejs.org/)
 - [Grunt CLI](http://gruntjs.com/getting-started)
 - [Bower](http://bower.io/)
 
##Plugins
 - [underscore]()
 - [backbone]()
 - [backbone.marionette]()
 - [backbone.select](https://github.com/hashchange/backbone.select) for keeping the nav selections updated
 - [backbone.localstorage](https://github.com/jeromegn/Backbone.localStorage) to utilize local storage
 - [spin.js](http://spin.js.org/) for loading spinner

## Notes
- Rate == Ratio
- Range (popup) is the confidence interval
- Need to explain the benchmark is always 1 (right???)

##Improvements on original hospital quality app
 - Active menu item is highlighted
 - filters have routes so you can bookmark a particular infection view
 - hospitals have routes too
 - nav sub-app to handle navigation and routes properly
 - infections have standardized attributes so you don't need to reset them to a hacky default
 - dropdown menu accurately reflects selected filter on refresh/navigate
 - state average no longer hard-coded into the view
 
## Todo
- [ ] Clear local storage on first load in case there's new stuff
- [ ] Add commas to number displays that may have a thousands place
- [ ] Figure out what's wrong with `processhtml` grunt task and add it back in
- [ ] ssihyst uses procedures instead of patient days, fix it
- [ ] trigger selection of cdiff rather than setting it as default all over the place
- [ ] fix filter URLs so you can provide multiple filter parameters (i.e. hospital and infection)
- [ ] If someone clicks on already active nav item it shouldn't reload the layout
- [ ] What if local storage is disabled?
- [ ] Option to keep hospitals in same order so you can compare how they rate across categories

##How to update
- open the "hospital_compare" table on the interanet data server (add new data if necessary)
- To update state totals, run `grunt sql_bakery`, which runs this query:
  ```
  ALTER VIEW hospital_totals_web AS
  SELECT state,measure,score FROM hai_state_20140523
  WHERE state = "GA" AND measure LIKE "HAI_%_SIR"
  ```
- TODO add view for main data sets
- Timely and effective care table for surgeries (I don't see anything in there about complications or readmissions though)
- Labor and delivery comes from two separate data sources, one is the HQI_HOSPI_TEC_PC table (right now it's empty)

