import express from 'express';
import {
    getTotalSales,
    getSalesGrowthRate,
    getNewCustomers,
    getRepeatCustomers,
    getGeographicalDistribution,
    getCustomerLifetimeValue
} from '../controllers/visualization.controllers.js';

const router = express.Router();

router.get('/total-sales', getTotalSales);
router.get('/sales-growth-rate', getSalesGrowthRate);
router.get('/new-customers', getNewCustomers);
router.get('/repeat-customers', getRepeatCustomers);
router.get('/geographical-distribution', getGeographicalDistribution);
router.get('/customer-lifetime-value', getCustomerLifetimeValue);

export default router;