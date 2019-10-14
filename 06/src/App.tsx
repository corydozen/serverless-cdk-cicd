import React from "react";
import { BrowserRouter } from "react-router-dom";

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>CDK CICD</h1>
      </div>
    );
  }
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default () => <AppWithRouter />;
