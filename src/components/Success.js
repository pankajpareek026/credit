import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Success(message) {
    toast.success(`${message}`, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });

}
export default Success;