import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Category} from "@/src/types";

interface DeleteCategoryDialogProps {
    category: Category;
    onClose: () => void;
    onDelete: () => void;
}

export default function AlertDialog({category, onClose, onDelete}: DeleteCategoryDialogProps) {

    return (
        <React.Fragment>
            <Dialog
                open={!!category}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} autoFocus>
                        Disagree
                    </Button>
                    <Button onClick={onDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
