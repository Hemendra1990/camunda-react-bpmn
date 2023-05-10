import React, { useState } from 'react';
import './Tasklist.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const TaskList = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const { register, handleSubmit } = useForm();
  const [finalComment, setFinalComment] = useState('');

  const showTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  const handleCompleteTask = () => {
    console.log('Task Completed', selectedTask);
    const taskId = selectedTask.id;
    /* axios.get(`http://localhost:9010/workflow/tasks/${taskId}/complete`)
      .then((response) => {
        console.log('Task Completed', response);
        alert('Task Completed');
      }
    ); */

    axios.post(`http://localhost:9010/workflow/tasks/${taskId}/complete`, {
      ...selectedTask.variables,
      "comment": "This is a comment",
      "Final Comments": finalComment
    }).then((response) => {
      console.log('Task Completed', response);
      alert('Task Completed');
    })

  };

  const handleFinalComment = (e) => {
    setFinalComment(e.target.value);
  };

  return (
    <>
    {tasks && tasks.length > 0 ? <div>
      <table className="task-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Assignee</th>
            <th>Create Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} onClick={() => showTaskDetails(task)}>
              <td>{task.name}</td>
              <td>{task.assignee}</td>
              <td>{task.createTime}</td>
              <td>{task.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTask && (
        <div className="task-details">
          <h3>{selectedTask.name}</h3>
          <p>
            <strong>Assignee:</strong> {selectedTask.assignee}
          </p>
          <p>
            <strong>Create Time:</strong> {selectedTask.createTime}
          </p>
          <p>
            <strong>Description:</strong> {selectedTask.description}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {Object.entries(selectedTask.variables).map(([key, value], index) => (
              <div key={index}>
                <label htmlFor={key}>{key}:</label>
                <input
                  type="text"
                  {...register(key)}
                  defaultValue={value}
                />
              </div>
            ))}

          </form>
          <div className="textarea-container">
            <textarea value={finalComment} onChange={handleFinalComment} className="task-comment" placeholder="Add a comment"></textarea>
            <button className="task-button" onClick={handleCompleteTask}>Submit</button>
          </div>
        </div>
      )}
    </div> : <div className="no-task"></div>}
    </>
  );
};

export default TaskList;
