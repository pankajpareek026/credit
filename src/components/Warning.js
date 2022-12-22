import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Warning(message)
{
    toast.warning(`${message}`, {
        position: "top-center",
        autoClose:1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });

}
 export default Warning;