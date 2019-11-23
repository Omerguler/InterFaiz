import React, { Component } from "react";
import "react-input-range/lib/css/index.css";
import Button from "react-bootstrap/Button";

import "./Home.css";
import Select, { createFilter } from "react-select";
import NumberFormat from "react-number-format";
import Dateinput from "./Datepicker";
//import Button from "@material-ui/core/Button";
import { TextField } from "material-ui/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Graph from "./Graph";
import Result from "./Result";

toast.configure();

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
function errorTest(input, max, minErrorString, maxErrorString, toastId) {
  if (input < 0) {
    input = 0;
    toast.error(minErrorString, {
      toastId: toastId + "min",
      position: toast.POSITION.TOP_CENTER,
      className: "black-background",
      bodyClassName: "grow-font-size",
      autoClose: false
    });
  }
  if (input >= max) {
    input = max - 1;
    toast.error(maxErrorString, {
      toastId: toastId + "max",
      position: toast.POSITION.TOP_CENTER,
      className: "black-background",
      bodyClassName: "grow-font-size",
      autoClose: false
    });
  }
  return input;
}
const options = [
  { value: "TRY", label: "Türk Lirası", symbol: "₺" },
  { value: "USD", label: "Amerikan Doları", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "İngiliz Sterlini", symbol: "£" },
  { value: "CHF", label: "İsviçre Frangı", symbol: "CHF" },
  { value: "CAD", label: "Kanada Doları", symbol: "$" },
  { value: "RUB", label: "Rus Rublesi", symbol: "руб" },
  { value: "AUD", label: "Avustralya Doları", symbol: "$" },
  { value: "DKK", label: "Danimarka Kronu", symbol: "kr" },
  { value: "SEK", label: "İsveç Kronu", symbol: "kr" },
  { value: "NOK", label: "Norveç Kronu", symbol: "kr" },
  { value: "JPY", label: "Japon Yeni", symbol: "¥" }
];

class App extends Component {
  state = {
    amount: 0,
    days: 15,
    selectedOption: null,
    valör: new Date(),
    lastDay: new Date(),
    showGraph: false,
    currencyType: "TRY",
    currencySymbol: "₺",
    interestMoney: 0.0,
    taxAmount: 0.0,
    interestRate: 15,
    interestType: "Kredisiz",
    taxRate: 15,
    data: [
      { name: "1 Gün", money: 0, gün: 1 },
      { name: "15 Gün", money: 0, gün: 15 },
      { name: "45 Gün", money: 0, gün: 45 },
      { name: "90 Gün", money: 0, gün: 90 },
      { name: "180 Gün", money: 0, gün: 180 }
    ]
  };
  constructor() {
    super();
    const { valör } = this.state;
    this.state.lastDay.setDate(valör.getDate() + this.state.days);
  }
  handleShowGraph = () => {
    const showGraph = !this.state.showGraph;
    this.setState({ showGraph });
  };
  handleAmountChange = e => {
    let amount = e.target.value;
    amount = parseFloat(amount.replaceAll(".", "").replaceAll(",", "."));
    amount = errorTest(
      amount,
      1e8,
      "Para miktarı negatif olamaz!",
      "Para miktarı sınırı 100 milyondur!",
      "amount"
    );
    this.setState({ amount });
    const { days, interestRate, interestType } = this.state;
    const interestMoney = this.calculateInterest(
      amount,
      days,
      interestRate,
      interestType
    );
    this.setState({ interestMoney });
    let { data, taxAmount, taxRate } = this.state;
    for (var i in data) {
      data[i].money =
        (parseFloat(
          this.calculateInterest(
            amount,
            data[i].gün,
            interestRate,
            interestType
          )
        ) *
          (100 - taxRate)) /
        100;
    }
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  handleGraphChange = () => {
    const graphType = this.state.graphType === "money" ? "faiz" : "money";
    this.setState({ graphType });
  };
  handleDayChange = e => {
    let days = e.target.value;
    days = errorTest(
      days,
      366,
      "Gün sayısı negatif olamaz!",
      "Gün sayısı en fazla 365 olabilir!",
      "days"
    );
    if (days === "") {
      this.setState({ days });
    } else {
      this.setState({ days });
      const lastDay = new Date();
      lastDay.setDate(this.state.valör.getDate() + parseInt(days));
      this.setState({ lastDay });
    }
    const { amount, interestRate, interestType } = this.state;
    const interestMoney = this.calculateInterest(
      amount,
      days,
      interestRate,
      interestType
    );
    this.setState({ interestMoney });
    let { data, taxAmount, taxRate } = this.state;
    for (var i in data) {
      data[i].money =
        (parseFloat(
          this.calculateInterest(
            amount,
            data[i].gün,
            interestRate,
            interestType
          )
        ) *
          (100 - taxRate)) /
        100;
    }
    this.setState({ data });
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  handleCurChange = selectedOption => {
    const changed =
      selectedOption.value === this.state.currencyType ? true : false;
    const currencySymbol = selectedOption.symbol;
    console.log(changed);
    const currencyType = selectedOption.value;
    this.setState({ currencyType });
    this.setState({ selectedOption });
    this.setState({ currencySymbol });
    if (changed === false) {
      toast.success(`Para birimi ${selectedOption.label} oldu`, {
        position: toast.POSITION.TOP_CENTER,
        className: "black-background",
        bodyClassName: "grow-font-size",
        autoClose: 2000
      });
    }
  };
  handleValörChange = valör => {
    this.setState({ valör: valör });
  };
  handleLastDayChange = lastDay => {
    toast.error("Son günü belirten takvimde değişim yapılamaz!", {
      position: toast.POSITION.TOP_CENTER,
      className: "black-background",
      bodyClassName: "grow-font-size",
      autoClose: false
    });
  };
  handleInterestRateChange = e => {
    let interestRate = e.target.value;
    interestRate = errorTest(
      interestRate,
      100,
      "Faiz oranı negatif olamaz!",
      "Faiz oranı miktarı sınırı %99 dur!",
      "interestRate"
    );
    this.setState({ interestRate });
    const { amount, days, interestType } = this.state;
    const interestMoney = this.calculateInterest(
      amount,
      days,
      interestRate,
      interestType
    );
    this.setState({ interestMoney });
    let { data, taxAmount, taxRate } = this.state;
    for (var i in data) {
      data[i].money =
        (parseFloat(
          this.calculateInterest(
            amount,
            data[i].gün,
            interestRate,
            interestType
          )
        ) *
          (100 - taxRate)) /
        100;
    }
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  handleTaxRateChange = e => {
    let taxRate = e.target.value;
    taxRate = errorTest(
      taxRate,
      100,
      "Vergi oranı negatif olamaz!",
      "Vergi oranı miktarı sınırı %99 dur",
      "taxRate"
    );
    this.setState({ taxRate });
    let { taxAmount, interestMoney } = this.state;
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  handleGetFaiz = () => {
    let { interestMoney } = this.state;
    let amount = interestMoney / 1 + this.state.amount;
    amount = parseFloat(Number(amount).toFixed(2));
    amount = errorTest(
      amount,
      1e8,
      "Para miktarı negatif olamaz!",
      "Para miktarı sınırı 100 milyondur!",
      "amount"
    );
    this.setState({ amount });
    const { days, interestRate, interestType, taxRate } = this.state;
    interestMoney = this.calculateInterest(
      amount,
      days,
      interestRate,
      interestType
    );
    this.setState({ interestMoney });
    let { data, taxAmount } = this.state;
    for (var i in data) {
      data[i].money =
        (parseFloat(
          this.calculateInterest(
            amount,
            data[i].gün,
            interestRate,
            interestType
          )
        ) *
          (100 - taxRate)) /
        100;
    }
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  handleInterestTypeChange = () => {
    let { interestType } = this.state;
    if (interestType === "Kredisiz") {
      interestType = "Vadeli";
    } else {
      interestType = "Kredisiz";
    }
    this.setState({ interestType });
    const { amount, days, interestRate } = this.state;
    const interestMoney = this.calculateInterest(
      amount,
      days,
      interestRate,
      interestType
    );
    this.setState({ interestMoney });
    let { data, taxAmount, taxRate } = this.state;
    for (var i in data) {
      data[i].money =
        (parseFloat(
          this.calculateInterest(
            amount,
            data[i].gün,
            interestRate,
            interestType
          )
        ) *
          (100 - taxRate)) /
        100;
    }
    taxAmount = (interestMoney * taxRate) / 100;
    this.setState({ taxAmount });
  };
  calculateInterest = (amount, days, faiz, interestType) => {
    if (days === "" || amount === "" || faiz === "") {
      return 0;
    }
    let dayAmount = interestType === "Kredisiz" ? 360 : 365;
    let result = Number((amount / 100) * (faiz / dayAmount) * days);
    let resultString = result.toFixed(2);
    return resultString === "NaN" ? 0 : resultString;
  };
  calculateLastDay = valör => {
    const { days } = this.state;
    if (days !== "") {
      const lastDay = new Date();
      lastDay.setDate(this.state.valör.getDate() + parseInt(days));
      return lastDay;
    } else {
      return valör;
    }
  };
  render() {
    const ignoreCase = true;
    const ignoreAccents = false;
    const trim = false;
    const matchFromStart = false;
    const filterConfig = {
      ignoreCase: ignoreCase,
      ignoreAccents,
      trim,
      matchFrom: this.state.matchFromStart ? "start" : "any"
    };
    return (
      <div className="page">
        <div className="row-pane">
          <div className="left">
            <form className="form-group">
              <div className="variable-top">
                <label className="para-miktari variable-names">
                  Para miktarı({this.state.currencySymbol})
                </label>
                <NumberFormat
                  spellCheck={false}
                  className="para-miktari-input input-round padding-amount"
                  customInput={TextField}
                  value={this.state.amount}
                  onChange={this.handleAmountChange}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                />
                <Button
                  style={{ float: "left" }}
                  variant="info"
                  size="small"
                  onClick={this.handleGetFaiz}
                >
                  △
                </Button>
                <div className="currency">
                  <Select
                    isSearchable
                    placeholder="Para birimini giriniz"
                    value={this.state.selectedOption}
                    onChange={this.handleCurChange}
                    options={options}
                    filterOption={createFilter(filterConfig)}
                    getOptionValue={option => option["label"].toLowerCase()}
                  />
                </div>
              </div>
              <div className="variables-pane">
                <div>
                  <label className="variable-names gun-sayisi">
                    Gün Sayısı
                  </label>
                  <input
                    className="input-round"
                    min={0}
                    type="number"
                    value={this.state.days}
                    onChange={this.handleDayChange}
                  />
                </div>
                <div>
                  <Dateinput
                    valör={this.state.valör}
                    lastDay={this.calculateLastDay(this.state.valör)}
                    onValörChange={this.handleValörChange}
                    onLastDayChange={this.handleLastDayChange}
                  ></Dateinput>
                </div>
                <div>
                  <label className="variable-names gun-sayisi">
                    Faiz Oranı(%){" "}
                  </label>
                  <input
                    className="input-round"
                    min={0}
                    type="number"
                    value={this.state.interestRate}
                    onChange={this.handleInterestRateChange}
                  />
                </div>
                <div>
                  <label className="variable-names gun-sayisi">
                    Vergi Oranı(%){" "}
                  </label>
                  <input
                    className="input-round"
                    min={0}
                    type="number"
                    value={this.state.taxRate}
                    onChange={this.handleTaxRateChange}
                  />
                </div>
                <div style={{ marginTop: 40 }}>
                  <label className="variable-names gun-sayisi">
                    Faiz türünü değiştirmek için tıklayın
                  </label>
                  <Button
                    className="graph-button"
                    variant="info"
                    size="small"
                    onClick={this.handleInterestTypeChange}
                  >
                    {this.state.interestType === "Kredisiz"
                      ? "Kredili"
                      : "Mevduat"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="right">
            <Result
              interestMoney={this.state.interestMoney}
              taxAmount={this.state.taxAmount}
              currencySymbol={this.state.currencySymbol}
              NetFaiz={this.state.interestMoney - this.state.taxAmount}
            ></Result>
          </div>
        </div>
        <div className="graph-pane">
          <Button
            className="graph-button"
            variant="info"
            size="small"
            onClick={this.handleShowGraph}
          >
            Grafiği {this.state.showGraph ? "gizle" : "göster"}
          </Button>
          {this.state.showGraph ? (
            <Graph
              data={this.state.data}
              graphType={this.state.graphType}
              onGraphChange={this.handleGraphChange}
              currencySymbol={this.state.currencySymbol}
            ></Graph>
          ) : null}
        </div>
        <ToastContainer
          className="toast-container"
          toastClassName="dark-toast"
        />
      </div>
    );
  }
}

export default App;
