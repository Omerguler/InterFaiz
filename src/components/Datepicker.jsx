import React, { Component } from "react";
import DatePicker from "react-date-picker";
import "./Home.css";
class Dateinput extends Component {
  render() {
    return (
      <React.Fragment>
        <DatePicker
          className="date-input input-round"
          format="dd/M/yyyy"
          onChange={this.props.onValörChange}
          value={this.props.valör}
          locale="tr-TR"
          clearIcon={null}
        ></DatePicker>
        <DatePicker
          className="date-input input-round"
          format="dd/M/yyyy"
          value={this.props.lastDay}
          locale="tr-TR"
          clearIcon={null}
          onChange={this.props.onLastDayChange}
        ></DatePicker>
      </React.Fragment>
    );
  }
}

export default Dateinput;
