import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, loadTodos } from '../reducers/todoSlice';

const HomeScreen = ({ navigation }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const status = useSelector((state) => state.todos.status);

  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your todo');
      return;
    }

    dispatch(
      addTodo({
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
      })
    );
    setNewTodoTitle('');
    setNewTodoDescription('');
  };

  const renderTodoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.todoItem, item.completed && styles.completedTodoItem]}
      onPress={() => navigation.navigate('TodoDetails', { todo: item })}
    >
      <View style={styles.todoContent}>
        <View style={styles.todoHeader}>
          <Text
            style={[
              styles.todoTitle,
              item.completed && styles.completedTodoTitle,
            ]}
          >
            {item.title}
          </Text>
          <View style={styles.todoActions}>
            <TouchableOpacity
              onPress={() => dispatch(toggleTodo(item.id))}
              style={[styles.actionButton, item.completed ]}
            >

              <Image source={item.completed ? require('../../assets/icons/undo-arrow.png') : require('../../assets/icons/checked.png')} style={{ height: 24, width: 24 }} resizeMode='contain' />

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispatch(deleteTodo(item.id)
              )}
              style={[styles.actionButton]}
            >

              <Image source={require('../../assets/icons/delete.png')} style={{ height: 24, width: 24 }} resizeMode='contain' />

            </TouchableOpacity>
          </View>
        </View>
        {item.description && (
          <Text style={styles.todoDescription}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image source={require('../../assets/icons/account.png')} style={{ height: 30, width: 30 }} resizeMode='contain' />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#666"
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Add a description (optional)"
          placeholderTextColor="#666"
          value={newTodoDescription}
          onChangeText={setNewTodoDescription}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>

          
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  profileButton: {
  
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  todoItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedTodoItem: {
    backgroundColor: '#f8f9fa',
  },
  todoContent: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  completedTodoTitle: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  todoActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
 
 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default HomeScreen; 