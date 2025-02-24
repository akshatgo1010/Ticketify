import React from 'react';

export const TicketList = ({ tickets }) => (
  <div className="ticket-grid">
    {tickets.map(ticket => (
      <div key={ticket.tokenId} className="ticket-card">
        <h3>{ticket.name}</h3>
        <div className="ticket-details">
          <p>Seat Number: #{ticket.tokenId}</p>
          <p>Event ID: {ticket.eventId}</p>
        </div>
        <a 
          href={ticket.metadataURI} 
          target="_blank" 
          rel="noopener noreferrer"
          className="metadata-link"
        >
          View Ticket Details
        </a>
      </div>
    ))}
  </div>
);