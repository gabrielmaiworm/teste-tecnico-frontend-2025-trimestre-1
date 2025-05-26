'use client'

import React, { useState } from 'react'
import { AddressService } from './services/addressService'
import { useContacts } from './hooks/useContact'
import { useToast } from '@/app/hooks/useToast'
import { Contact } from '@/app/types/contact'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDisplayName, setEditDisplayName] = useState('')

  const { addContact, deleteContact, updateContact, filterContacts } = useContacts()
  const { toast, showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName || !displayName || !cep) {
      showToast('Preencha todos os campos', 'error')
      return
    }

    setLoading(true)
    
    const address = await AddressService.fetchAddress(cep)
    
    if (!address) {
      showToast('CEP não encontrado', 'error')
      setLoading(false)
      return
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      userName,
      displayName,
      cep: cep.replace(/\D/g, ''),
      address
    }

    addContact(newContact)
    setUserName('')
    setDisplayName('')
    setCep('')
    setLoading(false)
    showToast('Endereço adicionado com sucesso', 'success')
  }

  const handleDelete = (id: string) => {
    deleteContact(id)
  }

  const handleEdit = (id: string, newDisplayName: string) => {
    updateContact(id, { displayName: newDisplayName })
    setEditingId(null)
    setEditDisplayName('')
  }

  const filteredContacts = filterContacts(searchTerm)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agenda de Endereços</h1>
        
        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-md text-white z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome do usuário"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border text-black border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Nome do endereço"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border text-black border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="border text-black border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Adicionar Contato'}
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl text-black font-semibold mb-4">Contatos ({filteredContacts.length})</h2>
            <input
              type="text"
              placeholder="Buscar contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filteredContacts.length === 0 ? (
            <p className="p-6 text-gray-500">Nenhum contato encontrado</p>
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact: Contact) => (
                <div key={contact.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-gray-900">{contact.userName}</span>
                        {editingId === contact.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editDisplayName}
                              onChange={(e) => setEditDisplayName(e.target.value)}
                              className="border text-black border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              onClick={() => handleEdit(contact.id, editDisplayName)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="text-blue-600">{contact.displayName}</span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {contact.address.logradouro}, {contact.address.bairro}
                      </p>
                      <p className="text-gray-600">
                        {contact.address.localidade} - {contact.address.uf}
                      </p>
                      <p className="text-gray-500 text-sm">CEP: {contact.cep}</p>
                    </div>
                    <div className="flex gap-2">
                      {editingId !== contact.id && (
                        <button
                          onClick={() => {
                            setEditingId(contact.id)
                            setEditDisplayName(contact.displayName)
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 