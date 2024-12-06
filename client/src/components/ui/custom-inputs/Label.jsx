export default function Label({ text, isRequired = false, forId, className }) {
  return (
    <label
      className={`mb-[4px] mt-4 block text-sm font-medium ${className}`}
      htmlFor={forId}
    >
      <span className='text-grayscale_3 text-custom-xs leading-custom-24 select-none'>
        {text}
      </span>
      {isRequired && (
        <span className='text-custom-xs leading-custom-24 text-red-500'>
          {" "}
          *
        </span>
      )}
    </label>
  );
}
