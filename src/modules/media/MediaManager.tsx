import { Dialog } from "@mui/material";
import { useState } from "react";
import AddMediaContent from "@/src/modules/media/contents/AddMediaContent";


export default function MediaManager() {
    const [open, setOpen] = useState(true);

    return (


            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="xl"           // or use fullScreen for 100vw/100vh
                slotProps={{
                    backdrop: {
                        sx: { backdropFilter: "blur(4px)" }
                    }
                }}
                PaperProps={{
                    sx: {
                        height: "calc(100vh - 64px)",   // max height with some breathing room
                        m: "20px",                       // margin acts as your padding from screen edge
                        width: "calc(100% - 40px)",      // account-old for the margins
                        maxWidth: "none",               // override MUI's maxWidth restriction
                    }
                }}
            >
                <AddMediaContent onClose={() => setOpen(false)} onInsert={(items) => console.log(items)} />
            </Dialog>
    );
}