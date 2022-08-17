# Firebase

## Firebase vs Rails
| Rails:                             | Firebase                             |
|------------------------------------|--------------------------------------|
| + You chose where to host          | - Hosted on google cloud             |
| - You need to organize all scaling | + Scaling happens automatically      |

## Advantages
- uses googles CDN
- has SSL
- has (nosql-)database
    - changes on database can be listened to in real-time (good for chats)
- has auth
- has file-storage
- ecommerce seems possible too: https://www.youtube.com/watch?v=suSru31zjoA

## Costs
Free for experiments
Costs then scale linearly

##  Local SDK
`npm install -g firebase-tools`
`firebase login`
`firebase init` <- creates a node-app skeleton to be deployed on firebase
`firebase init functions` <- triggerable backend-code
`firebase serve` <- local dev-environment
`firebase deploy` <- puts app online
