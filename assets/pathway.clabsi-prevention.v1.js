/* Source: green CLABSI Prevention Pathway worksheet, New NSI updated(4).xlsx */
window.PRAXSYS_CLABSI_PREVENTION_PATHWAY = {
  "id": "clabsi-prevention",
  "version": "1.0",
  "domain": "CLABSI",
  "pathwayType": "Device Prevention Observation",
  "device": "Central Line",
  "title": "CLABSI Prevention Observation Pathway",
  "shortTitle": "CLABSI Prevention",
  "steps": [
    {
      "id": 1,
      "title": "Continued Indication Review",
      "instruction": "Record the initial assessment before initiating removal or provider clarification.\n\nReview the central line order and documented indication.",
      "question": "Based on the patient’s current condition, does the patient continue to meet criteria for central venous access?",
      "source": "EHR Review / Clinical Judgment",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Criteria met",
          "next": 3
        },
        {
          "value": "no",
          "label": "No – Criteria not met",
          "next": 2,
          "recommendation": "Initiate the appropriate process for central line removal or communicate with the appropriate provider if provider input is required."
        },
        {
          "value": "unable",
          "label": "Unable to determine – Provider clarification needed",
          "next": 3,
          "recommendation": "Communicate with the appropriate provider to clarify continued need. Continue the observation while the central line remains in place."
        }
      ]
    },
    {
      "id": 2,
      "title": "Central Line Removal",
      "question": "Was the central line removed?",
      "source": "Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Central line removed",
          "next": 6
        },
        {
          "value": "no",
          "label": "No – Central line remains in place",
          "next": 3,
          "recommendation": "Continue the observation while the central line remains in place."
        }
      ]
    },
    {
      "id": 3,
      "title": "Central Line Maintenance Check",
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [],
      "question": "Were all expected central line maintenance practices met?",
      "source": "EHR Review / Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 4
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 4
        }
      ],
      "opportunities": [
        {
          "id": "maintenance-1",
          "label": "Insertion site assessment",
          "recommendation": "Assess the insertion site and communicate concerning findings to the appropriate care team member according to organizational policy."
        },
        {
          "id": "maintenance-2",
          "label": "Dressing integrity",
          "recommendation": "Replace a dressing that is damp, loose, visibly soiled, or otherwise compromised using aseptic technique according to organizational policy."
        },
        {
          "id": "maintenance-3",
          "label": "Catheter securement",
          "recommendation": "Secure the catheter according to organizational policy."
        },
        {
          "id": "maintenance-4",
          "label": "Dressing/site care",
          "recommendation": "Complete required dressing and site care according to organizational policy."
        },
        {
          "id": "maintenance-5",
          "label": "Chlorhexidine-containing dressing",
          "recommendation": "Apply the appropriate chlorhexidine-containing dressing when indicated according to organizational policy."
        },
        {
          "id": "maintenance-6",
          "label": "Administration set/needleless component change",
          "recommendation": "Replace administration sets or needleless components when due according to organizational policy."
        },
        {
          "id": "maintenance-7",
          "label": "Chlorhexidine bathing",
          "recommendation": "Complete chlorhexidine bathing when indicated according to organizational policy and document as required."
        }
      ]
    },
    {
      "id": 4,
      "title": "Central Line Access Observation",
      "question": "Was the central line accessed during the observation?",
      "source": "Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Line access observed",
          "next": 5
        },
        {
          "value": "no",
          "label": "No – Line access not observed",
          "next": 6
        }
      ]
    },
    {
      "id": 5,
      "title": "Central Line Access Practice",
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [],
      "question": "Were all expected line-access practices met?",
      "source": "Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 6
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 6
        }
      ],
      "opportunities": [
        {
          "id": "access-1",
          "label": "Hand hygiene before access",
          "recommendation": "Perform hand hygiene before accessing the central line."
        },
        {
          "id": "access-2",
          "label": "Hub/connector disinfection",
          "recommendation": "Disinfect the catheter hub, needleless connector, or injection port using the approved antiseptic and required mechanical friction time before access."
        },
        {
          "id": "access-3",
          "label": "Drying time",
          "recommendation": "Allow the disinfected connector to dry before accessing the line."
        },
        {
          "id": "access-4",
          "label": "Sterile access device",
          "recommendation": "Access the central line only with a sterile device."
        },
        {
          "id": "access-5",
          "label": "Aseptic access technique",
          "recommendation": "Stop the access process and correct the break in aseptic technique before proceeding. Replace contaminated equipment or supplies as needed."
        },
        {
          "id": "access-6",
          "label": "Hand hygiene after access",
          "recommendation": "Perform hand hygiene after completion of line access."
        }
      ]
    },
    {
      "id": 6,
      "title": "Observation Confirmation",
      "question": "Before completing the observation, confirm that any identified opportunities were addressed or communicated to the appropriate care team member.",
      "responses": [
        {
          "value": "confirmed",
          "label": "Confirmed",
          "next": null
        }
      ]
    }
  ]
};
