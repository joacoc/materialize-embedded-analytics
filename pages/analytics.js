import { useEffect, useState } from 'react';
import Number from '../components/number';
import Table from '../components/table';

export default function Analytics(props) {
    const { config } = props;
    const [{ totalPurchases, countPurchases, bestSellers, totalUsers }, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (config) {
                fetch(`/api/data`, {
                    body: JSON.stringify({ config }),
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).then((r) => {
                    r.json().then((data) => {
                        if (!data || data.error) {
                            console.error("Error: ", data);
                        } else {
                            console.log(data);
                            setData(data);
                        }
                    }).catch(console.error);
                }).catch(console.error).finally(() => setLoading(false));
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, [config]);

    return (
        <div className='w-1/2'>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Number item={{ name: "Total purchases", stat: totalPurchases }}/>
                <Number item={{ name: "Count purchases", stat: countPurchases }}/>
                <Number item={{ name: "Users", stat: totalUsers }}/>
            </dl>
            <div className='mt-10'>
                <Table bestSellers={bestSellers || []} />
            </div>
        </div>
    )
}