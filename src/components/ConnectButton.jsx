import React from 'react';

export const ConnectButton = ({ account, connectWallet, isOwner, logout }) => (
  <div className="wallet-info" style={{ display: 'flex', gap: '1rem' }}>
    {account ? (
      <>
        <div className="connected-account">
          <i className="fas fa-wallet"></i>
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          {isOwner && <span className="owner-badge">Owner</span>}
        </div>
        <button onClick={logout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </>
    ) : (
      <button onClick={connectWallet} className="connect-button">
        <i className="fas fa-wallet"></i>
        Connect Wallet
      </button>
    )}
  </div>
)