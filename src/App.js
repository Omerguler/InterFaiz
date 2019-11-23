//import { Module } from "module";

import React, { Component } from "react";

import Home from "./components/Home";
import NavBar from "./components/NavBar";
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Home />
      </React.Fragment>
    );
  }
}
export default App;
