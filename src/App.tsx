import { useState } from 'react'
import { type Contact } from './types/contact'
import ContactList from './components/ContactList'
import AddContactModal from './components/AddContactModal'
import SearchBar from './components/SearchBar'
import './App.css'

// Mock initial contacts data
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 8901',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
  },
]

function App() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name)}`,
    }
    setContacts([...contacts, contact])
    setIsModalOpen(false)
  }

  const handleEditContact = (id: string, updatedContact: Omit<Contact, 'id' | 'avatar'>) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { 
            ...contact, 
            ...updatedContact, 
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedContact.name)}` 
          } 
        : contact
    ))
  }

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Contact
            </button>
          </div>
          
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <ContactList 
            contacts={filteredContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
          
          <AddContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddContact}
          />
        </div>
      </div>
    </div>
  )
}

export default App
