export default function ErrorFormik({ isTouched, isError, error }) {
  return (
    <>
      {isError && isTouched ? (
        <div
          className={`font-weight-medium line-height-normal mt-2 text-sm text-red-500`}
        >
          {error}
        </div>
      ) : null}
    </>
  );
}
