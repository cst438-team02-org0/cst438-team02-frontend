import { useState } from 'react';

// prompt for year, semester
//  props
//  buttonText -- the text to display on a button
//  onClick -- the function to process a button click

function SelectTerm({ onClick, buttonText }) {

    const [term, setTerm] = useState({ year: '', semester: '' });

    const onChange = (e) => {
        setTerm({ ...term, [e.target.name]: e.target.value });
    }

    const onButtonClick = () => {
        const normalized = {
            ...term,
            semester: term.semester.charAt(0).toUpperCase() + term.semester.slice(1).toLowerCase()
        };
        onClick(normalized);
    }
    
    return (
        <>
            <input id="year" type="text" name="year" value={term.year} placeholder="year" onChange={onChange} />
            <input id="semester" type="text" name="semester" value={term.semester} placeholder="semester" onChange={onChange} />
            <button id="selectTermButton" onClick={onButtonClick}>{buttonText}</button>
        </>
    )

}

export default SelectTerm;