import { TextField } from '@mui/material'
import React from 'react'

const MuiInputBox = (
    {
        InpVariant = "outlined",
        isRequired,
        label,
        isDisabled,
        placeHolder,
        inpValue,
        isReadOnly,
        onChangeFn,
        inputValue,
        isError, errorInfo }) => {
    const inputHandler = (e) => {
        onChangeFn(e.target.value)
        console.log("state=>", inputValue)
    }
    return (

        <TextField

            sx={{
                "& .MuiOutlinedInput-root": {
                    '& fieldset': {
                        borderColor: 'white',
                        color: "white" // Default border color
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "white",
                    }, '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                    }
                },
            }}
            InputLabelProps={{
                style: { color: 'white', borderColor: 'white' },
            }}
            error={isError}
            helperText={isError ? errorInfo : ""}
            required={isRequired}
            readOnly={isReadOnly}
            disabled={isDisabled}
            value={inpValue}
            defaultValue={inputValue}
            inputProps={{ style: { color: 'white', height: "auto" } }}
            label={label}
            variant={InpVariant}
            placeholder={placeHolder}
            id="outlined-disabled"
            onChange={inputHandler}
        />


    )
}

export default MuiInputBox