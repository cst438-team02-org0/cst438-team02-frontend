import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  // Clear parent message upon opening modal
  const clearMessage = () => setMessage('');

  // Fetch data using the gradebook GET /sections/{secNo}/assignments API
  // Instructor fetches assignments for a section
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("jwt"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, []);

  // Send a delete to the endpoint /assignments/{assignmentId} api
  // Instructor deletes an assignment based off assignment id
  const deleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("Assignment deleted");
        fetchAssignments();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  // Create an alert cofirmation message when pressing the delete button
  const onDelete = (assignmentId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteAssignment(assignmentId),
        },
        {
          label: "No",
        },
      ],
    });
  };


  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
    <div>
      <h3> {courseId}-{secId} Assignments</h3>
      <Messages response={message} />
      {/* If there are no assignments display a message, otherwise display rows of
      the assignment */}
      {assignments.length === 0  ? (<p>There are currently no assignments for this section.</p>) : (
      <table className="Center" >
        <thead>
          <tr>
            {headers.map((a, idx) => (<th key={idx}>{a}</th>))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.dueDate}</td>
              {/* Invoke the Assignment Grade and Update to render appropriate menus
              Added a prop to accept a clear message for the parent component*/}
              <td><AssignmentGrade assignment={a} clearMessage={clearMessage} /></td>
              <td><AssignmentUpdate editAssignment={a} onClose={fetchAssignments} clearMessage={clearMessage} /></td>
              <td><button onClick={() => onDelete(a.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      
      {/* Added a prop to clear parent message */}
      <AssignmentAdd secNo={secNo} onClose={fetchAssignments} clearMessage={clearMessage}/>
    </div>
  );
}

export default AssignmentsView;
