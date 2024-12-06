import React, { useState } from "react";

const CustomDropdown = ({ options, onSelect, name }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <div>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        className='mb-3 block w-full rounded-md border bg-white px-4 py-3 shadow-sm focus:border-blue-400 focus:outline-none'
      >
        {options?.map((option, index) => (
          <option key={index} value={option}>
            {name} {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropdown;
