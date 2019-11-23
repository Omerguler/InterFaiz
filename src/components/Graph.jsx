import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
function formatter(value, name, props) {
  return formatNumber(value);
}
function formatNumber(num) {
  let result = Number(num);
  let resultString = result.toFixed(2);
  var str = resultString.split(".");
  str[0] = str[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return str.join(",");
}

class Graph extends Component {
  render() {
    return (
      <div>
        <LineChart
          style={{ backgroundColor: "#d8d8d8" }}
          width={1200}
          height={600}
          data={this.props.data}
        >
          <XAxis dataKey="name" stroke="#222222" />
          <YAxis />
          <Tooltip
            wrapperStyle={{
              width: 210,
              color: "red",
              backgroundColor: "#e4e4e4"
            }}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Line
            name={"Faiz miktarı" + `(${this.props.currencySymbol})`}
            type="monotone"
            formatter={formatter}
            dataKey="money"
            stroke="#033507"
          />
        </LineChart>
      </div>
    );
  }
}

export default Graph;
