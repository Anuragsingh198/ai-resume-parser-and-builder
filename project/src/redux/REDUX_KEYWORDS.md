# Redux Toolkit Keywords Documentation

This document explains all Redux Toolkit keywords and concepts used in this project.

---

## Table of Contents

1. [createSlice](#createslice)
2. [createAsyncThunk](#createasyncthunk)
3. [PayloadAction](#payloadaction)
4. [reducers](#reducers)
5. [extraReducers](#extrareducers)
6. [configureStore](#configurestore)
7. [useAppDispatch & useAppSelector](#hooks)
8. [rejectWithValue](#rejectwithvalue)
9. [builder.addCase](#builderaddcase)
10. [pending, fulfilled, rejected](#async-states)

---

## createSlice

**What it does:** Creates a Redux slice with reducers and actions automatically generated.

**Syntax:**
```typescript
const mySlice = createSlice({
  name: 'sliceName',
  initialState: { ... },
  reducers: { ... },
  extraReducers: (builder) => { ... }
});
```

**How it works:**
- `name`: Prefix for all action types (e.g., `'auth'` creates `'auth/setUser'`, `'auth/logout'`)
- Automatically generates action creators from `reducers`
- Returns `{ actions, reducer }` object

**Example:**
```typescript
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; }
  }
});

// Auto-generated: authSlice.actions.setUser()
// Auto-generated action type: 'auth/setUser'
```

---

## createAsyncThunk

**What it does:** Creates an async action thunk for API calls and side effects.

**Syntax:**
```typescript
const myThunk = createAsyncThunk(
  'feature/actionName',
  async (payload, { dispatch, rejectWithValue }) => {
    // Async logic here
  }
);
```

**How it works:**
- First parameter: Action type prefix (e.g., `'auth/login'`)
- Second parameter: Async function that returns data or throws error
- Automatically generates three action types:
  - `'auth/login/pending'` - When request starts
  - `'auth/login/fulfilled'` - When request succeeds
  - `'auth/login/rejected'` - When request fails

**Example:**
```typescript
export const userLogin = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    const response = await axios.post('/auth/login', userData);
    return response.data; // Becomes action.payload in fulfilled
  }
);

// Usage: dispatch(userLogin(formData))
```

---

## PayloadAction

**What it does:** TypeScript type for action payloads in Redux Toolkit.

**Syntax:**
```typescript
action: PayloadAction<Type>
```

**How it works:**
- Ensures type safety for action payloads
- `action.payload` is typed as `Type`
- Used in reducer functions to type the action parameter

**Example:**
```typescript
reducers: {
  setUser: (state, action: PayloadAction<User>) => {
    state.user = action.payload; // TypeScript knows this is User type
  }
}
```

---

## reducers

**What it does:** Defines synchronous state update functions (normal reducers).

**Syntax:**
```typescript
reducers: {
  actionName: (state, action) => {
    // Update state directly (Immer handles immutability)
  }
}
```

**How it works:**
- Each reducer function receives `state` and `action`
- You can mutate `state` directly (Redux Toolkit uses Immer internally)
- Automatically creates action creators: `slice.actions.actionName()`

**Example:**
```typescript
reducers: {
  updateJob: (state, action: PayloadAction<Job>) => {
    const index = state.jobs.findIndex(job => job.id === action.payload.id);
    if (index !== -1) {
      state.jobs[index] = action.payload; // Direct mutation (Immer handles it)
    }
  }
}

// Usage: dispatch(updateJob(jobData))
```

---

## extraReducers

**What it does:** Handles actions from outside the slice (like async thunks).

**Syntax:**
```typescript
extraReducers: (builder) => {
  builder
    .addCase(thunk.pending, (state) => { ... })
    .addCase(thunk.fulfilled, (state, action) => { ... })
    .addCase(thunk.rejected, (state, action) => { ... });
}
```

**How it works:**
- Listens to actions created by `createAsyncThunk`
- `builder` provides methods to add case reducers
- Handles `pending`, `fulfilled`, and `rejected` states automatically

**Example:**
```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchJobs.pending, (state) => {
      state.loading = true; // Set loading when request starts
    })
    .addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload; // Update state with response
    })
    .addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload; // Set error message
    });
}
```

---

## configureStore

**What it does:** Configures the Redux store with all reducers.

**Syntax:**
```typescript
export const store = configureStore({
  reducer: {
    feature1: reducer1,
    feature2: reducer2,
  }
});
```

**How it works:**
- Combines multiple reducers into one root reducer
- Each key becomes a state branch (e.g., `state.auth`, `state.job`)
- Automatically sets up Redux DevTools and middleware

**Example:**
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    resume: resumeReducer,
  }
});

// Access: state.auth.user, state.job.jobs, etc.
```

---

## useAppDispatch & useAppSelector

**What it does:** Typed hooks for dispatching actions and selecting state.

**Syntax:**
```typescript
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

**How it works:**
- `useAppDispatch`: Returns typed dispatch function
- `useAppSelector`: Typed version of `useSelector` with `RootState` type
- Provides TypeScript autocomplete and type checking

**Example:**
```typescript
// In component
const dispatch = useAppDispatch();
const loading = useAppSelector((state) => state.auth.loading);

// Dispatch action
dispatch(userLogin(formData));

// Select state
const jobs = useAppSelector((state) => state.job.jobs);
```

---

## rejectWithValue

**What it does:** Returns a custom error value from async thunk instead of throwing.

**Syntax:**
```typescript
return rejectWithValue(errorMessage);
```

**How it works:**
- Used in `catch` block of async thunk
- Returns custom error payload (string, object, etc.)
- Becomes `action.payload` in `rejected` case of `extraReducers`

**Example:**
```typescript
export const userLogin = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', userData);
      return response.data;
    } catch (error) {
      const errorMsg = 'Login failed';
      return rejectWithValue(errorMsg); // Custom error message
    }
  }
);

// In extraReducers:
.addCase(userLogin.rejected, (state, action) => {
  state.error = action.payload; // 'Login failed'
})
```

---

## builder.addCase

**What it does:** Adds a case reducer for a specific action type.

**Syntax:**
```typescript
builder.addCase(actionCreator, (state, action) => { ... })
```

**How it works:**
- `actionCreator`: The action creator (e.g., `fetchJobs.pending`)
- Second parameter: Reducer function that updates state
- Used in `extraReducers` to handle async thunk actions

**Example:**
```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchJobs.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    });
}
```

---

## pending, fulfilled, rejected

**What it does:** Three action types automatically generated by `createAsyncThunk`.

**How it works:**
- **pending**: Dispatched when async thunk starts
- **fulfilled**: Dispatched when async thunk succeeds (return value becomes payload)
- **rejected**: Dispatched when async thunk fails (rejectWithValue becomes payload)

**Example:**
```typescript
// Thunk
export const fetchJobs = createAsyncThunk('job/fetchJobs', async () => {
  const response = await axios.get('/jobs');
  return response.data; // This becomes action.payload in fulfilled
});

// In extraReducers
builder
  .addCase(fetchJobs.pending, (state) => {
    // Called when fetchJobs() is dispatched
    state.loading = true;
  })
  .addCase(fetchJobs.fulfilled, (state, action) => {
    // Called when API call succeeds
    // action.payload = response.data
    state.jobs = action.payload;
  })
  .addCase(fetchJobs.rejected, (state, action) => {
    // Called when API call fails
    // action.payload = value from rejectWithValue()
    state.error = action.payload;
  });
```

---

## Key Concepts Summary

### Normal Reducers vs ExtraReducers

| Feature | Normal Reducers | ExtraReducers |
|---------|----------------|---------------|
| **Purpose** | Synchronous updates | Async thunk actions |
| **Actions** | Auto-generated from slice | From `createAsyncThunk` |
| **Usage** | `dispatch(setUser(user))` | `dispatch(fetchJobs())` |
| **Loading** | Manual | Automatic (pending/fulfilled/rejected) |

### Action Flow

```
1. Component: dispatch(userLogin(data))
   ↓
2. createAsyncThunk dispatches: 'auth/login/pending'
   ↓
3. extraReducers catches: userLogin.pending
   → Updates: loading = true
   ↓
4. API call executes
   ↓
5a. SUCCESS: return response.data
   → Dispatches: 'auth/login/fulfilled'
   → extraReducers: userLogin.fulfilled
   → Updates: loading = false, user = action.payload

5b. ERROR: return rejectWithValue(errorMsg)
   → Dispatches: 'auth/login/rejected'
   → extraReducers: userLogin.rejected
   → Updates: loading = false, error = action.payload
```

### State Structure

```typescript
// Root State
{
  auth: {
    user: User | null,
    loading: boolean,
    error: string | null
  },
  job: {
    jobs: Job[],
    loading: boolean,
    error: string | null,
    selectedJob: Job | null
  },
  resume: {
    resumeData: ResumeData | null,
    jobDetails: JobDetails | null,
    // ...
  }
}
```

---

## Best Practices

1. **Use `createSlice`** for all state management
2. **Use `createAsyncThunk`** for API calls
3. **Use `extraReducers`** to handle async thunk states
4. **Use `PayloadAction<Type>`** for type safety
5. **Use `useAppDispatch` and `useAppSelector`** instead of plain hooks
6. **Return data from thunks** - don't dispatch manually in thunks
7. **Handle errors with `rejectWithValue`** for custom error messages

---

## File Structure

```
redux/
├── actions/          # Async thunks (createAsyncThunk)
│   ├── authactions.ts
│   └── jobAction.ts
├── slices/          # State slices (createSlice)
│   ├── authSlice.ts
│   ├── jobslice.ts
│   └── resumeSlice.ts
├── store.ts         # Store configuration (configureStore)
├── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
├── initializeStore.ts
└── REDUX_KEYWORDS.md  # This file
```

---

For more information, visit: [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
