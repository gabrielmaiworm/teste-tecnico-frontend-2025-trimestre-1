import { useState, useEffect } from 'react'
import { Contact } from '@/app/types/contact'

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('contacts')
    if (saved) {
      setContacts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])

  const addContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact])
  }

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id))
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ))
  }

  const filterContacts = (searchTerm: string) => {
    if (!searchTerm) return contacts
    
    const term = searchTerm.toLowerCase()
    return contacts.filter(contact => 
      contact.userName.toLowerCase().includes(term) ||
      contact.displayName.toLowerCase().includes(term) ||
      contact.address.localidade.toLowerCase().includes(term) ||
      contact.address.uf.toLowerCase().includes(term)
    )
  }

  return {
    contacts,
    addContact,
    deleteContact,
    updateContact,
    filterContacts
  }
} 