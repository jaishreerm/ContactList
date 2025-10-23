import { type Contact } from '../types/contact'
import { EnvelopeIcon, PhoneIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import EditContactModal from './EditContactModal'

interface ContactListProps {
  contacts: Contact[]
  onEdit: (id: string, contact: Omit<Contact, 'id' | 'avatar'>) => void
  onDelete: (id: string) => void
}

const ContactList = ({ contacts, onEdit, onDelete }: ContactListProps) => {
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
            <li className="col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
              <div className="w-full h-full p-6">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full border-2 border-indigo-100"
                    src={contact.avatar}
                    alt={contact.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingContact(contact)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit contact"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(contact.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete contact"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col space-y-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="group flex items-center text-sm text-gray-500 hover:text-indigo-600"
                      >
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-indigo-500" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="group flex items-center text-sm text-gray-500 hover:text-indigo-600"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-indigo-500" />
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