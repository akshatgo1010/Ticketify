import React, { useState } from 'react'
import { ethers } from 'ethers'

export const CreateEventForm = ({ contract, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    maxTickets: '',
    price: '',
    metadataURI: '',
    image: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const tx = await contract.createEvent(
        formData.name,
        formData.maxTickets,
        ethers.parseEther(formData.price),
        formData.metadataURI
      )
      await tx.wait()
      const newContract = contract.connect(contract.runner)
      onUpdate(newContract)
      setFormData({
        name: '',
        maxTickets: '',
        price: '',
        metadataURI: ''
      })
      alert('Event created successfully!')
    } catch (error) {
      alert(`Error: ${error.reason || error.message}`)
    }
  }

  return (
    <div className="create-event-form">
      <h3>Create New Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Max Tickets:</label>
          <input
            type="number"
            value={formData.maxTickets}
            onChange={(e) => setFormData({...formData, maxTickets: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Price (ETH):</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Metadata URI:</label>
          <input
            type="url"
            value={formData.metadataURI}
            onChange={(e) => setFormData({...formData, metadataURI: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  )
}