import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import OrderRow from './OrderRow';
import img from '../../assets/images/checkout/checkout.png'


const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetch(`http://localhost:9000/orders?email=${user?.email}`)
            .then(res => res.json())
            .then(data => setOrders(data))
    }, [user?.email])

    const handleDelete = id => {
        const proceed = window.confirm('Are yo sure , you want to cancel this order? ')
        if (proceed) {
            fetch(`http://localhost:9000/orders/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        alert("Deleted successfully");
                        const remaining = orders.filter(odr => odr._id !== id);
                        setOrders(remaining);
                    }
                })
        }
    }

    const handleStatusUpdate = id => {
        fetch(`http://localhost:9000/orders/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ status: 'Approved' })

        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.modifiedCount > 0) {
                    const remaining = orders.filter(odr => odr._id !== id)
                    const approving = orders.find(odr => odr._id === id);
                    approving.status = 'Approved'

                    const newOrders = [approving, ...remaining];
                    setOrders(newOrders);
                }
            })
    }

    return (
        <div>
            <div className='py-5'>
                <img src={img} alt="" className="w-full rounded-xl" />
            </div>
            <div className='absolute flex transform -translate-y-1/2 left-24 bottom-1/2'>
                <h1 className='text-white font-bold text-4xl'>
                    Cart Details
                </h1>
            </div>

            <div className="overflow-x-auto w-full py-9">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Favorite Color</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map(order => <OrderRow
                                key={order._id}
                                order={order}
                                handleDelete={handleDelete}
                                handleStatusUpdate={handleStatusUpdate}
                            ></OrderRow>)
                        }
                    </tbody>

                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Favorite Color</th>
                            <th></th>
                        </tr>
                    </tfoot>

                </table>
            </div >
        </div >
    );
};

export default Orders;