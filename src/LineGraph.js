import React, {useEffect, useState} from "react"
import { Line } from "react-chartjs-2"
import axios from "axios";
import numeral from "numeral"
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js';


const options = {
    legend: {
        display: false
    },
    element: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltip: {
        mode: "index",
        intersect: false,
        callback: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll"
            }
        }],
        yAxes: [{
            gridLines: {
                display: false
            },
            ticks: {
                callback: function (value, index, values){
                    return numeral(value).format("+0a")
                }
            }
        }]
    }
}
function LineGraph({ casesType= "cases"}){
    Chart.register(CategoryScale);
    const [ data, setData ] = useState({})
    const buildChartData = (data, casesType= 'cases')=>{
        const chartData = []
        let lastDataPoint;
        Object.keys(data[casesType]).forEach((date) => {
            if(lastDataPoint){
                chartData.push({
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                })
            }
            lastDataPoint = data[casesType][date]
        })

        return chartData
    }
    const getDaysData = async ()=>{
        const response = await axios.get(`https://disease.sh/v3/covid-19/historical/all?lastdays=120`)
        const chartData = buildChartData(response.data, casesType)
        setData(chartData)
    }

    useEffect(()=> {
        getDaysData()
    }, [casesType])

    return(
        <div>
            <Line
                options={options}
                data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data: data
                    }]
                }}
            />
        </div>
    )
}
export default LineGraph