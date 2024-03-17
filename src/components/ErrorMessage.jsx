import React from 'react'

const ErrorMessage = ({ show = false, message }) => {
    return (
        <>
            {show && <span style={{ color: "red", textAlign: "left", width: "auto" }}>{message}</span>}
        </>
    )
}

export default ErrorMessage