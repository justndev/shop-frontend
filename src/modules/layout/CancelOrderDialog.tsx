import * as React from 'react';

import {useAppContext} from "@/src/context/AppContext";
import {useTranslation} from "react-i18next";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function CancelOrderDialog() {
    const { t } = useTranslation();
    const { handleConfirm, showCancelOrderDialog, closeCancelOrderDialog } = useAppContext();


    return (
        <React.Fragment>
            <Dialog
                open={showCancelOrderDialog}
                onClose={closeCancelOrderDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('layout.cancel_order.title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('layout.cancel_order.body')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm} autoFocus>
                        {t('layout.cancel_order.confirm')}

                    </Button>
                    <Button onClick={closeCancelOrderDialog}>
                        {t('layout.cancel_order.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
