import config from '@/src/config';

export default function DatabasePage() {
    return (
        <div className={'w-full h-full'}>
            <iframe
                src={config.PRISMA_STUDIO_URL}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                }}
            />
        </div>
    );
}