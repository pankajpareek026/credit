import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CircularProgress } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomModal(
    { openModal,
        setOpenModal,
        closeModal,
        modalType,
        content,
        isTitle,
        title,
        isHelperText,
        helperText,
        firstButtonName,
        secondButtonName,
        firstButtonType,
        secodButtonType,
        isSecondButton,
        isFirstButton,
        firstOnClick,
        secodOnClick,
        closeOutSideClick = false,
        isFirstDisabled,
        isSecondDisabled,
        isFirstLoading,
        isSecondLoading,
        isTnxDetailDialog = false,
        maxW = "470px",

        secodLoadingText }) {


    const handleClickOpen = () => {
        setOpenModal(true);
    };

    const modalTitleColors = {
        confirm: "red",
        success: "rgb(20, 241, 149)",
        input: "rgb(20, 241, 149)",
        close: "#808080"
    }


    const buttonTypes = {
        close: {
            border: "2px solid rgb(66,85,141)",
            color: "rgb(217,221,232)",
            // backgroundColor: "rgb(66,85,141)",
            ":hover": {
                border: "2px solid ",
                color: "white"
            }
        },
        action: {
            border: "2px solid rgb(20, 241, 149)",
            backgroundColor: isSecondLoading ? "grey" : "rgb(20, 241, 149)",
            color: "black", ":hover": { color: "rgb(20, 241, 149)" }
        },
        delete: {

            border: "2px solid rgb(227,0,34)",
            backgroundColor: isSecondLoading ? "grey" : "rgb(227,0,34)",
            color: "white", ":hover": { color: "rgb(227,0,34)" }

        }
    };


    const handleClose = (e) => {

        closeModal()
        return
    };

    return (
        <React.Fragment>
            <Dialog
                open={openModal}
                maxWidth="700px"
                width="350px"
                TransitionComponent={Transition}
                keepMounted
                onClose={(e) => handleClose(e)}
                aria-describedby="alert-dialog-slide-description"
                style={{ backdropFilter: "blur(5px)", height: "auto" }}

                PaperProps={{
                    style: {
                        backgroundColor: '#1E1E1E',
                        color: "white",
                        borderRadius: "25px",
                        width: isTnxDetailDialog ? "350px" : "auto",
                        maxWidth: isTnxDetailDialog ? "750px" : "auto",
                        height: "fit-content",
                    },
                }}>
                <DialogTitle p={0} style={{ color: modalTitleColors[modalType], textAlign: "center", fontSize: "1.5rem" }}>{title}</DialogTitle>
                <hr />

                <DialogContent>
                    <DialogContentText
                        style={{ color: "white" }} id="alert-dialog-slide-description">
                        {isHelperText && helperText}
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", width: "85%", marginLeft: "auto", marginRight: "auto", justifyContent: "space-between", padding: ".8rem" }}>
                    {isFirstButton &&
                        (<Button startIcon={isFirstLoading && <CircularProgress />}
                            disabled={isFirstLoading}

                            sx={buttonTypes[firstButtonType]}
                            onClick={(e) => {
                                e.stopPropagation();
                                firstOnClick();
                            }}>{firstButtonName}</Button>)}

                    {isSecondButton &&

                        (<Button
                            disabled={isSecondLoading}
                            startIcon={isSecondLoading && <CircularProgress size="1rem" style={{ color: "rgb(20, 241, 149)" }} />}
                            sx={buttonTypes[secodButtonType]}

                            onClick={secodOnClick}>{secondButtonName}</Button>)}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

}