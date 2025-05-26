import { Address } from '../types/contact'

interface ViaCepResponse extends Address {
    erro?: boolean
}

export class AddressService {
    private static readonly BASE_URL = 'https://viacep.com.br/ws'
  
    static async fetchAddress(cep: string): Promise<Address | null> {
      try {
        const cleanCep = cep.replace(/\D/g, '')
        
        if (cleanCep.length !== 8) {
          return null
        }
  
        const response = await fetch(`${this.BASE_URL}/${cleanCep}/json/`)
        
        if (!response.ok) {
          return null
        }
  
        const data: ViaCepResponse = await response.json()
        
        if (data.erro) {
          return null
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { erro, ...address } = data
        return address
      } catch {
        return null
      }
    }
  } 