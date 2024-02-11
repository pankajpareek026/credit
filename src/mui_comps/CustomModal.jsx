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
        modalType,
        content,
        isTitle,
        title,
        headerContent,
        firstButtonName,
        secondButtonName,
        firstButtonType,
        secodButtonType,
        isSecondButton,
        isFirstButton,
        firstOnclick,
        secodOnClick,
        ousideClose = true,
        isFirstDisabled,
        isSecondDisabled,
        isFirstLoading,
        isSecondLoading,

        secondBtnText,
        secodLoadingText }) {


    const handleClickOpen = () => {
        setOpenModal(true);
    };
    const modalTitleColors = {
        confirm: "red",
        succcess: "rgb(20, 241, 149)",
        input: "rgb(20, 241, 149)",
        close: "#808080"
    }

    const handleClose = () => {
        setOpenModal(false)
    };

    return (
        <React.Fragment>
            <Dialog disableBackdropClick
                open={openModal}
                maxWidth="sm"
                width="sm"
                TransitionComponent={Transition}
                keepMounted
                // {onClose={handleClose}}
                aria-describedby="alert-dialog-slide-description"
                style={{ backdropFilter: "blur(5px)", height: "auto" }}
                PaperProps={{
                    style: {
                        backgroundColor: '#1E1E1E',
                        color: "white",
                        borderRadius: "25px",
                        maxWidth: "310px",
                        height: "fit-content",
                    },
                }}>
                <DialogTitle p={0} style={{ color: modalTitleColors[modalType], textAlign: "center", fontSize: "1.5rem" }}>{title}</DialogTitle>
                <hr />
                <DialogContent>
                    <DialogContentText
                        style={{ color: "white" }} id="alert-dialog-slide-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: "flex", width: "85%", marginLeft: "auto", marginRight: "auto", justifyContent: "space-between", padding: ".8rem" }}>
                    {isFirstButton && <Button startIcon={isFirstLoading && <CircularProgress />} disabled={isFirstLoading} variant='outlined' sx={{ color: modalTitleColors[firstButtonType], backgroundColor: "black", borderColor: modalTitleColors[firstButtonType] }} onClick={handleClose}>{firstButtonName}</Button>}
                    {isSecondButton && <Button disabled={isSecondLoading} startIcon={isSecondLoading && <CircularProgress size="1rem" style={{ color: "rgb(20, 241, 149)" }} />} sx={{ border: "2px solid rgb(20, 241, 149)", backgroundColor: isSecondLoading ? "grey" : "rgb(20, 241, 149)", color: "black", ":hover": { color: "rgb(20, 241, 149)" } }} variant='success' onClick={secodOnClick}>{secondButtonName}</Button>}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
