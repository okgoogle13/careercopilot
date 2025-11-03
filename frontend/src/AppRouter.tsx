import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ExamplePage from './pages/ExamplePage';

const AppRouter: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/example" component={ExamplePage} />
      <Route path="*">
        <div>Default Route</div>
      </Route>
    </Switch>
  </Router>
);

export default AppRouter;
