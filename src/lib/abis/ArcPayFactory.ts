export const ArcPayFactoryABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_usdc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_treasury",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "escrowVault",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract EscrowVault"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "feeManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract FeeManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProtocolAddresses",
    "inputs": [],
    "outputs": [
      {
        "name": "_paymentLink",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_invoice",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_splitRouter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_escrowVault",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_feeManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_privacyShield",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "invoice",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract Invoice"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "paymentLink",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract PaymentLink"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "privacyShield",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract PrivacyShield"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "splitRouter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract SplitRouter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "treasury",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "usdc",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProtocolDeployed",
    "inputs": [
      {
        "name": "paymentLink",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "invoice",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "splitRouter",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "escrowVault",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "feeManager",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "privacyShield",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ZeroAddress",
    "inputs": []
  }
] as const
