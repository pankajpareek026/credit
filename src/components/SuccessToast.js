import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SuccessToast(message, position) {
    toast.success(`${message}`, {
        position: position ? position : "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
    });

}
export default SuccessToast;