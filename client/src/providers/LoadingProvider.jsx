import { usePublicContext } from "./PublicContextProvider";
import { ThreeDots } from "react-loader-spinner";

export default function LoadingProvider({ children }) {
  const { isLoading } = usePublicContext();

  return (
    <>
      {isLoading && (
        <div className='relative'>
          <div
            style={{
              backgroundColor: "#fff",
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: "0",
              left: "0",
              zIndex: "99",
              opacity: 0.8,
            }}
          ></div>
          <div
            style={{
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: "0",
              left: "0",
              bottom: "0",
              zIndex: "100",
            }}
          >
            <ThreeDots
              color='#1B1525'
              strokeWidth='3'
              animationDuration='1.5'
              width='60'
              visible={true}
            />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
