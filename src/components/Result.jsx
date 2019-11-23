import React, { Component } from "react";
import "./Home.css";
function format(data) {
  let res = new Number(data);
  res = res.toFixed(2);
  return res === "NaN" ? "0.00" : formatNumber(res);
}
function formatNumber(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}
class Result extends Component {
  render() {
    return (
      <div>
        <h2 className="right-header">Faiz Değerleri: </h2>
        <p className="right-variable">
          <span className="interest-label">Faiz Miktarı: </span>
          <span className="interest-display data-display">
            {format(this.props.interestMoney)}
            {" " + this.props.currencySymbol}
          </span>
        </p>
        <p className="right-variable">
          <span className="interest-label">Vergi:</span>{" "}
          <span className="payment-display data-display">
            {format(this.props.taxAmount)}
            {" " + this.props.currencySymbol}
          </span>
        </p>
        <p className="right-variable">
          <span className="interest-label">Net Faiz Miktarı:</span>{" "}
          <span className="number-display data-display">
            {format(this.props.NetFaiz)}
            {" " + this.props.currencySymbol}
          </span>
        </p>
      </div>
    );
  }
}

export default Result;
