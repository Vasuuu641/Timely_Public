import { Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Note } from '../../api/notes';
import { deleteNote } from '../../api/notes';
import './NoteCard.css';

type NoteCardProps = {
  note: Note;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
};

export default function NoteCard({ note, onDelete, onEdit, onView }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const getPreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-meta">
          <span className="note-category-badge">{note.category.name}</span>
          <span className="note-date">{formatDate(note.createdAt)}</span>
        </div>
      </div>

      <div className="note-card-content">
        <p className="note-preview">{getPreview(note.content)}</p>
      </div>

      <div className="note-card-actions">
        <button 
          className="note-action-btn note-action-view"
          onClick={onView}
          title="View"
        >
          <Eye size={16} />
          <span>View</span>
        </button>
        <button 
          className="note-action-btn note-action-edit"
          onClick={onEdit}
          title="Edit"
        >
          <Edit size={16} />
          <span>Edit</span>
        </button>
        <button 
          className="note-action-btn note-action-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete"
        >
          <Trash2 size={16} />
          <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>
    </div>
  );
}
