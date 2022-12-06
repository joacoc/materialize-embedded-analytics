// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require("pg");

export default async function list(req, res) {
    if (req.method === 'POST') {
        const { body } = req;
        const { config } = body;

        if (!config) {
            res.status(400).json({ error: 'Missing config.' });
            return;
        }

        const { host, authorization, ssl } = config;
        if (!host || !authorization) {
            res.status(400).json({ error: 'Missing config fields.' });
            return;
        }

        const { user, password } = authorization;
        const client = new Client({
            host,
            port: 6875,
            user,
            password,
            database: "materialize",
            ssl: ssl
        });

        try {
            await client.connect();
            const totalSalesQuery = client.query("SELECT * FROM total_sales;");
            const countSalesQuery = client.query("SELECT * FROM count_sales;");
            const bestSellersQuery = client.query("SELECT * FROM best_sellers ORDER BY sells DESC;");
            const openAuctionsQuery = client.query("SELECT * FROM open_auctions;");

            const [
                { rows: [{ total_sales: totalSales }] },
                { rows: [{ count_sales: countSales }] },
                { rows: bestSellers },
                { rows: [{ open_auctions: openAuctions }] },
            ] = await Promise.all([totalSalesQuery, countSalesQuery, bestSellersQuery, openAuctionsQuery]);

            res.status(200).json({ totalSales, countSales, openAuctions, bestSellers});
        } catch (err) {
            res.status(500).json({ error: err.toString() });
        }
    }
}