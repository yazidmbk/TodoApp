import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { firestore } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, setDoc, deleteDoc } from '@react-native-firebase/firestore';

const App = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTask = async () => {
    try {
      const newTask = { name: taskName, description: taskDescription };
      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      await firestore().collection('tasks').doc(newTask.name).set(newTask);
      setTaskName('');
      setTaskDescription('');
    } catch (error) {
      console.error('Error saving task to AsyncStorage or Firestore:', error);
    }
  };

  const deleteTask = async (taskName) => {
    try {
      const updatedTasks = tasks.filter(task => task.name !== taskName);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      await firestore().collection('tasks').doc(taskName).delete();
    } catch (error) {
      console.error('Error deleting task from AsyncStorage or Firestore:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  const renderCreateTaskForm = () => {
    return (
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Task Name"
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
        />
        <TextInput
          placeholder="Task Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={saveTask}>
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTaskList = () => {
    return (
      <ScrollView style={styles.taskList}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.task}>
            <Text style={styles.taskText}>Task Name: {task.name}</Text>
            <Text style={styles.taskText}>Task Description: {task.description}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.name)}>
              <Text style={styles.buttonText}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Manage your tasks</Text>
      {renderCreateTaskForm()}
      {renderTaskList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: 20,
  },
  task: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default App;
