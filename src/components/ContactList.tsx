import { type Contact } from '../types/contact'
import { EnvelopeIcon, PhoneIcon, PencilIcon, TrashIcon, StarIcon as StarOutline } from '@heroicons/react/20/solid'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import EditContactModal from './EditContactModal'

interface ContactListProps {
  contacts: Contact[]
  onEdit: (id: string, contact: Omit<Contact, 'id' | 'avatar'>) => void
  onDelete: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

const ContactList = ({ contacts, onEdit, onDelete, onToggleFavorite }: ContactListProps) => {
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Transition
            key={contact.id}
            as={Fragment}
            appear={true}
            show={true}
            enter="transform transition ease-out duration-500 delay-[var(--delay)]"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
          >
            <li className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group dark:shadow-gray-900">
              <div className="w-full h-full p-6">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full border-2 border-indigo-100 dark:border-indigo-900"
                    src={contact.avatar}
                    alt={contact.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h3>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onToggleFavorite?.(contact.id)}
                          className={`transition-colors ${contact.favorite ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-300'}`}
                          title={contact.favorite ? 'Unfavorite' : 'Add to favorites'}
                        >
                          {contact.favorite ? <StarSolid className="h-5 w-5" /> : <StarOutline className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => setEditingContact(contact)}
                          className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit contact"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(contact.id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete contact"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col space-y-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="group flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="group flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </Transition>
        ))}
      </ul>

      {editingContact && (
        <EditContactModal
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          onEdit={onEdit}
          contact={editingContact}
        />
      )}
    </>
  )
}

export default ContactList