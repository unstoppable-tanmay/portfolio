
const SementicSearchButton = ({
    loading,
    onClick,
}: {
    loading: boolean;
    onClick?: () => void;
}) => {
    return (
        <button
            className={
                loading
                    ? "bg-white max-md:pl-1 pl-2 flex gap-1 p-0.5 items-center justify-center self-center cursor-pointer font-Poppins text-[clamp(10px,0.8vw,18px)] md:mt-2 mt-1 relative animate-pulse"
                    : "bg-white max-md:pl-1 pl-2 flex gap-1 p-0.5 items-center justify-center self-center cursor-pointer font-Poppins text-[clamp(10px,0.8vw,18px)] md:mt-2 mt-1 relative"
            }
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
            }}
        >
            {!loading && (
                <div className="bg absolute w-2 h-2 right-0 translate-x-5 bg-white">
                    <div className="wrapper w-full h-full animate-ping bg-white"></div>
                </div>
            )}
            {loading ? (
                <div className="">Loading AI Search...</div>
            ) : (
                <>
                    Search With
                    <div className="appearance-none outline-none border-none bg-black text-white px-1  flex gap-1 items-center justify-center">
                        AI
                        &#10022;
                    </div>
                </>
            )}
        </button>
    );
};

export default SementicSearchButton;
