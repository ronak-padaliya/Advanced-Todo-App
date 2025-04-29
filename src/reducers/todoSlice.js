import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todos';

export const loadTodos = createAsyncThunk('todos/loadTodos', async () => {
  try {
    const todos = await AsyncStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    throw error;
  }
});

export const saveTodos = createAsyncThunk('todos/saveTodos', async (todos) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
    throw error;
  }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTodo);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(error => {
        console.error('Error saving todos:', error);
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(error => {
          console.error('Error saving todos:', error);
        });
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(error => {
        console.error('Error saving todos:', error);
      });
    },
    editTodo: (state, action) => {
      const { id, title, description } = action.payload;
      const todo = state.items.find((item) => item.id === id);
      if (todo) {
        todo.title = title;
        todo.description = description;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(error => {
          console.error('Error saving todos:', error);
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo } = todoSlice.actions;
export default todoSlice.reducer; 