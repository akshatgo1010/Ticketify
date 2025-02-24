import React from 'react';

export const EventList = ({ events, onBuy, account }) => (
  <div className="event-grid">
    {events.map(event => (
      <div key={event.id} className="event-card">
        <h3>{event.name}</h3>
        <div className="event-details">
          <p>Event ID: {event.id}</p>
          <p>Price: {event.price} ETH</p>
          <p>Tickets Available: {event.maxTickets - event.ticketsSold}</p>
        </div>
        {account && (
          <button 
            onClick={() => onBuy(event.id, event.price)}
            disabled={event.ticketsSold >= event.maxTickets}
            className="buy-button"
          >
            {event.ticketsSold >= event.maxTickets ? 'Sold Out' : 'Buy Ticket'}
          </button>
        )}
      </div>
    ))}
  </div>
);