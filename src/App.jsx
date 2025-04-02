import { useEffect, useState } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import Footer from './components/Footer'



function App() {
  
  const [showAll, setShowAll] = useState(true)
  const [newNote, setNewNote] = useState('') 
  const [notes, setNotes] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const notesToShow = showAll 
    ? notes
    : notes.filter(note => note.important === true)

    
  useEffect(() => {
    const request = noteService.getAll()
    const nonExisting = {
      id : 10000,
      content: 'this note os not saved to server',
      important: true,
    }
    request.then(response => setNotes(response.data.concat(nonExisting)))
    
    
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const note_object = {
      content : newNote,
      important: Math.random() < 0.5,
    }
    noteService
      .create(note_object)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const inputHandler = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(response => {
      setNotes(notes.map(note => note.id === id ? response.data : note))})
      .catch( error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    
  }

  

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={()=> setShowAll(!showAll)} >
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance = {() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <input value={newNote} onChange={inputHandler} />
      <div>
        <button type='submit' onClick={addNote}  >add</button>
      </div>
      <Footer/>
    </div>
  )
}

export default App
