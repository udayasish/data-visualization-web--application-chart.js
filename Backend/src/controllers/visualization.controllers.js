import mongoose from "mongoose";

const getTotalSales = async (req, res) => {
  try {
    const { interval = "monthly" } = req.query;
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("shopifyOrders");

    let groupBy = {};
    switch (interval) {
      case "daily":
        groupBy = {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
      case "monthly":
        groupBy = {
          $dateToString: {
            format: "%Y-%m",
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
      case "quarterly":
        groupBy = {
          year: { $year: { $dateFromString: { dateString: "$created_at" } } },
          quarter: {
            $ceil: {
              $divide: [
                { $month: { $dateFromString: { dateString: "$created_at" } } },
                3,
              ],
            },
          },
        };
        break;
      case "yearly":
        groupBy = {
          $dateToString: {
            format: "%Y",
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
    }

    const result = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: groupBy,
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesGrowthRate = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("shopifyOrders");

    // Aggregation pipeline
    const result = await ordersCollection
      .aggregate([
        // Stage 1: Convert string dates to Date objects and group by month
        {
          $addFields: {
            createdAtDate: { $dateFromString: { dateString: "$created_at" } },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAtDate" } },
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        },
        // Stage 2: Sort by month
        { $sort: { _id: 1 } },
        // Stage 3: Create an array of sales by month
        {
          $group: {
            _id: null,
            sales: { $push: { month: "$_id", sales: "$totalSales" } },
          },
        },
        // Stage 4: Calculate growth rates
        {
          $project: {
            _id: 0,
            growthRates: {
              $map: {
                input: { $range: [1, { $size: "$sales" }] },
                as: "index",
                in: {
                  month: { $arrayElemAt: ["$sales.month", "$$index"] },
                  growthRate: {
                    $multiply: [
                      {
                        $subtract: [
                          {
                            $divide: [
                              { $arrayElemAt: ["$sales.sales", "$$index"] },
                              {
                                $arrayElemAt: [
                                  "$sales.sales",
                                  { $subtract: ["$$index", 1] },
                                ],
                              },
                            ],
                          },
                          1,
                        ],
                      },
                      100,
                    ],
                  },
                },
              },
            },
          },
        },
        // Stage 5: Unwind growthRates array to individual documents
        { $unwind: "$growthRates" },
        // Stage 6: Filter out null growth rates
        { $match: { "growthRates.growthRate": { $ne: null } } },
      ])
      .toArray();

    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewCustomers = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const customersCollection = db.collection("shopifyCustomers");

    const result = await customersCollection
      .aggregate([
        {
          $project: {
            createdAt: {
              $dateFromString: { dateString: "$created_at" },
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            newCustomers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRepeatCustomers = async (req, res) => {
  try {
    const { interval = "monthly" } = req.query;
    const db = mongoose.connection.db;
    const ordersCollection = db.collection("shopifyOrders");

    let groupBy = {};
    switch (interval) {
      case "daily":
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
        };
        break;
      case "monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$created_at" } };
        break;
      case "quarterly":
        groupBy = {
          year: { $year: "$created_at" },
          quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } },
        };
        break;
      case "yearly":
        groupBy = { $dateToString: { format: "%Y", date: "$created_at" } };
        break;
      default:
        throw new Error("Invalid interval specified.");
    }

    const result = await ordersCollection
      .aggregate([
        {
          $project: {
            created_at: {
              $dateFromString: { dateString: "$created_at" },
            },
            customerId: "$customer.id",
          },
        },
        {
          $group: {
            _id: {
              timeFrame: groupBy,
              customerId: "$customerId",
            },
            orderCount: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.timeFrame",
            repeatCustomers: {
              $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGeographicalDistribution = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const customersCollection = db.collection("shopifyCustomers");

    const result = await customersCollection
      .aggregate([
        {
          $match: {
            "default_address.city": { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$default_address.city",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerLifetimeValue = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const customersCollection = db.collection("shopifyCustomers");
    const ordersCollection = db.collection("shopifyOrders");

    const result = await customersCollection
      .aggregate([
        // Lookup orders to get all orders for each customer
        {
          $lookup: {
            from: "shopifyOrders",
            localField: "id",
            foreignField: "customer.id",
            as: "orders",
          },
        },
        // Unwind the orders array to work with individual orders
        { $unwind: "$orders" },
        // Project fields to create cohort based on the first purchase and calculate total spent
        {
          $project: {
            cohort: {
              $dateToString: {
                format: "%Y-%m",
                date: { $dateFromString: { dateString: "$orders.created_at" } },
              },
            },
            totalSpent: { $toDouble: "$orders.total_price" },
          },
        },
        // Group by cohort and calculate average lifetime value
        {
          $group: {
            _id: "$cohort",
            averageLifetimeValue: { $avg: "$totalSpent" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getTotalSales,
  getSalesGrowthRate,
  getNewCustomers,
  getRepeatCustomers,
  getGeographicalDistribution,
  getCustomerLifetimeValue,
};
