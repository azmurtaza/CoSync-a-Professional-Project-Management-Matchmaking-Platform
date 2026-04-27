import { createSlice } from '@reduxjs/toolkit'

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    myProjects: [],
    appliedProjects: [],
  },
  reducers: {
    addProject: (state, action) => {
      state.myProjects.unshift({
        ...action.payload,
        id: Date.now(),
        status: 'Recruiting',
        applicants: 0,
        members: 1,
        progress: 0,
        posted: 'Just now',
      })
    },
    removeProject: (state, action) => {
      state.myProjects = state.myProjects.filter(p => p.id !== action.payload)
    },
  },
})

export const { addProject, removeProject } = projectsSlice.actions
export default projectsSlice.reducer