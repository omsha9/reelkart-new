import React from "react";
import { LineChart } from 'react-chartkick'
import 'chartkick/chart.js'


export function LineBar() {
  return (
    

    <LineChart  data={[["2024-01-01", 4], ["2024-01-02", 3], ["2024-01-03", 5], ["2024-01-04",2 ]]} />
    
  );
}
