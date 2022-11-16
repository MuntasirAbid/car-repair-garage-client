import Main from "../../layout/Main";
import Checkout from "../../pages/Checkout/Checkout";
import Home from "../../pages/Home/Home/Home";
import Login from "../../pages/Home/Home/Login/Login";
import Register from "../../pages/Home/Home/Register/Register";
import Orders from "../../pages/Orders/Orders";

const { createBrowserRouter } = require("react-router-dom");

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Register></Register>
            },
            {
                path: 'checkout/:id',
                element: <Checkout></Checkout>,
                loader: ({ params }) => fetch(`http://localhost:9000/services/${params.id}`)

            },
            {
                path: '/orders',
                element: <Orders></Orders>
            }

        ]

    }
])

export default router;