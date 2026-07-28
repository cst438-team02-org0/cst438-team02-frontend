import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose, clearMessage }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  // Updates the state upon input change
  const assignmentChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    clearMessage();
    setMessage('');
    setAssignment(editAssignment);
    dialogRef.current.showModal();
  };
  
  // Closes dialog and invokes onClose() function prop
  const editClose = () => {
    dialogRef.current.close();
    onClose();
  };

  // Sends updated assignment data to the backend using the gradebook PUT /assignments API
  const updateAssignment = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok) {
        setMessage("Assignment Updated");
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <>
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        <h2>Edit Assignment</h2>
        <Messages response={message} />
        <input type="text" name="id" value={assignment.id} placeholder='ID' readOnly />
        <input type="text" name="title" value={assignment.title} placeholder='Title' onChange={assignmentChange} />
        <input type="date" name="dueDate" value={assignment.dueDate} onChange={assignmentChange}/>
        <button onClick={editClose}>Close</button>
        <button onClick={updateAssignment}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentUpdate;
