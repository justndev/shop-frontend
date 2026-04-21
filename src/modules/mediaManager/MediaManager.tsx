import { Dialog } from "@mui/material";
import { useState } from "react";
import MediaManagerSidebar from "@/src/modules/mediaManager/components/MediaManagerSidebar";
import AddMediaContent from "@/src/modules/mediaManager/contents/AddMediaContent";

export default function MediaManager() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Add media");

    function handleSelect(val: string) {
        setSelected(val);
    }

    function getContent() {
        switch (selected) {
            case "Add media":
                return <AddMediaContent onClose={() => setOpen(false)} onInsert={(items) => console.log(items)} />
        }
        return <div style={{height: '100%'}}>
        </div>
    }

    return (
        <div>


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
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", height: "100%" }}>
                    <MediaManagerSidebar onClose={() => {}} mobileOpen={false} handleSelect={handleSelect} selected={selected} />
                    {getContent()}
                </div>
            </Dialog>
        </div>
    );
}