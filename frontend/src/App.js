import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPage from './pages/Admin/AdminPage';
import CashierPage from './pages/Cashier/CashierPage';
import FinancePage from './pages/Finance/FinancePage';
import MarketingPage from './pages/Marketing/MarketingPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/admin" component={AdminPage} />
                <Route path="/cashier" component={CashierPage} />
                <Route path="/finance" component={FinancePage} />
                <Route path="/marketing" component={MarketingPage} />
                <Route path="/" exact component={() => <div>Welcome to the Business Management System</div>} />
            </Switch>
        </Router>
    );
}

export default App; 