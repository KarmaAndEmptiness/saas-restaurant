import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPage from './pages/Admin/AdminPage';
import CashierPage from './pages/Cashier/CashierPage';
import FinancePage from './pages/Finance/FinancePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import EmployeeManagementPage from './pages/Admin/EmployeeManagementPage';
import MemberManagementPage from './pages/Cashier/MemberManagementPage';
import FinancialStatisticsPage from './pages/Finance/FinancialStatisticsPage';
import MemberDataAnalysisPage from './pages/Marketing/MemberDataAnalysisPage';
import PermissionManagementPage from './pages/Admin/PermissionManagementPage';
import RechargeConsumptionPage from './pages/Cashier/RechargeConsumptionPage';
import InterStoreSettlementPage from './pages/Finance/InterStoreSettlementPage';
import MarketingActivityDesignPage from './pages/Marketing/MarketingActivityDesignPage';
import WarningManagementPage from './pages/Admin/WarningManagementPage';
import LogMonitoringPage from './pages/Admin/LogMonitoringPage';
import ConfigurationManagementPage from './pages/Admin/ConfigurationManagementPage';
import ArchiveMaintenancePage from './pages/Admin/ArchiveMaintenancePage';
import PointsManagementPage from './pages/Cashier/PointsManagementPage';
import PasswordManagementPage from './pages/Cashier/PasswordManagementPage';
import FrontDeskQueryPage from './pages/Cashier/FrontDeskQueryPage';
import DataExportPage from './pages/Finance/DataExportPage';
import CustomReportPage from './pages/Finance/CustomReportPage';
import MarketingEffectAnalysisPage from './pages/Marketing/MarketingEffectAnalysisPage';
import TargetUserSelectionPage from './pages/Marketing/TargetUserSelectionPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/admin" component={AdminPage} />
                <Route path="/admin/employee-management" component={EmployeeManagementPage} />
                <Route path="/admin/permission-management" component={PermissionManagementPage} />
                <Route path="/admin/warning-management" component={WarningManagementPage} />
                <Route path="/admin/log-monitoring" component={LogMonitoringPage} />
                <Route path="/admin/configuration-management" component={ConfigurationManagementPage} />
                <Route path="/admin/archive-maintenance" component={ArchiveMaintenancePage} />
                <Route path="/cashier" component={CashierPage} />
                <Route path="/cashier/member-management" component={MemberManagementPage} />
                <Route path="/cashier/recharge-consumption" component={RechargeConsumptionPage} />
                <Route path="/cashier/points-management" component={PointsManagementPage} />
                <Route path="/cashier/password-management" component={PasswordManagementPage} />
                <Route path="/cashier/front-desk-query" component={FrontDeskQueryPage} />
                <Route path="/finance" component={FinancePage} />
                <Route path="/finance/financial-statistics" component={FinancialStatisticsPage} />
                <Route path="/finance/inter-store-settlement" component={InterStoreSettlementPage} />
                <Route path="/finance/data-export" component={DataExportPage} />
                <Route path="/finance/custom-report" component={CustomReportPage} />
                <Route path="/marketing" component={MarketingPage} />
                <Route path="/marketing/member-data-analysis" component={MemberDataAnalysisPage} />
                <Route path="/marketing/marketing-activity-design" component={MarketingActivityDesignPage} />
                <Route path="/marketing/marketing-effect-analysis" component={MarketingEffectAnalysisPage} />
                <Route path="/marketing/target-user-selection" component={TargetUserSelectionPage} />
                <Route path="/" exact component={() => <div>Welcome to the Business Management System</div>} />
            </Switch>
        </Router>
    );
}

export default App; 