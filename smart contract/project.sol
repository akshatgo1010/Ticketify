// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract EventTickets is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    uint256 public eventIdCounter;
    
    struct Event {
        string name;
        uint256 maxTickets;
        uint256 ticketsSold;
        uint256 price;
        string metadataURI;
        bool exists;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => uint256) private _ticketToEvent;
    mapping(uint256 => address) private _ticketOwner;

    event EventCreated(uint256 eventId, string name, uint256 maxTickets, uint256 price);
    event TicketPurchased(address indexed buyer, uint256 eventId, uint256 tokenId);

    constructor() ERC721("EventTicket", "EVTKT") Ownable(msg.sender) {}
    
    function createEvent(
        string memory name,
        uint256 maxTickets,
        uint256 price,
        string memory metadataURI
    ) public onlyOwner {
        uint256 eventId = eventIdCounter++;
        require(!events[eventId].exists, "Event ID already exists");
        events[eventId] = Event({
            name: name,
            maxTickets: maxTickets,
            ticketsSold: 0,
            price: price,
            metadataURI: metadataURI,
            exists: true
        });
        emit EventCreated(eventId, name, maxTickets, price);
    }

    function buyTicket(uint256 eventId) public payable nonReentrant {
        require(events[eventId].exists, "Event does not exist");
        Event storage evt = events[eventId];
        
        require(msg.value >= evt.price, "Insufficient payment");
        require(evt.ticketsSold < evt.maxTickets, "Event sold out");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        _ticketToEvent[tokenId] = eventId;
        _ticketOwner[tokenId] = msg.sender;
        evt.ticketsSold++;

        if (msg.value > evt.price) {
            payable(msg.sender).transfer(msg.value - evt.price);
        }

        emit TicketPurchased(msg.sender, eventId, tokenId);
    }

    function getTicketEvent(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        return _ticketToEvent[tokenId];
    }

    // Required overrides for ERC721Enumerable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        require(
            _ticketOwner[tokenId] == address(0) || // Allow initial mint
            to == address(0),                      // Allow burning
            "This ticket is non-transferrable"
        );
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return events[_ticketToEvent[tokenId]].metadataURI;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function burnTicket(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        _burn(tokenId);
        delete _ticketOwner[tokenId];
    }
}