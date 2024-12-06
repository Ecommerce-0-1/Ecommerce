import { useState } from "react";

const DropdownComponent = ({ onSelectComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onSelectComponent(selectedValue); // Pass selected component to parent
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const style = "px-4 py-2 hover:bg-gray-100 cursor-pointer";
  return (
    <div className='relative'>
      <h2 className='mb-2 text-lg font-bold'>Select The Section:</h2>
      <div className='relative'>
        <button
          className='mb-3 block w-full rounded-md border bg-white px-4 py-3 shadow-sm focus:border-blue-400 focus:outline-none'
          onClick={toggleDropdown}
        >
          {selectedOption || "All Sections"}
        </button>
        {isOpen && (
          <div className='absolute left-0 top-full z-10 max-h-44 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md transition duration-300 ease-in-out'>
            <ul className='py-1'>
              <li
                className={style}
                onClick={() => handleOptionChange({ target: { value: "" } })}
              >
                All Sections
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 1" } })
                }
              >
                Section 1
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 2" } })
                }
              >
                Section 2
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 3" } })
                }
              >
                Section 3
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 4" } })
                }
              >
                Section 4
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 5" } })
                }
              >
                Section 5
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 6" } })
                }
              >
                Section 6
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Section 7" } })
                }
              >
                Section 7
              </li>
              <li
                className={style}
                onClick={() =>
                  handleOptionChange({ target: { value: "Footer" } })
                }
              >
                Footer
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownComponent;
