import * as React from 'react';
import {useTranslation} from "react-i18next";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function LogoutDialog({open, onClose, onLogout}: LogoutDialogProps) {
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{t('account.logout_dialog.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {t('account.logout_dialog.description')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{borderRadius: '9px', textTransform: 'none', fontSize: '1rem'}}

                    variant="outlined"
                        color="primary"
                        onClick={onClose}>{t('account.logout_dialog.cancel')}</Button>
                    <Button
                        variant="contained"
                        sx={{borderRadius: '9px', textTransform: 'none', fontSize: '1rem'}}

                        onClick={onLogout} color="error">{t('account.logout_dialog.confirm')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
