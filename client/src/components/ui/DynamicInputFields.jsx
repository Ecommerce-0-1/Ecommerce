import React, { useEffect, useState } from "react";
import Label from "./custom-inputs/Label";
import CustomInput from "./custom-inputs/CustomInput";
import ErrorFormik from "./ErrorFormik";
import { toast } from "react-toastify";
import FilledButton from "./buttons/FilledButton";

export default function DynamicInputFields({
  onChange,
  val,
  errors,
  touched,
  inputFields,
  fieldName,
  textButton,
}) {
  const [fields, setFields] = useState(val);

  const handleChange = (index, field, value) => {
    const values = [...fields];
    values[index] = value;
    setFields(values);
    onChange(values);
  };

  // const handleAddFields = () => {
  //     if (!Array.isArray(fields)) {
  //         toast.error("Something went wrong, please try later!");
  //         return;
  //     }
  //     setFields([
  //         ...fields,
  //         "",
  //     ]);
  // };

  const handleRemoveFields = (index) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
    onChange(values);
  };

  useEffect(() => {
    setFields(val);
  }, [val]);

  return (
    <div>
      {fields?.map((field, index) => (
        <div key={index}>
          <div className='row g-3 justify-content-center'>
            {inputFields?.map((input, inputIndex) => (
              <div
                className={`${fields.length > 1 ? "col-lg-5" : "col-lg-6"}`}
                key={inputIndex}
              >
                <Label
                  forId={input.id}
                  text={`${input.label} ${index + 1}`}
                  isRequired={input.isRequired}
                />
                <div className='mt-2 flex justify-end'>
                  <button
                    type='button'
                    onClick={() => handleRemoveFields(index)}
                    className='font-medium text-red-600 hover:text-red-800'
                  >
                    Remove Feature
                  </button>
                </div>
                <CustomInput
                  placeholder={input.placeholder}
                  id={input.id}
                  name={input.name}
                  type={input.type}
                  value={field}
                  onChange={(event) =>
                    handleChange(index, input.name, event.target.value)
                  }
                  className='w-full'
                  isDisable={input?.isDisable}
                  shape={3}
                />
                <ErrorFormik
                  isError={
                    errors?.[fieldName] &&
                    errors?.[fieldName]?.[index]?.[input.name]
                  }
                  isTouched={
                    touched?.[fieldName] &&
                    touched?.[fieldName]?.[index]?.[input.name]
                  }
                  error={
                    errors?.[fieldName] &&
                    errors?.[fieldName]?.[index]?.[input.name]
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className='d-flex justify-content-end mt-3'>
        {/* <div className="flex justify-center mt-8">
                    <FilledButton
                        text='Add Feature'
                        isButton={true}
                        onClick={handleAddFields}
                        buttonType="button"
                        className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
                        width='w-fit'
                    />
                </div> */}
      </div>
    </div>
  );
}
