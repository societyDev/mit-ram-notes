import React, { useState, useEffect } from 'react';
import NotesOverview from './components/NotesOverview';
import NoteEditor from './components/NoteEditor';
import ThemeToggle from './components/ThemeToggle';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar notas do localStorage na inicialização
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }

    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Salvar notas no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Nota',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setCurrentNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (currentNoteId === id) {
      setCurrentNoteId(null);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newValue;
    });
  };

  const currentNote = notes.find(note => note.id === currentNoteId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      
      {currentNote ? (
        <NoteEditor
          note={currentNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onClose={() => setCurrentNoteId(null)}
        />
      ) : (
        <NotesOverview
          notes={notes}
          onSelectNote={setCurrentNoteId}
          onCreateNote={createNote}
        />
      )}
    </div>
  );
}