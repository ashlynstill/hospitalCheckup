/*
  Find state average in the state table. Creates hospital_totals_web view to be digested by python infections parser script. The date on the end of the filename will need to be changed when new data arrives
*/

/*INFECTIONS STATE AVERAGES*/
ALTER VIEW hospital_totals_web AS
SELECT state,
       measure,
       score
FROM hai_state_20140523
WHERE state = "GA" AND measure LIKE "HAI_%_SIR"


/*PERINATAL STATE AVERAGES*/
ALTER VIEW perinatal_state_avgs_web AS
SELECT round(AVG(C_Sect / Total_Births)*100,0) as avgC_SectPct,
       round(SUM(Avg_Delivery_Charge*Total_Births)/SUM(Total_Births), 0) as avgDeliveryCharge,
       round(SUM(Avg_Premature_Delivery_Charge*Total_Births)/SUM(Total_Births), 0) as avgPrematureCharge,
       round(AVG(Total_Births), 0) as avgBirths,
       /*'sample' might actually be the sample the score is based on? In that case should probably weight average based on that instead of Total_Births, especially since the sample is 0 in many cases*/
       round(SUM(c.score * Total_Births)/SUM(Total_Births), 2) as avgEarlyPct
FROM ahq.perinatal a
JOIN ahq.lu_id b using(uid)
LEFT JOIN hospital_compare.HQI_HOSP_TimelyEffectiveCare c
  ON b.Medicare_Provider_No = c.provider_id
WHERE Year = 2014 AND Total_Births > 0 AND (C_Sect / Total_Births) < 1 AND measure_id = "PC_01" AND state = "GA"


/*Sometimes total births are obviously wrong, find the weird ones and give them to Carrie so she can call the hospitals*/
SELECT Facility_Name,
       C_Sect,
       Total_Births,
       Total_Deliveries,
       Live_Births
FROM ahq.perinatal
WHERE Year = 2014 AND Live_Births > Total_Births