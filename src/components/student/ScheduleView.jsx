import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  // Lex: altered starter code to make more user-friendly (ex. fall vs. Fall)
  const prefetchEnrollments = ({ year, semester }) => {
  semester =
    semester.charAt(0).toUpperCase() +
    semester.slice(1).toLowerCase();

  setTerm({ year, semester });
  fetchEnrollments(year, semester);
}

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

    const dropCourse = async (enrollmentId) => {
    try {
      const response = await fetch(
        `${REGISTRAR_URL}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setMessage('Course dropped successfully.');
        fetchEnrollments(term.year, term.semester);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }
    const confirmDrop = (enrollmentId) => {
    confirmAlert({
      title: 'Confirm Drop',
      message: 'Are you sure you want to drop this course?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropCourse(enrollmentId)
        },
        {
          label: 'No'
        }
      ]
    });
  }

    const headings = [
    'Enrollment ID',
    'Section No',
    'Course ID',
    'Section',
    'Building',
    'Room',
    'Times',
    ''
  ];

  return (
    <div className="Center">
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
            <table className="Center">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.enrollmentId}>
              <td>{enrollment.enrollmentId}</td>
              <td>{enrollment.sectionNo}</td>
              <td>{enrollment.courseId}</td>
              <td>{enrollment.sectionId}</td>
              <td>{enrollment.building}</td>
              <td>{enrollment.room}</td>
              <td>{enrollment.times}</td>
              <td>
                <button
                  onClick={() => confirmDrop(enrollment.enrollmentId)}
                >
                  Drop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default ScheduleView;