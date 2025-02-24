import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ConnectButton, EventList, TicketList, CreateEventForm } from './components'
import contractAbi from './abi.json'
import './App.css'

const CONTRACT_ADDRESS = "0x0D0e0A20d422c9B5464c193779020AC311811896"

function App() {
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState('')
  const [events, setEvents] = useState([])
  const [tickets, setTickets] = useState([])
  const [isOwner, setIsOwner] = useState(false)

  // Auto-connect wallet
  useEffect(() => {
    const init = async () => {
      if (window.ethereum?.isConnected()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            await connectWallet()
          }
        } catch (error) {
          console.error("Auto-connect failed:", error)
        }
      }
    }
    init()

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount('')
        setContract(null)
      } else {
        connectWallet()
      }
    }

    window.ethereum?.on('accountsChanged', handleAccountsChanged)
    return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
  }, [])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS, 
          contractAbi, 
          signer
        )

        const ownerAddress = await contractInstance.owner()
        
        setProvider(provider)
        setContract(contractInstance)
        setAccount(address)
        setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase())
        
        await fetchEvents(contractInstance)
        await fetchTickets(contractInstance, address)
      } catch (error) {
        console.error("Connection error:", error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const logout = () => {
    setAccount('');
    setContract(null);
    setProvider(null);
    setIsOwner(false);
    window.location.reload();
  };

  const fetchEvents = async (contractInstance) => {
    try {
      const eventCount = await contractInstance.eventIdCounter()
      const loadedEvents = []
      
      for (let i = 0; i < eventCount; i++) {
        const event = await contractInstance.events(i)
        if (event.exists) {
          loadedEvents.push({
            id: i,
            name: event.name,
            price: ethers.formatEther(event.price),
            maxTickets: Number(event.maxTickets),
            ticketsSold: Number(event.ticketsSold),
            metadataURI: event.metadataURI
          })
        }
      }
      
      setEvents(loadedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchTickets = async (contractInstance, userAddress) => {
    try {
      const filter = contractInstance.filters.TicketPurchased(userAddress)
      const logs = await contractInstance.queryFilter(filter)
      
      const ticketData = await Promise.all(
        logs.map(async log => {
          try {
            const owner = await contractInstance.ownerOf(log.args.tokenId)
            if (owner.toLowerCase() === userAddress.toLowerCase()) {
              const eventId = await contractInstance.getTicketEvent(log.args.tokenId)
              const event = await contractInstance.events(eventId)
              return {
                tokenId: log.args.tokenId.toString(),
                eventId: eventId.toString(),
                name: event.name,
                metadataURI: event.metadataURI
              }
            }
            return null
          } catch {
            return null
          }
        })
      )
      
      setTickets(ticketData.filter(ticket => ticket !== null))
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const handleBuyTicket = async (eventId, price) => {
    try {
      const tx = await contract.buyTicket(eventId, {
        value: ethers.parseEther(price.toString())
      })
      await tx.wait()
      const newContract = contract.connect(contract.runner)
      await fetchEvents(newContract)
      await fetchTickets(newContract, account)
      alert('Ticket purchased successfully!')
    } catch (error) {
      console.error("Purchase error:", error)
      alert(`Error: ${error.reason || error.message}`)
    }
  }

  return (
    <div className="wide-container">
      <header>
      <h1>🎟️ Ticketify</h1>
      <div className="wallet-controls">
        <ConnectButton 
          account={account} 
          connectWallet={connectWallet} 
          isOwner={isOwner}
          logout={logout}
        />
      </div>
    </header>
  
      <div className="container">
        {isOwner && (
          <div className="owner-controls">
            <h2>Owner Dashboard</h2>
            <CreateEventForm 
              contract={contract} 
              onUpdate={(newContract) => {
                setContract(newContract)
                fetchEvents(newContract)
              }} 
            />
          </div>
        )}
  
        <section className="hero-section">
          <h2>Upcoming Events</h2>
            {isOwner && (
              <div className="stats-grid">
              <div className="feature-card">
                <h3>Total Events</h3>
                <p>{events.length}</p>
              </div>
              <div className="feature-card">
                <h3>Total Tickets Sold</h3>
                <p>{events.reduce((acc, event) => acc + event.ticketsSold, 0)}</p>
              </div>
              <div className="feature-card">
                <h3>Active Users</h3>
                <p>Coming Soon</p>
              </div>
            </div>
            )}
        </section>
        
  
        <section>
          <h2>Available Events</h2>
          <EventList 
            events={events} 
            onBuy={handleBuyTicket}
            account={account}
          />
        </section>
  
        {account && (
          <section className="ticket-section">
            <div>
              <h2>My Tickets</h2>
              <TicketList tickets={tickets} />
            </div>
            <div className="owner-controls">
              <h3>Account Overview</h3>
              <p>Connected Wallet: {account}</p>
              <p>Total Tickets: {tickets.length}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App