import { useState } from 'react'
import { type Contact } from './types/contact'
import ContactList from './components/ContactList'
import AddContactModal from './components/AddContactModal'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

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
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h2>
              <div className="flex space-x-4">
                <ThemeToggle />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Add Contact
                </button>
              </div>
            </div>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <div className="mt-6">
              <ContactList
                contacts={filteredContacts}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            </div>
          </div>
        </div>

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddContact}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
