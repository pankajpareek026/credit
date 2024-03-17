import { TextField } from '@mui/material'
import React, { forwardRef, useEffect } from 'react'

const MuiInputBox = forwardRef((props, ref) => {
    const { InpVariant = "outlined",
        isRequired,
        label,
        isDisabled,
        placeHolder,
        inpValue,
        isReadOnly,
        onChangeFn,
        inputValue,
        inputType,
        isError, errorInfo, onKeyPress, } = props
    const inputHandler = (e) => {
        // e.stopPropagation()
        onChangeFn(e.target.value)

    }
    useEffect(() => {

    })
    return (

        <TextField

            sx={{
                maxWidth: "99%",
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
            inputProps={{
                readOnly: isReadOnly,
                style: {
                    color: 'white', height: "auto", overflow: "hidden"
                }
            }}
            label={label}
            variant={InpVariant}
            placeholder={placeHolder}
            id="outlined-disabled"
            onChange={inputHandler}
            onKeyDown={onKeyPress}
            inputRef={ref}
            type={inputType}
        />


    )
})

export default MuiInputBox