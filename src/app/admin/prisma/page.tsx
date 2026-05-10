export default function StudioPage() {
    return (
        <div className={'w-full h-full'}>
            <iframe
                src="http://localhost:5555"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                }}
            />
        </div>
    );
}