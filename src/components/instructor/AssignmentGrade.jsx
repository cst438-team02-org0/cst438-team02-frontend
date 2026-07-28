import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment, clearMessage }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();

  // Updates the state with on changed input
  // Since grades is an array we need to iterate through it to update the grade's score
  // and if the id matches update the score else leave it as is
  const gradeUpdate = (gradeId, newScore) => {
    setGrades(gradeArray => 
      gradeArray.map((g) => g.gradeId === gradeId ? {...g, score: newScore} : g 
    ));
  };

  // Open the modal, clears the parent message, fetches grades
  const editOpen = () => {
    clearMessage();
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    dialogRef.current.showModal();
  };

  // Close the modal
  const editClose = () => {
    dialogRef.current.close();
  };

  // Send a GET message to the endpoint to receive a list of GradeDTO, given as an array
  // Fetches current Grades(gradeDTO) for an assignment for all students enrolled in the section
  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  // Sends updated grade data to the backend using the gradebook PUT /grades API
  const saveGrade = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(grades),
      });
      if (response.ok) {
        setMessage("Grades updated.");
      } else {
        const body = await response.json();
        setMessage("Invalid entry. Please Enter a score 0-100");
        console.log(assignment.dueDate)
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
    <>
      <button id="gradeButton" onClick={editOpen}>Grade</button>
      <dialog ref={dialogRef}>
        <h3>Grade Assignment</h3>
        <Messages response={message} />
        {grades.length === 0  ? (    
          <>
            <p>There are currently no students enrolled in this section.</p>
            <button onClick={editClose}>Close</button>
          </>
          ) : (
          <>
          <table className="Center" >
            <thead>
              <tr>
                {headers.map((g, idx) => (<th key={idx}>{g}</th>))}
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.gradeId}>
                  <td>{g.gradeId}</td>
                  <td>{g.studentName}</td>
                  <td>{g.studentEmail}</td>
                  <td><input type='text' placeholder='score' value={g.score} 
                        onChange={(e) => gradeUpdate(g.gradeId, e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={editClose}>Close</button>
          <button onClick={saveGrade}>Save</button>
          </>
        )}
      </dialog>
    </>
  );
}

export default AssignmentGrade;