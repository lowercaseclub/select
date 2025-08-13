Run this command to get data:

```
curl -X GET "https://api.bizzabo.com/v1/events/756187/agenda/sessions" -H "Authorization: Bearer $(curl -s -X POST https://auth.bizzabo.com/oauth/token -H "Content-Type: application/json" -d '{"client_id":"_kcxTZb9HJQh_nk63k3wicBdnm1uVJpnyFDUgpRpGSs","client_secret":"663lg7K7VRtZoY4n7Zp3vrdRgLQaLgYFnkEnN3QWTSPFO9QsLZ1GrkC2RnnP43qu","audience":"https://api.bizzabo.com/api","grant_type":"client_credentials","account_id":209895}' | jq -r '.access_token')" | jq .
```

You will get this output:

```
{
  "links": [
    {
      "rel": "self",
      "href": "https://api.bizzabo.com/v1/events/756187/agenda/sessions"
    }
  ],
  "content": [
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session C",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "ekpD59oiGSjYn",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 900,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 840,
      "id": 1712198
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session A",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "bBrDABeGk2hqF",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 720,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 660,
      "id": 1712195
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session B",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "xvGLlaVfi1yxl",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 840,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 780,
      "id": 1712197
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327181
          ]
        }
      ],
      "description": "Join Supabase co-founders Paul Copplestone and Ant Wilson, plus some very special guests, as they talk about building with data.",
      "private": false,
      "registration": false,
      "title": "Keynote",
      "speakers": [
        {
          "speakerId": 3757964,
          "role": "Keynote"
        }
      ],
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "3zEeychlltwOJ",
      "descriptionHtml": "<p>Join Supabase co-founders Paul Copplestone and Ant Wilson, plus some very special guests, as they talk about building with data.</p>",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "recordingSession": {
        "id": 344989,
        "accountId": 209895,
        "eventId": 756187,
        "sessionId": 1712194,
        "broadcastRecording": false,
        "recordingPrimaryAssetType": "ORIGINAL",
        "recordingAuthorization": [
          {
            "authorizationType": "TICKET_TYPE",
            "authorizationValue": [
              646762
            ]
          }
        ],
        "recordingIsReady": false
      },
      "locationId": 131741,
      "endMinute": 660,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 600,
      "id": 1712194
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session E",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "g6yJf7IenM0Ii",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 1020,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 960,
      "id": 1712200
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session D",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "2Xq3i53v4g3KW",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 960,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 900,
      "id": 1712199
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327184
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Party",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "ACYVeEAjD2TvM",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131743,
      "endMinute": 1200,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 1080,
      "id": 1712202
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327184
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Lunch",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "QcPUxyJaO6epC",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131743,
      "endMinute": 780,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 720,
      "id": 1712196
    },
    {
      "filters": [
        {
          "id": 130035,
          "tags": [
            1327182
          ]
        }
      ],
      "private": false,
      "registration": false,
      "title": "Session F",
      "endDate": "2025-10-03T23:59:59.000+0000",
      "allowRating": false,
      "startDate": "2025-10-03T00:00:00.000+0000",
      "externalId": "C8oG1DoGmKBDO",
      "registrationCapacityEnable": false,
      "sessionCardSize": "large",
      "enableVirtualSession": false,
      "associatedContacts": {},
      "registrationVisibility": false,
      "registrationFull": false,
      "locationId": 131741,
      "endMinute": 1080,
      "onsiteVisibility": {
        "type": "PUBLIC"
      },
      "hidden": false,
      "startMinute": 1020,
      "id": 1712201
    }
  ],
  "page": {
    "size": 50,
    "totalElements": 9,
    "totalPages": 1,
    "number": 0
  }
}
```