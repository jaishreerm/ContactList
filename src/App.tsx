import { useState } from 'react'
import { type Contact } from './types/contact'
import ContactList from './components/ContactList'
import AddContactModal from './components/AddContactModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
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
  const [searchBy, setSearchBy] = useState<'name' | 'email' | 'phone'>('name')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az')
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null)

  const filteredContacts = contacts
    .filter((contact) => (showFavoritesOnly ? contact.favorite : true))
    .filter((contact) => {
      const query = searchQuery.toLowerCase()
      switch (searchBy) {
        case 'email':
          return contact.email.toLowerCase().includes(query)
        case 'phone':
          return contact.phone.includes(query)
        default:
          return contact.name.toLowerCase().includes(query)
      }
    })
    .sort((a, b) => {
      const na = a.name.toLowerCase()
      const nb = b.name.toLowerCase()
      if (sortOrder === 'az') return na.localeCompare(nb)
      return nb.localeCompare(na)
    })

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const nameLower = newContact.name.trim().toLowerCase()
    const emailLower = newContact.email.trim().toLowerCase()
    const phone = newContact.phone.trim()

    const dupName = contacts.find(c => c.name.trim().toLowerCase() === nameLower)
    const dupEmail = contacts.find(c => c.email.trim().toLowerCase() === emailLower)
    const dupPhone = contacts.find(c => c.phone.trim() === phone)

    if (dupName || dupEmail || dupPhone) {
      const parts: string[] = []
      if (dupName) parts.push('name')
      if (dupEmail) parts.push('email')
      if (dupPhone) parts.push('phone')
      alert(`Cannot add contact — the following fields must be unique and already exist: ${parts.join(', ')}`)
      return
    }

    const contact: Contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name)}`,
      favorite: newContact.favorite ?? false,
    }
    setContacts([...contacts, contact])
    setIsModalOpen(false)
  }

  const toggleFavorite = (id: string) => {
    setContacts((prev) => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c))
  }

  const handleEditContact = (id: string, updatedContact: Omit<Contact, 'id' | 'avatar'>) => {
    const nameLower = updatedContact.name.trim().toLowerCase()
    const emailLower = updatedContact.email.trim().toLowerCase()
    const phone = updatedContact.phone.trim()

    const dupName = contacts.find(c => c.id !== id && c.name.trim().toLowerCase() === nameLower)
    const dupEmail = contacts.find(c => c.id !== id && c.email.trim().toLowerCase() === emailLower)
    const dupPhone = contacts.find(c => c.id !== id && c.phone.trim() === phone)

    if (dupName || dupEmail || dupPhone) {
      const parts: string[] = []
      if (dupName) parts.push('name')
      if (dupEmail) parts.push('email')
      if (dupPhone) parts.push('phone')
      alert(`Cannot update contact — the following fields must be unique and already exist: ${parts.join(', ')}`)
      return
    }

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
    const contact = contacts.find(c => c.id === id)
    if (contact) {
      setDeleteContact(contact)
    }
  }

  const confirmDelete = () => {
    if (deleteContact) {
      setContacts(prev => prev.filter(contact => contact.id !== deleteContact.id))
      setDeleteContact(null)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h2>
                <div className="relative">
                  <select
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value as 'name' | 'email' | 'phone')}
                    className="appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3 pr-8 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  >
                    <option value="name">Search by Name</option>
                    <option value="email">Search by Email</option>
                    <option value="phone">Search by Phone</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex space-x-4">
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="sr-only">Sort</label>
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'az' | 'za')}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowFavoritesOnly(prev => !prev)}
                  className={`px-3 py-2 rounded-md border ${showFavoritesOnly ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'} focus:outline-none`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Add Contact
                </button>
              </div>
            </div>

            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder={`Search by ${searchBy}...`}
            />

            <div className="mt-6">
              <ContactList
                contacts={filteredContacts}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </div>
        </div>

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddContact}
        />

        <DeleteConfirmationModal
          isOpen={deleteContact !== null}
          onClose={() => setDeleteContact(null)}
          onConfirm={confirmDelete}
          contact={deleteContact}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
