import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo, clearMessage }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

  // Updates the state with on changed input
  const assignmentUpdate = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    // Prop to clear parent message (Kept displaying delete message)
    clearMessage();
    setMessage('');
    setAssignment({ secNo, title: '', dueDate: '' });
    dialogRef.current.showModal();
  };

  // Closes the modal and invokes passed function prop onClose
  const editClose = () => {
    dialogRef.current.close();
    onClose();
  };

  // Sends updated assignment data to the backend using the gradebook POST /assignments API
  const saveAssignment = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok) {
        const data = await response.json(); 
        setMessage("Assignment Added. id=" + data.id);
      } else {
        const body = await response.json();
        setMessage(body);
        console.log(assignment.dueDate)
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <>
      <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
      <dialog ref={dialogRef} >
        <h2>Add Assignment</h2>
        <Messages response={message} />
        
        <input type="text" name="title" value={assignment.title} placeholder='Title' onChange={assignmentUpdate} />
        <input type="date" name="dueDate" value={assignment.dueDate} onChange={assignmentUpdate}/>

        <button onClick={editClose}>Close</button>
        <button onClick={saveAssignment}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentAdd;
