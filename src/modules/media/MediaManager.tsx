import {Dialog} from "@mui/material";
import AddMediaContent from "@/src/modules/media/contents/AddMediaContent";
import {useAppContext} from "@/src/context/AppContext";


export default function MediaManager() {
    const {showMediaManager, closeMediaManager, onMediaInsert} = useAppContext();

    return (
        <Dialog
            open={showMediaManager}
            onClose={closeMediaManager}
            fullWidth
            maxWidth="xl"           // or use fullScreen for 100vw/100vh
            slotProps={{
                backdrop: {
                    sx: {backdropFilter: "blur(4px)"}
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
            <AddMediaContent onClose={closeMediaManager} onInsert={onMediaInsert}/>
        </Dialog>
    );
}