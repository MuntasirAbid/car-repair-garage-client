import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import OrderRow from './OrderRow';
import img from '../../assets/images/checkout/checkout.png'


const Orders = () => {
    const { user, logOut } = useContext(AuthContext);
    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetch(`http://localhost:9000/orders?email=${user?.email}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('secretToken')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('secretToken')
                    logOut();
                    alert('Season expired, Please login again')
                }
                return res.json()
            })
            .then(data =>
                // console.log('received', data)

                setOrders(data)
            )


    }, [user?.email, logOut])

    const handleDelete = id => {
        const proceed = window.confirm('Are yo sure , you want to cancel this order? ')
        if (proceed) {
            fetch(`http://localhost:9000/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('secretToken')}`
                }
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
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('secretToken')}`
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
            <div className='absolute flex transform -translate-y-1/2 left-24 top-1/2'>
                <h1 className='text-white font-bold text-4xl'>
                    Cart Details
                </h1>
            </div>

            <p className='font-bold'>You have {orders.length} Orders</p>

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