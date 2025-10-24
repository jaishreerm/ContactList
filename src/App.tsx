import { useState, useEffect, Fragment } from 'react'
import { type Contact } from './types/contact'
import ContactList from './components/ContactList'
import AddContactModal from './components/AddContactModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import { Menu, Transition } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/20/solid'
import ContactSkeleton from './components/ContactSkeleton'
import EmptyState from './components/EmptyState'
import './App.css'

const getStoredContacts = (): Contact[] => {
  try {
    const stored = localStorage.getItem('contacts')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

// Helper function to conditionally join class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>(getStoredContacts())
  
  useEffect(() => {
    const simulateLoading = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
    }
    simulateLoading()
  }, [])

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState<'name' | 'email' | 'phone'>('name')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az')
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null)

  // Labels for the placeholder
  const searchByLabel = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
  }

  const normalizeString = (str: string) => {
    return str.replace(/\s+/g, '').toLowerCase()
  }

  const normalizePhone = (phone: string) => {
    return phone.replace(/[\s\-()+ ]/g, '')
  }

  const filteredContacts = contacts
    .filter((contact) => (showFavoritesOnly ? contact.favorite : true))
    .filter((contact) => {
      if (!searchQuery) return true
      
      const normalizedQuery = normalizeString(searchQuery)
      
      switch (searchBy) {
        case 'email':
          return normalizeString(contact.email).includes(normalizedQuery)
        case 'phone':
          return normalizePhone(contact.phone).includes(normalizePhone(searchQuery))
        default:
          return normalizeString(contact.name).includes(normalizedQuery)
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
      const duplicates = []
      if (dupName) duplicates.push('Name')
      if (dupEmail) duplicates.push('Email')
      if (dupPhone) duplicates.push('Phone number')
      throw new Error(`The following fields must be unique. ${duplicates.join(' and ')} already exist.`)
    }

    const contact: Contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name)}`,
      favorite: newContact.favorite ?? false,
    }
    const updatedContacts = [...contacts, contact]
    setContacts(updatedContacts)
    localStorage.setItem('contacts', JSON.stringify(updatedContacts))
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
      const duplicates = []
      if (dupName) duplicates.push('Name')
      if (dupEmail) duplicates.push('Email')
      if (dupPhone) duplicates.push('Phone number')
      throw new Error(`The following fields must be unique. ${duplicates.join(' and ')} already exist.`);
    }

    const updatedContacts = contacts.map(contact => 
      contact.id === id 
        ? { 
            ...contact, 
            ...updatedContact, 
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedContact.name)}` 
          } 
        : contact
    )
    setContacts(updatedContacts)
    localStorage.setItem('contacts', JSON.stringify(updatedContacts))
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
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h2>
                
                {/* Filter Icon Dropdown */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center items-center w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                      <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Filter options</span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 sm:left-auto sm:right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => setSearchBy('name')}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                searchBy === 'name' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300',
                                'block w-full text-left px-4 py-2 text-sm'
                              )}
                            >
                              Search by Name
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => setSearchBy('email')}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                searchBy === 'email' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300',
                                'block w-full text-left px-4 py-2 text-sm'
                              )}
                            >
                              Search by Email
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => setSearchBy('phone')}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                searchBy === 'phone' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300',
                                'block w-full text-left px-4 py-2 text-sm'
                              )}
                            >
                              Search by Phone
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

              </div>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-4">
                <ThemeToggle />
                <div className="flex items-center w-full sm:w-auto">
                  <label htmlFor="sort" className="sr-only">Sort</label>
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'az' | 'za')}
                    className="w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  >
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowFavoritesOnly(prev => !prev)}
                  className={`w-full sm:w-auto px-3 py-2 rounded-md border text-sm ${showFavoritesOnly
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-sm font-medium"
                >
                  Add Contact
                </button>
              </div>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search by ${searchByLabel[searchBy]}...`}
            />

            <div className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  <ContactSkeleton />
                  <ContactSkeleton />
                  <ContactSkeleton />
                </div>
              ) : filteredContacts.length > 0 ? (
                <ContactList
                  contacts={filteredContacts}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={toggleFavorite}
                />
              ) : searchQuery ? (
                <EmptyState
                  title="No results found"
                  message={`No contacts match your search for '${searchQuery}'`}
                />
              ) : showFavoritesOnly ? (
                <EmptyState
                  title="No favorites yet"
                  message="You haven't added any contacts to your favorites yet"
                />
              ) : (
                <EmptyState
                  title="Your contact list is empty"
                  message="Click 'Add Contact' to get started!"
                />
              )}
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