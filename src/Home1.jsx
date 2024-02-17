import React, { useState } from 'react';

const TaskForm = () => {
  const [taskname, setTaskname] = useState('');
  const [taskdescription, setTaskdescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // New state for modal visibility
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskname, taskdescription })
      });

      if (!response.ok) {
        throw new Error('Failed to submit task');
      }

      setSuccessMessage('Task submitted successfully');
      setTaskname('');
      setTaskdescription('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error submitting task:', error.message);
      alert('Failed to submit task. Please try again later.');
    }
  };
  
  const handleShowTasks = async () => {
    try {
      const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist');
      const responseData = await response.json();
      if (Array.isArray(responseData.data)) {
        console.log('Tasks from API:', responseData.data);
        setTasks(responseData.data);
      } else {
        console.error('Invalid response from API:', responseData);
        alert('Failed to fetch tasks. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      alert('Failed to fetch tasks. Please try again later.');
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleUpdateTask = async (task) => {
    setSelectedTask(task);
    toggleModal();


        try {
            const response = await fetch(`https://task-list-db.onrender.com/api/v1/tasklist/${selectedTask.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(selectedTask.attributes)
            });
        
            if (!response.ok) {
              throw new Error('Failed to update task');
            }
        
            setTasks(tasks.map((t) => (t.id === selectedTask.id ? { ...t, attributes: selectedTask.attributes } : t)));
            toggleModal();
          } catch (error) {
            console.error('Error updating task:', error.message);
         //   alert('Failed to update task. Please try again later.');
          }
  };

  const handleDeleteTask = async (task) => {
    try {
      const response = await fetch(`https://task-list-db.onrender.com/api/v1/tasklist/${task.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((t) => t.id !== task.id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
      alert('Failed to delete task. Please try again later.');
    }
  };

  return (
    <div>
      
      <div class="navbar">
            
      <button onClick={() => handleUpdateTask(task)}>Add to do list </button>
      </div>
      
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            value={taskname}
            onChange={(e) => setTaskname(e.target.value)}
          />
        </div>
        <div>
          <label>Task Description:</label>
          <input
            type="text"
            value={taskdescription}
            onChange={(e) => setTaskdescription(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
        {successMessage && <div>{successMessage}</div>}
      </form>
      <button onClick={handleShowTasks}>Refresh Tasks</button>
      {showModal && (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Update Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div>
                <label>Task Name:</label>
                <input
                  type="text"
                  value={selectedTask?.attributes.taskname || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask,
                    attributes: {
                      ...selectedTask?.attributes,
                      taskname: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label>Task Description:</label>
                <input
                  type="text"
                  value={selectedTask?.attributes.taskdescription || ''}
                  onChange={(e) => setSelectedTask({
                    ...selectedTask,
                    attributes: {
                      ...selectedTask?.attributes,
                      taskdescription: e.target.value
                    }
                  })}
                />
              </div>
              <button type="submit">Update</button>
            </form>
            <button onClick={() => handleDeleteTask(selectedTask)}>Delete</button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Task Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.attributes.taskname}</td>
              <td>{task.attributes.taskdescription}</td>
              <td>
                <button onClick={() => handleUpdateTask(task)}>Update</button>
                <button onClick={() => handleDeleteTask(task)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskForm;
