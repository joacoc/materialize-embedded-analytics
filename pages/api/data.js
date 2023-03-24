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

        const { host, authorization, ssl, search_path, database } = config;
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
            database: database || "materialize",
            ssl: ssl,
        });

        try {
            await client.connect();
            if (search_path) {
                await client.query(`SET search_path=${search_path}`);
            }
            const totalPurchasesQuery = client.query("SELECT * FROM total_purchases;");
            const countPurchasesQuery = client.query("SELECT * FROM count_purchases;");
            const bestSellersQuery = client.query("SELECT * FROM best_sellers ORDER BY purchases DESC;");
            const totalUsersQuery = client.query("SELECT * FROM total_users;");

            const [
                { rows: [{ total_purchases: totalPurchases }] },
                { rows: [{ count_purchases: countPurchases }] },
                { rows: bestSellers },
                { rows: [{ total_users: totalUsers }] },
            ] = await Promise.all([totalPurchasesQuery, countPurchasesQuery, bestSellersQuery, totalUsersQuery]);

            res.status(200).json({ totalPurchases, countPurchases, totalUsers, bestSellers});
        } catch (err) {
            // console.log(err);
            res.status(500).json({ error: err.toString() });
        }
    }
}